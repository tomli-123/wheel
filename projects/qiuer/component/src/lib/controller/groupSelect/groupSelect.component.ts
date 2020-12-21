/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/* 2019/6/26 贾磊更新 增加isHtmlLable属性 label是否为html
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { BaseSelectControllerMetadata, BaseSelectControllerComponent } from '../baseSelect.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface GroupSelectOption {
  groupLabel: string; // groupLabel 用作分组显示字段
  groupOptions: string; // groupOptions用作循环
  label?: string;
  value?: string;
}
export interface GroupSelectControllerMetadata extends BaseSelectControllerMetadata {
  emptyLabel?: string; // 空选项标签, required=true就不会显示
  hasClear?: boolean;
  option: GroupSelectOption;
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value  当value不存在与options时 值为null
/* set hasClear 是否有清除按钮
/* set/get emptyLabel 设置空选项标签
/* option函数化 TODO
/***********************************************************************************/
@Component({
  selector: 'groupSelect-ctrl',
  templateUrl: './groupSelect.component.html',
  styleUrls: ['./groupSelect.component.scss']
})
export class GroupSelectControllerComponent extends BaseSelectControllerComponent implements OnInit, OnDestroy {

  protected _metadata: GroupSelectControllerMetadata;
  public _option: GroupSelectOption;
  private onFilterChange: Subject<any> = new Subject<any>();
  public _hasClear: boolean;
  public _emptyLabel: string;
  public mouserOnHelpButton = false;
  private _specialOptions: any[];
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }


  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set hasClear(hasClear: boolean) {
    this._hasClear = !!hasClear;
  }

  public set emptyLabel(emptyLabel: string) {
    if (!this._metadata.required) {
      this._emptyLabel = emptyLabel;
    }
  }
  public get emptyLabel(): string {
    return this._emptyLabel;
  }

  public set value(value: any) {
    const transformValue = this.transformValue(value);
    const valueType = this._metadata.type || 'string';
    if ((this.options && this.options.length > 0) || valueType.toLowerCase() === 'object' || value === null) {
      this._innerValue = undefined;
      this._formControl.setValue(transformValue);
    } else {
      this._innerValue = transformValue;
    }
  }
  public get value(): any {
    return this._valueType.getValue(this._formControl.value);
  }



  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    // console.log('onInit select');
    const metadata: GroupSelectControllerMetadata = this._metadata;
    this._option = metadata.option;
    super.ngOnInit();
    this.hasClear = metadata.hasClear;
    this.emptyLabel = metadata.emptyLabel;
    this.onFilterChange.pipe(
      debounceTime(300)
    ).subscribe(res => {
      this.filterValue = res;
    });

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.onFilterChange.unsubscribe();
  }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                               继承  inherit                                     */
  /***********************************************************************************/
  public set options(options: string | any[]) {
    if (options === undefined || options === null || options === '') {
      this._options = [];
      return;
    }
    if (options === undefined) { return; }
    // 当value不存在与options时 值为null TODO 无用待删除
    try {
      if (options instanceof Array) {
        this._options = options;
      } else {
        this._options = JSON.parse(options);
      }

    } catch (error) {
      console.error('options转换出错');
      console.error(options);
      console.error(error);

    }

    // this._options = options;
    // 创建特殊副本 用作过滤
    this._specialOptions = this._getSpecialOptions(options);
    this._fileredOptions = this._specialOptions;
    this._resetValue();
  }

  public get options(): string | any[] {
    return this._options;
  }

  public set filterValue(filterValue: string) {
    this._filterOptions(filterValue, this._specialOptions);
  }
  /***********************************************************************************/
  /*                                私有 for private                                 */
  /***********************************************************************************/
  _getSpecialOptions(options): any {
    const specialOptions = [];
    for (const group of options) {
      if (group[this._option.groupOptions] !== undefined && group[this._option.groupOptions] instanceof Array === true) {
        for (const item of group[this._option.groupOptions]) {
          specialOptions.push(item);
        }
      }
    }
    return specialOptions;
  }

  _filterChange(value): void {
    this.onFilterChange.next(value);
  }

  public openedChange(search): void {
    search.value = '';
    this._fileredOptions = this._specialOptions;
  }

  public transFromParam(urlParam: string): any {
    return this._valueType.transFromParam(urlParam);
  }

  public transformValue(value: any): any {

    /*如果没有options直接返回value,用做innerValue*/
    if (this._options && this._options !== null && this._options.length > 0 && value !== undefined) {
      /* 循环组内options字段 来取value 取到则返回*/
      /* 如果是对象型按照select.valuetype中的逻辑做特殊处理*/
      for (const group of this._options) {
        const transformValue = this._valueType.setValue(group[this._option.groupOptions], value);
        if (transformValue !== null || (value instanceof Object === true && transformValue !== value)) {
          return transformValue;
        }
      }
      if (value instanceof Object !== true) {
        return null;
      } else {
        return value;
      }
    }

    return value;
  }
}
