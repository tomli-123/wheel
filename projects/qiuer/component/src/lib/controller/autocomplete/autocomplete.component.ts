/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/***********************************************************************************/
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ContainerEvent, ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { BaseSelectControllerMetadata, BaseSelectControllerComponent } from '../baseSelect.component';
import { debounceTime } from 'rxjs/operators';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface AutocompleteControllerMetadata extends BaseSelectControllerMetadata {
  matched?: boolean; // 要求强制匹配select才输出value
  debounce?: number; // 去抖延迟
  useEmptyAsString?: boolean; // 是否用空字符串作为空值 默认为false
  hasClear?: boolean;
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/* set/get options
/* get valid 返回验证
/* set filter 设置filter
/* get momentValue 返回此时的Input的value
/***********************************************************************************/
@Component({
  selector: 'autocomplete-ctrl',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteControllerComponent extends BaseSelectControllerComponent implements OnInit, AfterViewInit {

  @ViewChild('autocomplete', { static: true }) autocomplete;
  protected _metadata: AutocompleteControllerMetadata;
  public _hasClear: boolean;
  public matched: boolean;
  protected _optLabel: string;
  protected _valueMatched = false; // 由select匹配后设为true
  protected _debounce: number;
  public _filterField: string;
  public mouserOnHelpButton = false;
  private useEmptyAsString: boolean;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, private changeRef: ChangeDetectorRef) {
    super(_service, _ctrlService);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /**********************************************************************************/

  public set value(value: any) {
    const _value = this.transformValue(value);
    this._formControl.setValue(_value);
  }

  public get value(): any {
    if (this.matched) { // 精确匹配
      if (this._valueMatched) { // 匹配上了
        return this._valueType.getValue(this._formControl.value);
      } else { return null; }
    } else { // 随意
      if (this._valueMatched) { // 匹配上了
        return this._valueType.getValue(this._formControl.value);
      } else {
        let value;
        try {
          value = this._valueType.getValue(this._formControl.value);
        } catch (e) { value = this._formControl.value; }
        if (value === undefined || value === '' || value === null) {
          return this.useEmptyAsString ? '' : null;
        } else {
          return value;
        }
      }
    }
  }

  public get valid(): boolean {
    return this._valueMatched;
  }

  public set filterField(fieldName: string) {
    this._filterField = fieldName;
  }

  public set hasClear(hasClear: boolean) {
    this._hasClear = !!hasClear;
  }

  public get momentValue(): any {
    return this._formControl.value;
  }

  public set options(options: string | any[]) {
    if (options === undefined || options === null || options === '') {
      this._options = [];
      return;
    }
    try {
      this._options = this._fileredOptions = options instanceof Array ? options : JSON.parse(options);
    } catch (error) {
      console.error('options转换出错');
      console.error(options);
      console.error(error);
    }
  }

  public get options(): string | any[] {
    return this._options;
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/

  ngOnInit(): void {
    const metadata: AutocompleteControllerMetadata = this._metadata;
    this._debounce = metadata.debounce || 0;
    super.ngOnInit();
    this.matched = metadata.matched || false;
    this.useEmptyAsString = metadata.useEmptyAsString || false;
    this.hasClear = metadata.hasClear;
    this._formControl.valueChanges.subscribe(() => {
      this._valueMatched = false;
      if (this._hasFilter) {
        if (typeof this.momentValue === 'object') {
          this._fileredOptions = [];
          return;
        } else {
          this.filterValue = this.momentValue;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // 将label放入到autocomplete的执行环境中以便displayFn时this可以取到_optLabel
    this.autocomplete['_optLabel'] = this._valueType.label;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                               继承                                              */
  /***********************************************************************************/
  public transformValue(value: any): any {
    return this._valueType.setValue(this._options, value);
  }

  public transFromParam(urlParam: string): any {
    return this._valueType.transFromParam(urlParam);
  }

  protected registerEvent(): void {
    this.registerValueChangeEvent();
    this.registerStatusChangeEvent();
  }

  protected registerValueChangeEvent(): void {
    const valueChangeEvent = new ContainerEvent('valueChange',
      this._formControl.valueChanges.pipe(debounceTime(this._debounce)), '(value,event)');
    this._setCallbackEvent(valueChangeEvent);
    this._setDoEventFunction(valueChangeEvent, (func: Function, v: any) => {
      func(this.value, 'onValueChange');
    });
  }

  protected registerStatusChangeEvent(): void {
    const statusChangeEvent = new ContainerEvent('statusChange',
      this._formControl.statusChanges.pipe(debounceTime(this._debounce)), '(status,event)');
    this._setCallbackEvent(statusChangeEvent);
    this._setDoEventFunction(statusChangeEvent, (func: Function, v: any) => {
      func(v, 'onStatusChange');
    });
  }


  public iptFocus(): void {
    // console.log(this.autocomplete);
    // setTimeout(() => {
    //   if (this.autocomplete.isOpen && this.autocomplete.panel) {
    //     // this.autocomplete.openPanel();
    //     // const eleArr = this.autocomplete.panel.nativeElement.querySelectAll('.mat-option');
    //     console.log(this.autocomplete.panel.nativeElement);
    //     if (this.autocomplete.panel.nativeElement) {
    //       const eleArr = this.autocomplete.panel.nativeElement.querySelectorAll('.mat-option');
    //       console.log(eleArr);
    //     }
    //   }
    // });
  }
  /***********************************************************************************/
  /*                               继承                                              */
  /***********************************************************************************/


  /***********************************************************************************/
  /*                               私有                                              */
  /***********************************************************************************/

  // private toFilter() {
  //   if (this.momentValue === null || this.momentValue === '') {
  //     this._options = this._optionsSource;
  //   } else if (typeof this.momentValue === 'object' || this._valueMatched === true) {
  //     this._options = [];
  //   } else {
  //     this._options = this._optionsSource.filter((item) => {
  //       if (typeof item !== 'object') {
  //         if (item.toString().includes(this.momentValue)) {
  //           return true;
  //         }
  //       }

  //       if (typeof item === 'object' && this._filterField !== null) {
  //         if (!item[this._filterField]) {
  //           return false;
  //         }
  //         if (item[this._filterField].toString().toLowerCase().includes(this.momentValue.toString().toLowerCase())) {
  //           return true;
  //         }
  //       }

  //       if (typeof item === 'object' && this._filterField === null) {
  //         for (const property in item) {
  //           if (item[property] === null) {
  //             continue;
  //           }
  //           if (item[property].toString().toLowerCase().includes(this.momentValue.toString().toLowerCase())) {
  //             return true;
  //           }
  //         }
  //       }
  //       return false;
  //     });
  //   }
  // }

  public displayFn(obj): any {
    return obj ? obj[this._optLabel] : obj;
  }

  public optionSelected(): void {
    this._valueMatched = true;
  }

}
