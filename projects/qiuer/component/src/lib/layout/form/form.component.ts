import { OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer2, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ControllerComponent } from '../../controller/controller.component';
import { ContainerEvent, ContainerService } from '@qiuer/core';
import { FormService } from './form.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export interface FormLayoutMetadata extends LayoutMetadata {
  // config
  isSetUrl?: boolean;
  // event
  onValueChange?: string;
  onStatusChange?: string;
  onDirtyChange?: string; // TODO
  clsBg?: boolean;
  requiredWidthStar?: boolean; // 必填校验是否带星号
}
@Component({ template: '' })
export abstract class FormLayoutComponent extends LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: FormLayoutMetadata;
  public _formGroup: FormGroup;

  protected _controllers = [];
  protected _controllerLength = 0;
  public childControllers: { [name: string]: ControllerComponent } = {};
  protected _isSetUrl = false; // TO DO 设置url变化
  // Subscription
  protected _setUrlSubscription: Subscription;

  protected _clsBg: boolean;

  protected _dirtySubject = new Subject<any>();
  protected _dirtyFlag = false;

  // _showLoading = false;

  public requiredWidthStar: boolean; // 必填校验是否带星号
  constructor(public _service: ContainerService, public _formService: FormService, public renderer2: Renderer2) {
    super(_service);
  }

  registerEvent(): void {
    const valueChangeEvent = new ContainerEvent('valueChange', this._formGroup.valueChanges, '(value)'); // .pipe(debounceTime(300) TODO 如果autocomplete设置是延迟3000呢
    const statusChangeEvent = new ContainerEvent('statusChange', this._formGroup.statusChanges, '(status)'); // .pipe(debounceTime(300)
    const dirtyChangeEvent = new ContainerEvent('dirtyChange', this._dirtySubject.asObservable(), '()');
    this._setCallbackEvent(valueChangeEvent);
    this._setCallbackEvent(statusChangeEvent);
    this._setCallbackEvent(dirtyChangeEvent);
    this._setDoEventFunction(valueChangeEvent, (func: Function, e: any) => {
      // 触发表单的dirty事件
      if (this._dirtyFlag === false && this.dirty === true) {
        this._dirtySubject.next();
      }
      func(e, 'onValueChange');
    });
    this._setDoEventFunction(statusChangeEvent, (func: Function, e: any) => {
      func(e, 'onStatusChange');
    });
    this._setDoEventFunction(dirtyChangeEvent, (func: Function, e: any) => {
      this._dirtyFlag = true;
      func(e);
    });
  }

  /************************************ set get ************************************/
  public get childs(): any {
    return this._childs;
  }

  public set childs(childs: any) {
    this._childs = childs;
    this.defaultChildStyle = this._metadata.childStyle;
    // this._service.setChildsRootPath(this._childs, this._rootPath, this);
    this._formGroup = new FormGroup({});
  }

  public get notEmptyValue(): any {
    const childControllers = this.childControllers;
    const _value = {};
    for (const i of Object.keys(childControllers)) {
      if (!childControllers[i].disabled && !childControllers[i].passive && !childControllers[i].hidden && !childControllers[i].hidden) {
        if (childControllers[i].value !== null && childControllers[i].value !== undefined) {
          _value[i] = childControllers[i].value;
        }
      }
    }
    return _value;
  }

  public get value(): any {
    const childControllers = this.childControllers;
    const _value = {};
    for (const i of Object.keys(childControllers)) {
      // disabled?: boolean; passive?: boolean; hidden?: boolean;
      if (!childControllers[i].disabled && !childControllers[i].passive && !childControllers[i].hidden && !childControllers[i].hidden) {
        _value[i] = childControllers[i].value;
      }
    }
    return _value;
  }
  public set value(value: any) {
    this.setValue(value, {});
  }

  /**
   * options 参考https://angular.cn/api/forms/FormGroup setValue()
   *  options.onlySelf 如果为 true，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 false。
   *  options.emitEvent 如果为 true 或未提供（默认），则当控件值发生变化时，statusChanges 和 valueChanges 这两个 Observable 分别会以最近的状态和值发出事件。 如果为 false 则不发出事件。
   */
  public setValue(value: any, options?: any): void {
    if (!value || typeof (value) !== 'object') {
      return;
    }
    const childControllers = this.childControllers;
    const _options = options && typeof (options) === 'object' ? options : {};
    for (const i of Object.keys(value)) {
      if (Object.keys(childControllers).indexOf(i) !== -1) { // 确保form的子control name值为 value:obj 内的key值
        childControllers[i].setValue(value[i], _options);
      }
    }
  }

  // disabled
  public set disabled(disabled: boolean) {
    disabled === true ? this._formGroup.disable() : this._formGroup.enable();
  }
  public get disabled(): boolean {
    return this._formGroup.disabled;
  }
  // onValueChange 无get
  public set onValueChange(onValueChange: string) {
    this._setEvent('valueChange', onValueChange);
  }


  // onValidChange 无get
  public set onStatusChange(onStatusChange: string) {
    this._setEvent('statusChange', onStatusChange);
  }

  // onDirtyChange 无get
  public set onDirtyChange(onDirtyChange: string) {
    this._setEvent('dirtyChange', onDirtyChange);
  }

  // isSetUrl
  public get isSetUrl(): boolean {
    return this._isSetUrl;
  }
  public set isSetUrl(isSetUrl: boolean) {
    this._isSetUrl = isSetUrl;
    this.setUrlChangeSubscription();
  }

  public get clsBg(): boolean { return this._clsBg; }
  public set clsBg(clsBg: boolean) {
    if (clsBg) {
      this._clsBg = !!clsBg;
      this._clazz['showFormBg'] = this._clsBg;
    }
  }

  public get dirty(): any {
    return this._formGroup.dirty;
  }

  // validStatus
  public get validStatus(): any {
    return this._formGroup.status;
  }

  public getValue(hasDisabled?, hasPassive?, hasHidden?): any {
    const childControllers = this.childControllers;
    const _value = {};
    for (const i of Object.keys(childControllers)) {
      const factorA = hasDisabled ? true : !childControllers[i].disabled;
      const factorB = hasPassive ? true : !childControllers[i].passive;
      const factorC = hasHidden ? true : !childControllers[i].hidden;
      if (factorA && factorB && factorC) {
        _value[i] = childControllers[i].value;
      }
    }
    return _value;
  }

  // 接受一个以控件名为 key 的对象，并尽量把它们的值匹配到组中正确的控件上。
  public patchValue(value: { [key: string]: any; }): void {
    this._formGroup.patchValue(value);
  }

  public reset(): void {
    this._dirtyFlag = false;
    this._formGroup.reset();
  }

  // 校验表单
  public check(): any {
    // tslint:disable-next-line:forin
    for (const i in this._formGroup.controls) {
      this._formGroup.controls[i].markAsTouched();
    }
    return this._formGroup.valid;
  }

  // 解除校验表单
  public releaseCheck(): void {
    // tslint:disable-next-line:forin
    for (const i in this._formGroup.controls) {
      this._formGroup.controls[i].markAsUntouched();
    }
  }



  /************************************ life cycle ************************************/
  ngOnInit(): void {
    super.ngOnInit();
    // const isShowLoading = this._metadata.isShowLoading;
    // this._showLoading = isShowLoading === false ? false : true;
    // this.childs = this._metadata.childs;
    this.isSetUrl = this._metadata.isSetUrl; // TO DO
    this.clsBg = this._metadata.clsBg;
    this.registerEvent();
    this.onValueChange = this._metadata.onValueChange;
    this.onStatusChange = this._metadata.onStatusChange;
    this.onDirtyChange = this._metadata.onDirtyChange;
    this.requiredWidthStar = this._metadata.requiredWidthStar;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // setTimeout(() => {
    //   this._showLoading = false;
    // }, 500);
  }

  /************************************ others ************************************/
  public setUrlChangeSubscription(): void {
    if (this._isSetUrl) {
      this._setUrlSubscription = this._formGroup.valueChanges.pipe(debounceTime(300)).subscribe(
        (event) => {
          this.setUrl();
        });
    } else {
      if (this._setUrlSubscription) {
        this._setUrlSubscription.unsubscribe();
        this._setUrlSubscription = null;
      }
    }
  }

  setUrl(): void {
    // xiexiang TO DO  根据 this.value ,调用service.createUrlParam() 生成url param
    // 拿到的应该是每一个formcontrol的get urlParam
    // const _noBlankLength = this._childs.filter(item => item.type !== 'blank').length;
    if (this._controllerLength !== this._controllers.length) {
      return;
    }
    const childControllers = this.childControllers;
    const _obj = {};
    for (const i of Object.keys(childControllers)) {
      _obj[i] = childControllers[i]['urlParam'];
    }
    // console.log(_obj);
    this._formService.createUrlParam(_obj);
  }

  public addControl(name: string, childContainer: ControllerComponent): void {
    // this._formGroup.addControl(name, childContainer['_formControl']);
    this._formGroup.registerControl(name, childContainer['_formControl']);
    this.childControllers[name] = childContainer;
    this._controllerLength = this._controllerLength + 1;
    this._controllers.push(name);
    const loadChildLength = this._childs.filter(child => this.cid(child.id) && 'root' in this.cid(child.id)).length;
    if (loadChildLength === this._childs.length) {
      // console.log('=======加载完成======');
      if (this._isSetUrl) {
        this.setUrl();
      }
    } else {
      // console.log('=======还有' + (this._childs.length - loadChildLength) + '个控件未加载======');
    }
  }

  public removeControl(name: string): void {
    this._formGroup.removeControl(name);
    delete this.childControllers[name];
    this._controllerLength = this._controllerLength - 1;
  }

  public loadedControl(name: string): void {
    // console.log(name);
    if (this._controllers.indexOf(name) > -1) {
      // 说明已经加载
      return;
    }
    //  const _noBlankLength = this._childs.filter(item => item.type !== 'blank').length;
    this._controllers.push(name);
    if (this._controllerLength === this._controllers.length) {
      if (this._isSetUrl) {
        this.setUrl();
      }
      // setTimeout(() => {
      //   this.onValueChange = this._metadata.onValueChange;
      //   this.onStatusChange = this._metadata.onStatusChange;
      // }, 100);

    }
  }

  setControlValue(): void {
    const urlParams = this._formService.getParams();
    const lonely = {};
    for (const i of Object.keys(urlParams)) {
      if (this.childControllers[i]) {
        this.childControllers[i].urlParam = urlParams[i];
      } else {
        lonely[i] = urlParams[i];
      }
    }
    if (Object.keys(lonely).length !== 0) {
      const newUrlParam = Object.assign(urlParams, lonely);
      this._formService.createUrlParam(newUrlParam);
    }
  }

}
