import { OnInit, OnDestroy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { ContainerService, ContainerEvent, ContainerComponent, ContainerMetadata } from '@qiuer/core';
import { FormLayoutComponent } from '../layout/form/form.component';
import { ControllerService } from './controller.service';


export interface ControllerMetadata extends ContainerMetadata {
  name?: string; // 名称, 如果不存在就使用id
  label?: string; // 标题
  defaultValue?: any; // 默认值
  disabled?: boolean; // 禁用的, 默认是启用
  passive?: boolean; // 被动的, 默认是主动提供值, 如果为真则该控件的父Form不会使用其值
  required?: boolean; // [校验类]必须的, 值必须填写
  requiredMsg?: string; // [校验类]必填验证错误信息 优先级最高 TODO requiredMsg
  pattern?: string; // [校验类]正则表达式
  patternMsg?: string; // [校验类]正则验证错误信息 TODO patternMsg
  // event
  onValueChange?: string; // TODO 回调参数
  onStatusChange?: string; // TODO 回调参数
}

@Component({ template: '' })
export abstract class ControllerComponent extends ContainerComponent implements OnInit, OnDestroy {

  protected _metadata: ControllerMetadata;
  protected _name: string;
  public label: string;

  // disabled 通过_formControl
  protected _passive = false;

  public patternMsg: string;
  public requiredMsg: string;

  public _formControl: FormControl;

  // validate
  protected _required: boolean;
  protected _pattern: string;
  public requiredWidthStar: boolean;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service);
  }

  protected registerEvent(): void {
    this.registerValueChangeEvent();
    this.registerStatusChangeEvent();
  }
  protected registerValueChangeEvent(): void {
    const valueChangeEvent = new ContainerEvent('valueChange', this._formControl.valueChanges, '(value,event)');
    this._setCallbackEvent(valueChangeEvent);
    this._setDoEventFunction(valueChangeEvent, (func: Function, v: any) => {
      func(this.value, 'onValueChange');
    });
  }
  protected registerStatusChangeEvent(): void {
    const statusChangeEvent = new ContainerEvent('statusChange', this._formControl.statusChanges, '(status,event)');
    this._setCallbackEvent(statusChangeEvent);
    this._setDoEventFunction(statusChangeEvent, (func: Function, v: any) => {
      func(v, 'onStatusChange');
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  // name name是不允许修改的
  public set name(name: string) { }
  public get name(): string { return this._name; }
  // label 直接修改变量
  // disabled
  public set disabled(disabled: boolean) { disabled ? this._formControl.disable() : this._formControl.enable(); }
  public get disabled(): boolean { return this._formControl.disabled; }
  // passive
  public set passive(passive: boolean) { this._passive = passive; }
  public get passive(): boolean { return this._passive; }
  // required
  public get required(): boolean { return this._required; }
  public set required(required: boolean) {
    this._required = required;
    this.updateValidity();
  }
  // pattern
  public get pattern(): string { return this._pattern; }
  public set pattern(pattern: string) {
    this._pattern = pattern;
    this.updateValidity();
  }
  // value
  public get value(): any { return this._formControl.value; }
  public set value(value: any) { this._formControl.setValue(value); }

  /**
   *  {any} value 控件值
   *  {Object} options 参考https://angular.cn/api/forms/FormControl setValue()
   * options.onlySelf 如果为 true，则每次变更只影响该控件本身，不影响其父控件。默认为 false。
   * options.emitEvent 如果为 true 或未提供（默认），则当控件值变化时， statusChanges 和 valueChanges 这两个 Observable 都会以最近的状态和值发出事件。 如果为 false，则不会发出事件。
   * options.emitModelToViewChange 如果为 true 或未提供（默认），则每次变化都会触发一个 onChange 事件以更新视图。
   * options.emitViewToModelChange 如果为 true 或未提供（默认），则每次变化都会触发一个 ngModelChange 事件以更新模型。
   */
  public setValue(value: any, options?: any): void {
    const _options = options && typeof (options) === 'object' ? options : {};
    const _value = this.transformValue(value);
    this._formControl.setValue(_value, _options);
  }

  // validStatus
  public get status(): string { return this._formControl.status; }
  public set status(status: string) { }
  // onValueChange
  public get onValueChange(): string {
    return this._getCallback('onValueChange').toString();
  }
  public set onValueChange(onValueChange: string) {
    this._setEvent('valueChange', onValueChange);
  }
  // onValidChange 无get
  public set onStatusChange(onStatusChange: string) {
    this._setEvent('statusChange', onStatusChange);
  }

  public get dirty(): any {
    return this._formControl.dirty;
  }

  protected updateValidity(): void {
    const validateArray = [];
    if (this._required) {
      validateArray.push(Validators.required);
    }
    if (this._pattern && this._pattern !== null && this._pattern !== '') {
      validateArray.push(Validators.pattern(new RegExp(this._pattern)));
    }
    this._formControl.setValidators(validateArray);
    this._formControl.updateValueAndValidity({ emitEvent: false });
  }

  public clearValidate(): void {
    this._formControl.clearValidators();
    this._formControl.updateValueAndValidity({ emitEvent: false });
  }

  // urlParam
  public set urlParam(urlParam: string) {
    const param = this.transFromParam(urlParam);
    this.value = param;
  }

  public get urlParam(): string {
    return this.value;
    // return null;
  }

  public transFromParam(urlParam: string): any {

    const param = urlParam;
    return param;
  }
  // 用来转化用户输入值到控件
  public transformValue(value: any): any {
    return value;
  }


  /************************************ life cycle ************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata = this._metadata;
    this.label = metadata.label;
    // this.name = metadata.name || metadata.id;
    this._name = metadata.name || metadata.id;
    this.hidden = metadata.hidden || false;
    this._passive = metadata.passive || false;
    this._required = metadata.required || false;
    this._pattern = metadata.pattern || null;
    const _validators = [];
    if (this._required) {
      _validators.push(Validators.required);
    }
    if (this._pattern && this._pattern !== null) {
      _validators.push(Validators.pattern(this._pattern));
    }
    this.patternMsg = metadata.patternMsg;
    this.requiredMsg = metadata.requiredMsg;
    // const defaultValue = metadata.defaultValue || null;
    let defaultValue = null;
    if (metadata.defaultValue !== undefined) {
      defaultValue = this.transformValue(metadata.defaultValue) || null;
    }
    const formContainer = this.parentForm(this.parent);
    let isSetUrl = false;
    if (formContainer) {
      isSetUrl = formContainer.isSetUrl;
      this.requiredWidthStar = formContainer.requiredWidthStar;
    }

    this._formControl = new FormControl({
      value: this.getInitValue(defaultValue, isSetUrl),
      disabled: metadata.disabled
    }, _validators); // 缺少Validators
    this.registerEvent();
    this.onValueChange = metadata.onValueChange;
    this.onStatusChange = metadata.onStatusChange;

    if (formContainer) {
      formContainer.addControl(this.name, this);
    }

    this._subscriptionPending = this.pendingSubject.subscribe(
      (event: boolean) => {
        this._pending = event;
        if (!event) {
          // tslint:disable-next-line:no-shadowed-variable
          const formContainer = this.parentForm(this.parent);
          if (formContainer) {
            formContainer.loadedControl(this.name);
          }
        }
      }
    );
  }
  ngOnDestroy(): void {
    // .log('controller ngOnDestroy id' + this.id + ': ' + this.constructor.name);
    super.ngOnDestroy();
    const formContainer = this.parentForm(this.parent);
    if (formContainer) {
      formContainer.removeControl(this.name);
    }
  }

  /********************************* others *********************************/

  // _doOnInit() {
  //   super._doOnInit();
  // }

  // 获取父contaniner,若没有父contaniner返回null

  public parentForm(container: ContainerComponent): FormLayoutComponent {
    if (container === undefined || container === null) {
      return null;
    }
    if (container instanceof FormLayoutComponent) {
      return container;
    } else {
      return this.parentForm(container.parent);
    }
  }


  getInitValue(defaultValue: any, isSetUrl: boolean): any {
    // xiexiang TO DO  根据 isSetUrl 来返回initValue
    let value = null;
    const urlParams = this._ctrlService.getParams();
    if (isSetUrl && urlParams && urlParams[this.name]) {
      value = this.transFromParam(urlParams[this.name]);
    } else {
      value = defaultValue;
    }
    return value;
  }

  seturlParam(): void {
    const urlParams = this._ctrlService.getParams();
    if (urlParams && urlParams[this.name]) {
      this.urlParam = urlParams[this.name]; // 将urlparam送到set urlParam中进行处理
    }
  }
}
