import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { debounceTime } from 'rxjs/operators';


// demo : https://www.ag-grid.com/javascript-grid-cell-editor/#react-methods-lifecycle

export interface AggridEditorInputParams {
  tip?: string;
  lable?: string;
  valueType?: string;
  prefixHtml?: string; // 前置
  suffixHtml?: string; // 后置
  useEmptyAsString?: boolean; // 是否使用空字符串作为空值 默认值为false;
  debounceTime?: number; // 默认300 TODO 考虑要不要自定义change事件
  pattern: string;
  patternMsg: string;
  required: boolean;
  requiredMsg: string;
}

export enum ValueTypes {
  string = 'string',
  number = 'number',
  password = 'password',
  email = 'email'
}


@Component({
  templateUrl: './aggrid-editor-input.component.html',
  styleUrls: ['./aggrid-editor-input.component.scss']
})
export class AggridEditorInputComponent implements ICellEditorAngularComp, AfterViewInit {
  @ViewChild('input', { static: true }) input: any;
  private component: any;
  private params: AggridEditorInputParams;
  private oldValue: any;
  public _formControl: FormControl = new FormControl();
  public _tip: string;
  public _label: string;
  public _valueType: string;
  public _prefixHtml: string; // 前置
  public _suffixHtml: string; // 后置
  public _useEmptyAsString: boolean; // 是否使用空字符串作为空值 默认值为false;
  public _debounceTime: number; // 默认300
  public _pattern: string;
  public _patternMsg: string;
  public _required: boolean;
  public _requiredMsg: string;
  agInit(params: any): void {
    this.component = params;
    this.oldValue = this.component.value;
    this._formControl.setValue(this.oldValue);
    this.params = this.component.colDef.cellEditorParams;
    if (this.params.tip !== undefined) {
      this._tip = this.params.tip;
    }
    if (this.params.lable !== undefined) {
      this._label = this.params.lable || '';
    }
    if (this.params.valueType !== undefined) {
      this._valueType = this.params.valueType || 'string';
    }
    if (this.params.useEmptyAsString !== undefined) {
      this._useEmptyAsString = this.params.useEmptyAsString || false;
    }
    if (this.params.debounceTime !== undefined) {
      this._debounceTime = this.params.debounceTime || 300;
    }
    if (this.params.prefixHtml !== undefined) {
      this._prefixHtml = this.params.prefixHtml || '';
    }
    if (this.params.suffixHtml !== undefined) {
      this._suffixHtml = this.params.suffixHtml || '';
    }
    this.required = this.params.required;
    if (this.params.requiredMsg !== undefined) {
      this._requiredMsg = this.params.requiredMsg || '';
    }
    this.pattern = this.params.pattern;
    if (this.params.patternMsg !== undefined) {
      this._patternMsg = this.params.patternMsg || '';
    }
  }


  public set required(required: boolean) {
    this._required = !!required;
    this.updateValidity();
  }
  public set pattern(pattern: string) {
    if (pattern !== undefined) {
      this._pattern = pattern;
      this.updateValidity();
    }
  }

  protected updateValidity() {
    const validateArray = [];
    if (this._required) {
      validateArray.push(Validators.required);
    }
    if (this._pattern && this._pattern !== null && this._pattern !== '') {
      validateArray.push(Validators.pattern(new RegExp(this._pattern)));
    }
    this._formControl.setValidators(validateArray);
    this._formControl.updateValueAndValidity();
  }

  get value() {
    console.log(this._formControl.status);
    if (this._formControl.status === 'INVALID') {
      return this.oldValue;
    }
    const value = this._formControl.value;
    if (this._useEmptyAsString && (value === undefined || value === null)) {
      return '';
    }
    if (!this._useEmptyAsString && (value === undefined || value === '')) {
      return null;
    }
    return value;
  }
  getValue(): any {
    return this.value;
  }

  // 是否弹出
  isPopup(): boolean {
    return true;
  }


  // toggleMood(): void {
  // }

  // onClick(happy: boolean) {
  //     // stopEditing(cancel)：如果网格正在编辑，则编辑将停止。传递 cancel=true将保留单元格的原始值，传递cancel=false 将采用单元格编辑器中的最新值
  //     this.component.api.stopEditing();
  // }

  // onKeyDown(event): void {
  //     const key = event.which || event.keyCode;
  //     if (key === 37 ||  // left
  //         key === 39) {  // right
  //         this.toggleMood();
  //         event.stopPropagation();
  //     }
  // }


  ngAfterViewInit() {

  }
}
