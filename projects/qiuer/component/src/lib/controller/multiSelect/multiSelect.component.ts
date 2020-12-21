/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { BaseSelectControllerMetadata, BaseSelectControllerComponent } from '../baseSelect.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface MultiSelectControllerMetadata extends BaseSelectControllerMetadata {
  showType?: string; // 选择结果显示方式,number 已选n行 string value拼接  //TODO 待观察
  onClose?: string; // 面板关闭时发生的事件,返回参数 hasChange: boolean
  canSelectAll?: boolean; //  是否可以全选 默认可以全选
  canHoverData?: boolean; // 是否可以hover显示数据 默认不显示
  hoverLength?: number; // hover显示数据长度 默认显示前十条
  haveClear?: boolean; // 是否有清除按钮 默认false
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/* set/get showType 设置结果显示方式
/* set chooseAll 是否全选
/* chlaer() 清除选择
/***********************************************************************************/
@Component({
  selector: 'multiselect-ctrl',
  templateUrl: './multiSelect.component.html',
  styleUrls: ['./multiSelect.component.scss']
})
export class MultiSelectControllerComponent extends BaseSelectControllerComponent implements OnInit, OnDestroy {
  protected _metadata: MultiSelectControllerMetadata;
  public _showType: string;
  public mouserOnHelpButton = false;
  public _canSelectAll = true;
  public _canHoverData = false;
  public _hoverLength: number;
  private opendValue: any; // 记录打开时的value；
  private _onClose: any; // 记录_onClose
  public selectTip: string; // 显示已选择数据
  public _haveClear: boolean;
  private onFilterChange: Subject<any> = new Subject<any>();


  constructor(public _service: ContainerService, public _ctrlService: ControllerService, public changeRef: ChangeDetectorRef) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: any) {
    value = this._metadata.valueType === 'singleletter' && typeof value === 'string' ?
      value.split('') : value;
    const newArray = this.transformValue(value);
    if (this.options && this.options.length > 0) {
      this._innerValue = null;
      this._formControl.setValue(newArray);
    } else {
      this._innerValue = newArray;
    }
  }

  public get value(): any {
    if (!this._formControl.value || this._formControl.value == null) {
      return this._formControl.value;
    }
    const newArray = [];
    for (const i of this._formControl.value) {
      newArray.push(this._valueType.getValue(i));
    }
    return this._metadata.valueType === 'singleletter' ? newArray.join('') : newArray;
  }

  public set showType(showType: string) {
    this._showType = showType;
  }

  public get showType() {
    return this._showType;
  }

  public set canSelectAll(canSelectAll: boolean) {
    this._canSelectAll = !!canSelectAll;
  }

  public get canSelectAll() {
    return this._canSelectAll;
  }

  public set canHoverData(canHoverData: boolean) {
    this._canHoverData = !!canHoverData;
  }

  public get canHoverData() {
    return this._canHoverData;
  }

  public set hoverLength(hoverLength: number) {
    this._hoverLength = hoverLength;
  }

  public get hoverLength() {
    return this._hoverLength;
  }




  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this.showType = this._metadata.showType || 'number';
    this._onClose = this._metadata.onClose;
    this.canSelectAll = this._metadata.canSelectAll;
    this.canHoverData = this._metadata.canHoverData;
    this.hoverLength = this._metadata.hoverLength || 10;
    this._haveClear = this._metadata.haveClear || false;
    if (this._metadata.hasFilter !== undefined) {
      this._hasFilter = this._metadata.hasFilter;
    } else {
      this._hasFilter = false;
    }
    this.onFilterChange.pipe(
      debounceTime(300)
    ).subscribe(res => {
      this.filterValue = res;
      this.changeRef.detectChanges();
    });
    if (this.canHoverData) {
      this.subs(this.id, 'valueChange', (e) => {
        this._setSelectTip(e);
        // console.log('+++++++', this.selectTip, e, this);
      });
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.onFilterChange.unsubscribe();
  }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                              继承                                               */
  /***********************************************************************************/


  /***********************************************************************************/
  /*                              私有inherit                                        */
  /***********************************************************************************/



  public openedChange(event, search) {
    search.value = '';
    this._fileredOptions = this._options;
    if (event) {
      this.openPanel();
    } else {
      this.closePanel();
    }

  }
  public openPanel() {
    this.opendValue = this._formControl.value;
  }
  public closePanel() {
    const hasChange = this.opendValue !== this._formControl.value;
    if (this._onClose !== undefined && this._onClose !== null && this._onClose !== '') {
      this.call('onClose', hasChange);
    }
  }

  public chooseAll() {
    this._formControl.setValue(this.options);
  }

  public clear() {
    this._fileredOptions = this._options;
    this._formControl.setValue([]);
  }
  public transFromParam(urlParam: string) {
    return null;
  }

  _setSelectTip(val: any[]) {
    let htmlStr = '';
    let newHtml = '';
    this._options.forEach(element => {
      const option = this._metadata.option;
      htmlStr += val.indexOf(element[option.value]) > -1 ? element[option.label] + '\n' : '';
    });
    // console.log('**************' + htmlStr);
    if (htmlStr.split('\n').length > (this.hoverLength + 1)) {
      let select = [];
      select = htmlStr.split('\n').slice(0, this.hoverLength);
      for (let i = 0; i < select.length; i++) {
        newHtml += select[i] + '\n';
      }
      newHtml += '......';
      this.selectTip = newHtml;
    } else {
      this.selectTip = htmlStr;
    }
  }

  _masterToggle() {
    const value = [];
    for (const j of this._formControl.value) {
      value.push(j);
    }
    if (this._isAllSelected()) {
      for (const i of this._options) {
        if (value.indexOf(i) !== -1) {
          value.splice(value.indexOf(i), 1);
        }
      }
    } else {
      for (const i of this._options) {
        if (value.indexOf(i) === -1) {
          value.push(i);
        }
      }
    }
    this._formControl.setValue(value);
  }
  _isAllSelected() {
    const value = this._formControl.value;
    if (!value || value.length < 1 || !this._options || this._options.length < 1) {
      return false;
    }
    for (const i of this._options) {
      if (value.indexOf(i) === -1) {
        return false;
      }
    }
    return true;
  }
  _indeterminate() {
    const value = this._formControl.value;
    if (!value || value.length < 1 || !this._options || this._options.length < 1) {
      return false;
    }
    const isAllSelected = this._isAllSelected();
    for (const i of this._options) {
      if (value.indexOf(i) !== -1 && !isAllSelected) {
        return true;
      }
    }
    return false;
  }


  _filterChange(value) {
    this.onFilterChange.next(value);
  }
  public transformValue(value: any[]) {
    const newArray = [];
    if (value && value instanceof Object) {
      for (const i of value) {
        const v = this._valueType.setValue(this._options, i);
        if (v !== null) {
          newArray.push(v);
        }
      }
    }
    return newArray;
  }

}
