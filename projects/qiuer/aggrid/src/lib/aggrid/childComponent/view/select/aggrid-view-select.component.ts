import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../haveOptionsValueType';
export interface AggridViewSelectParams {
  tip?: string;
  valueType?: string;
  // prefixHtml?: string; // 前置
  // suffixHtml?: string; // 后置
  useEmptyAsString?: boolean; // 是否使用空字符串作为空值 默认值为false;
  pattern: string;
  patternMsg: string;
  required: boolean;
  requiredMsg: string;
  hasClear?: boolean;
  options?: any[];
  option: { label?: string, value?: string };
  emptyLabel?: string;
  disabled?: Function;
}
@Component({
  selector: 'row-select',
  styleUrls: ['./aggrid-view-select.component.scss'],
  templateUrl: './aggrid-view-select.component.html'
})
export class AggridViewSelectComponent implements ICellRendererAngularComp {
  public params: any;
  public _formControl: FormControl = new FormControl();
  public cellRendererParams: AggridViewSelectParams;
  public tip: string;
  public valueType: string;
  public _valueType: ValueType;
  public _pattern: string;
  public patternMsg: string;
  public _required: boolean;
  public requiredMsg: string;
  // public prefixHtml: string; // 前置
  // public suffixHtml: string; // 后置
  public useEmptyAsString: boolean; // 是否使用空字符串作为空值 默认值为false;
  public options: any[];
  public option: { label?: string, value?: string };
  public emptyLabel: string;
  public hasClear: boolean;
  @ViewChild('select', { static: true }) public select;
  private emptyNode = '<-请选择->';

  agInit(params: any): void {
    this.params = params;
    this.options = this.params.options || [];
    this.option = this.params.option || {};
    const label: string = this.option.label || null;
    const value: string = this.option.value || null;
    this.valueType = this.params.valueType || 'string';
    this._valueType = this._createValueType(this.valueType, label, value);
    if (this.params.tip !== undefined) {
      this.tip = this.params.tip;
    }
    if (this.params.useEmptyAsString !== undefined) {
      this.useEmptyAsString = this.params.useEmptyAsString || false;
    }
    // if (this.params.prefixHtml !== undefined) {
    //   this.prefixHtml = this.params.prefixHtml || '';
    // }
    // if (this.params.suffixHtml !== undefined) {
    //   this.suffixHtml = this.params.suffixHtml || '';
    // }
    this.required = this.params.required;
    if (this.params.requiredMsg !== undefined) {
      this.requiredMsg = this.params.requiredMsg || '';
    }
    this.pattern = this.params.pattern;
    if (this.params.patternMsg !== undefined) {
      this.patternMsg = this.params.patternMsg || '';
    }
    this.hasClear = !!this.params.hasClear;
    this.emptyLabel = this.params.emptyLabel || this.emptyNode;
    this._formControl.setValue(params.value || null);
    // this.value = this.params.value;
    this._formControl.valueChanges.subscribe(res => {
      this.onSelectChange(res);
    });
  }
  onSelectChange(value) {
    this.nodeValue = this.value;
    if (this.params.colDef.cellRendererResultEvent !== undefined) {
      this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data, value, this);
    }
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
  public set nodeValue(value) {
    if (value === this.emptyNode) {
      this.value = '';
    }
    console.dir(this.params.node);
    this.params.node.setDataValue(this.params.column.colId, this.value);
  }

  private set value(value: any) {
    const _value = this._valueType.setValue(this.options, value);
    this._formControl.setValue(_value);
  }
  private get value() {
    const value = this._formControl.value;
    if (this.useEmptyAsString && (value === undefined || value === null)) {
      return '';
    }
    if (!this.useEmptyAsString && (value === undefined || value === '')) {
      return null;
    }

    return this._valueType.getValue(this._formControl.value);
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
    this._formControl.setValidators(validateArray);
    this._formControl.updateValueAndValidity({ emitEvent: false });
  }

  getValue(): any {
    return this.value;
  }

  refresh(): boolean {
    return true;
  }
}
