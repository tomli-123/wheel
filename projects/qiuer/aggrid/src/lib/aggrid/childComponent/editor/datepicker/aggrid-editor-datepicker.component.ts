import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';

export interface AggridEditorDatePickerParams {
  label?: string;
  hasClear?: boolean; // 有清除按钮
  pattern: string;
  patternMsg: string;
  required: boolean;
  requiredMsg: string;
}
@Component({
  templateUrl: './aggrid-filter-datepicker.component.html',
  styleUrls: ['./aggrid-filter-datepicker.component.scss']
})
export class AggridEditorDatepickerComponent implements ICellEditorAngularComp, AfterViewInit {
  private component: any;
  private params: AggridEditorDatePickerParams;
  public formControl: FormControl = new FormControl();

  public label: string;
  public hasClear: boolean;
  public options: any[];
  public _pattern: string;
  public _patternMsg: string;
  public _required: boolean;
  public _requiredMsg: string;

  constructor() { }
  agInit(params: any): void {
    this.component = params;

    this.params = this.component.colDef.filterParams || {};

    this.label = this.params.label || '';

    this.hasClear = this.params.hasClear;
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
    this.formControl.setValidators(validateArray);
    this.formControl.updateValueAndValidity();
  }
  private set value(value: any) {
    this.formControl.setValue(value);
  }
  private get value() {
    return this.formControl.value;
  }

  // 是否弹出
  isPopup(): boolean {
    return true;
  }
  getValue(): any {
    return this.value;
  }

  ngAfterViewInit() {
  }
}


