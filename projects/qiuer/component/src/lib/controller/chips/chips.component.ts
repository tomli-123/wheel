/***********************************************************************************/
/* author: 杨强伟
/* update logs:
/* 2019/6/10 杨强伟 创建
/* update 2019/7/3 谢祥 修改重写组件，添加options， option， isMulti 属性
/* update 20190919 谢祥 重写组件， 添加 isWithInput， onSelect， onDelete, onFilterChange, onFilterFocus属性
/* update 20200102 谢祥 添加是否可新增和新增时触发方法属性 isCanAdd,onAdd
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { HaveSelectControllerMetadata, HaveSelectControllerComponent } from '../haveSelect.component';
import { ENTER } from '@angular/cdk/keycodes';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ChipsControllerMetadata extends HaveSelectControllerMetadata {
  isMulti?: boolean; // 是否为多选
  isWithInput?: boolean; // 是否有input模块
  isHtmlLabel?: boolean; // label是否是一段html
  isCanSelect?: boolean; // 是否有选择功能
  isCanDelete?: boolean; // 是否可以删除

  /**
   * Input独有属性
   */
  isCanAdd?: boolean; // 是否可以添加
  // isAddToEnter?: boolean; // enter键是否触发add方法 (必须触发)


  onSelect?: string; // select时触发函数
  onDelete?: string; // delete时触发函数
  onFilterChange?: string; // input值变化时触发
  onFilterFocus?: string; // input获取焦点时触发
  onAdd?: string; // 新增时触发
}
/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get
/***********************************************************************************/
@Component({
  selector: 'chips-ctrl',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsControllerComponent extends HaveSelectControllerComponent implements OnInit, OnDestroy {

  public _metadata: ChipsControllerMetadata;
  public _isMulti: boolean;
  public _isHtmlLabel: boolean;
  public _isWithInput: boolean;
  public _isCanSelect: boolean;
  public _isCanDelete: boolean;
  public _onDelete: Function;
  public _onSelect: Function;
  public _onFilterChange: Function;
  public _onFilterFocus: Function;
  public _onAdd: Function;
  public _separatorKeysCodes: Array<any> = []; // 添加的快捷键(enter)
  public _isCanAdd: boolean;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, private changeRef: ChangeDetectorRef) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set onDelete(onDelete: string) { this._onDelete = this._compileCallbackFunction(onDelete); }
  public get onDelete(): string { return this._onDelete.toString(); }

  public set onSelect(onSelect: string) { this._onSelect = this._compileCallbackFunction(onSelect); }
  public get onSelect(): string { return this._onSelect.toString(); }

  public set onFilterFocus(onFilterFocus: string) { this._onFilterFocus = this._compileCallbackFunction(onFilterFocus); }
  public get onFilterFocus(): string { return this._onFilterFocus.toString(); }

  public set onFilterChange(onFilterChange: string) { this._onFilterChange = this._compileCallbackFunction(onFilterChange); }
  public get onFilterChange(): string { return this._onFilterChange.toString(); }

  public set onAdd(onAdd: string) { this._onAdd = this._compileCallbackFunction(onAdd); }
  public get onAdd(): string { return this._onAdd.toString(); }

  public set value(value: any[]) {
    if (value && value instanceof Array) {
      this._formControl.setValue(value);
    }
  }
  public get value(): any[] { return this._formControl.value || []; }

  public set isCanSelect(isCanSelect: boolean) {
    this._isCanSelect = !!isCanSelect;
    if (!this._isCanSelect) {
      this.value = Object.assign([], this.options).map(item => item = item[this._valueType.value]);
    }
  }
  public get isCanSelect(): boolean { return this._isCanSelect; }

  public set options(options: string | any[]) {
    if (options === undefined || options === null || options === '') {
      this._options = [];
      return;
    }
    try {
      if (options instanceof Array) {
        this._options = options;
      } else { this._options = JSON.parse(options); }
    } catch (error) {
      console.error('options转换出错');
      console.error(options);
      console.error(error);
    }
    this._resetValue();
    this.changeRef.detectChanges();
  }
  public get options(): string | any[] { return this._options; }

  public set isCanDelete(isCanDelete: boolean) { this._isCanDelete = !!isCanDelete; }
  public get isCanDelete(): boolean { return this._isCanDelete; }

  public set isCanAdd(isCanAdd: boolean) {
    this._isCanAdd = isCanAdd;
    this._separatorKeysCodes = isCanAdd ? [ENTER] : [];
  }
  public get isCanAdd(): boolean { return this._isCanAdd; }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this._isMulti = !!this._metadata.isMulti;
    this._isHtmlLabel = !!this._metadata.isHtmlLabel;
    this._isWithInput = !!this._metadata.isWithInput;
    this.isCanSelect = !!this._metadata.isCanSelect;
    this.isCanDelete = !!this._metadata.isCanDelete;
    this.isCanAdd = !!this._metadata.isCanAdd;
    this.onSelect = this._metadata.onSelect;
    this.onDelete = this._metadata.onDelete;
    this.onFilterChange = this._metadata.onFilterChange;
    this.onFilterFocus = this._metadata.onFilterFocus;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  add(event): void {
    if (event.value) {
      this._options.push(event.value);
      this.options = this._options;
      if (this._onAdd) { this._onDelete(event.value); }
      if (event.input) { event.input.value = ''; }
    }
  }

  remove(option, index): void {
    // console.log(option, index, this.options);
    if (this._isCanSelect) {
      let _value = Object.assign([], this.value);
      if (option[this._valueType.value] instanceof Object) {
        for (let i = _value.length - 1; i > -1; i--) {
          if (this._ctrlService.isObjectValueEqual(option[this._valueType.value], _value[i])) {
            _value.splice(i, 1);
            break;
          }
        }
      } else {
        _value = _value.filter(item => item !== option[this._valueType.value]);
      }
      this.value = _value;
    }
    this._options.splice(index, 1);
    this.options = this._options;
    if (this._onDelete) { this._onDelete(option, index); }
  }

  inputValueChange(event): void {
    if (this._onFilterChange && this._onFilterChange instanceof Function) {
      this._onFilterChange(event.target.value);
    }
  }

  inputFocus(): void {
    if (this._onFilterFocus && this._onFilterFocus instanceof Function) {
      this._onFilterFocus();
    }
  }

  checked(option): void {
    if (this._isCanSelect) {
      let _value = JSON.parse(JSON.stringify(this.value));
      if (option[this._valueType.value] instanceof Object) {
        if (_value.length > 0) {
          let isHave = false;
          for (let i = _value.length - 1; i > -1; i--) {
            if (this._ctrlService.isObjectValueEqual(option[this._valueType.value], _value[i])) {
              _value.splice(i, 1);
              isHave = true;
              break;
            }
          }
          if (!isHave) {
            this._isMulti ? _value.push(option[this._valueType.value]) : _value = [option[this._valueType.value]];
          }
        } else { _value.push(option[this._valueType.value]); }
      } else {
        if (_value.indexOf(option[this._valueType.value]) > -1) {
          _value = _value.filter(item => item !== option[this._valueType.value]);
        } else {
          this._isMulti ? _value.push(option[this._valueType.value]) : _value = [option[this._valueType.value]];
        }
      }
      this.value = _value;
      if (this._onSelect) { this._onSelect(_value); }
    }
  }

  _getSelected(option): any {
    let _isSelect = false;
    if (option[this._valueType.value] instanceof Object) {
      this.value.forEach(item => {
        _isSelect = this._ctrlService.isObjectValueEqual(option[this._valueType.value], item);
      });
    } else {
      _isSelect = this.value.indexOf(option[this._valueType.value]) > -1;
    }
    return _isSelect;
  }

}
