import { OnInit, OnDestroy, Component } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from './controller.service';
import { ControllerComponent, ControllerMetadata } from './controller.component';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject, ValueTypeSingleLetter } from './select.valuetype';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export interface HaveSelectControllerMetadata extends ControllerMetadata {
  options?: string | any[];
  option: { label?: string, value?: string }; // label 可以为空 纯数组没有label
  valueType?: string;
}

@Component({ template: '' })
export abstract class HaveSelectControllerComponent extends ControllerComponent implements OnInit, OnDestroy {
  protected _innerValue = null; // 存放没有options时的临时value 用来做二次匹配;
  protected _metadata: HaveSelectControllerMetadata;
  public _options: any[] = [];
  public _valueType: ValueType;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  public set options(options: string | any[]) {

    if (options === undefined || options === null || options === '') {
      this._options = [];
      return;
    }
    // 当value不存在与options时 值为null TODO 无用待删除
    try {
      this._options = options instanceof Array ? options : JSON.parse(options);
    } catch (error) {
      console.error('options转换出错');
      console.error(options);
      console.error(error);
      console.log(this);
    }
    // this._options = options;
    this._resetValue();
  }
  public get options(): string | any[] {
    return this._options;
  }

  protected _resetValue(): void {
    if (this._metadata.valueType !== 'object' && this._formControl) {
      const realyValue = this._innerValue || this.value;
      if (realyValue !== undefined && realyValue !== null) {
        // console.log('realyValue', realyValue);
        // this.value = realyValue;
        this.setValue(realyValue, { emitEvent: false });
      }
    }
  }

  protected _createValueType(valueType: string, label: string, value: string): any {
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
      case 'singleletter': ret = new ValueTypeSingleLetter(label, value); break;
    }
    return ret;
  }

  public isObjectValueEqual(objA, objB): boolean {
    const aProps = Object.getOwnPropertyNames(objA);
    const bProps = Object.getOwnPropertyNames(objB);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (const item of aProps) {
      const propName = item;
      if (objA[propName] !== objB[propName]) {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    const metadata: HaveSelectControllerMetadata = this._metadata;
    const option = metadata.option;
    let label: string = null;
    let value: string = null;
    if (option) {
      label = option.label;
      value = option.value;
    }
    this._valueType = this._createValueType(this._metadata.valueType, label, value);
    this.options = metadata.options;
    super.ngOnInit();
  }

}
