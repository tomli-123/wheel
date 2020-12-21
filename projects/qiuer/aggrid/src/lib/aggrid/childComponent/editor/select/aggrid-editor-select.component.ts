import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../haveOptionsValueType';
export interface AggridEditorSelectParams {
  tip?: string;
  valueType?: string;
  prefixHtml?: string; // 前置
  suffixHtml?: string; // 后置
  useEmptyAsString?: boolean; // 是否使用空字符串作为空值 默认值为false;
  pattern: string;
  patternMsg: string;
  required: boolean;
  requiredMsg: string;
  hasClear?: boolean;
  options?: any[];
  option: { label?: string, value?: string };
  emptyLabel?: string;
}
@Component({
  templateUrl: './aggrid-editor-select.component.html',
  styleUrls: ['./aggrid-editor-select.component.scss']
})
export class AggridEditorSelectComponent implements ICellEditorAngularComp, AfterViewInit {
  private component: any;
  private params: AggridEditorSelectParams;
  private oldValue: any;
  public formControl: FormControl = new FormControl();
  public tip: string;
  public valueType: string;
  public _valueType: ValueType;
  public _pattern: string;
  public patternMsg: string;
  public _required: boolean;
  public requiredMsg: string;
  public prefixHtml: string; // 前置
  public suffixHtml: string; // 后置
  public useEmptyAsString: boolean; // 是否使用空字符串作为空值 默认值为false;
  public options: any[];
  public option: { label?: string, value?: string };
  public emptyLabel: string;
  public hasClear: boolean;
  public test = [{ label: '1', value: '1' }, { label: '2', value: '2' }];
  @ViewChild('select', { static: true }) public select;

  ngAfterViewInit() {
    window.setTimeout(() => {
      // this.select.focus();
    });
  }

  agInit(params: any): void {
    this.component = params;
    this.oldValue = this.component.value;
    this.params = this.component.colDef.cellEditorParams;
    this.options = this.params.options || [];
    this.option = this.params.option || {};
    const label: string = this.option.label || null;
    const value: string = this.option.value || null;
    this.valueType = this.params.valueType || 'string';
    this._valueType = this._createValueType(this.valueType, label, value);
    this.value = this.oldValue;
    if (this.params.tip !== undefined) {
      this.tip = this.params.tip;
    }
    if (this.params.useEmptyAsString !== undefined) {
      this.useEmptyAsString = this.params.useEmptyAsString || false;
    }
    if (this.params.prefixHtml !== undefined) {
      this.prefixHtml = this.params.prefixHtml || '';
    }
    if (this.params.suffixHtml !== undefined) {
      this.suffixHtml = this.params.suffixHtml || '';
    }
    this.required = this.params.required;
    if (this.params.requiredMsg !== undefined) {
      this.requiredMsg = this.params.requiredMsg || '';
    }
    this.pattern = this.params.pattern;
    if (this.params.patternMsg !== undefined) {
      this.patternMsg = this.params.patternMsg || '';
    }
    this.hasClear = !!this.params.hasClear;

    this.emptyLabel = this.params.emptyLabel || '<-请选择->';
    this.formControl.valueChanges.subscribe(res => {
      console.log(res)
    });
  }

  protected _createValueType(valueType: string, label: string, value: string) {
    if (!valueType) { valueType = 'string'; }
    let ret: ValueType = null;
    const vt = valueType.toLowerCase();
    if (vt !== 'object') {
      if (!label) { label = 'label'; }
      if (!value) { value = 'value'; }
    }
    switch (vt) {
      case 'string': ret = new ValueTypeString(label, value); break;
      case 'number': ret = new ValueTypeNumber(label, value); break;
      case 'object': ret = new ValueTypeObject(label, value); break;
    }
    return ret;
  }



  private set value(value: any) {
    const _value = this._valueType.setValue(this.options, value);
    this.formControl.setValue(_value);
  }
  private get value() {
    console.log(this._valueType.getValue(this.formControl.value))
    if (this.formControl.status === 'INVALID') {
      return this.oldValue;
    }
    const value = this.formControl.value;
    if (this.useEmptyAsString && (value === undefined || value === null)) {
      return '';
    }
    if (!this.useEmptyAsString && (value === undefined || value === '')) {
      return null;
    }
    return this._valueType.getValue(this.formControl.value);
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
    if (this.required) {
      validateArray.push(Validators.required);
    }
    if (this.pattern && this.pattern !== null && this.pattern !== '') {
      validateArray.push(Validators.pattern(new RegExp(this.pattern)));
    }
    this.formControl.setValidators(validateArray);
    this.formControl.updateValueAndValidity();
  }



  getValue(): any {
    console.log(this);
    // this.component.context._parent.changeRowDate();
    console.log(this.value)
    return this.value;
  }

  isPopup(): boolean {
    return false;
  }

}
