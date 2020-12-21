import { OnDestroy, OnInit, AfterViewInit, Component } from '@angular/core';
import { ContainerEvent } from './container.event';
import { ContainerService } from './container.service';
import { DialogContainerComponent } from '../main/dialog.component';
import { BsDialogContainerComponent } from '../main/bsDialog.component';

import { RootComponent, RootMetadata } from '../root/root.container';
// import { Style } from './layout/style';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subscription, interval, Subject, timer } from 'rxjs';

// 头部按钮
export class HeaderBtn {
  icon?: string;
  label?: string;
  id?: string;
}
// 拟改为 style
export interface StyleMarginPadding {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

// flex,width,minWidth,height,minHeight 不带单位默认为 %
export interface StyleMedia {
  flex?: string;
  width?: string;
  minWidth?: string;
  height?: string;
  minHeight?: string;
  color?: string;
  backgroundColor?: string;
  margin?: string | StyleMarginPadding;
  padding?: string | StyleMarginPadding;
}
export interface Style extends StyleMedia {
  sm?: StyleMedia;
  xs?: StyleMedia;
  md?: StyleMedia;
  gt_md?: StyleMedia;
}

export interface ContainerMapping { [id: string]: ContainerComponent; }
export interface ContainerMetadata {
  id?: string; // 允许id不存在
  type: string;
  hidden?: boolean; // 隐藏的, 默认是显示
  local?: string | any; //  TODO 遗留问题
  onCreate?: string; // 构造函数后
  onInit?: string; // 界面渲染以后
  onDestroy?: string; // 销毁组件前
  onSetElement?: string;  //  set数据变化事件
  onGetElement?: string;  //  get数据变化事件
  style?: Style;
  // class?: string;
}

@Component({ template: '' })
export abstract class ContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  // 基础
  public readonly id: string;
  public readonly msVersion: string;  // Minimum supported version 最小支持版本
  public readonly index: number; // 下标
  protected _metadata: any;
  protected _rootPath: string[] = null;
  public selfInit: boolean;
  // protected _root: RootContainerComponent = null; // 肯定有
  protected _parent: ContainerComponent = null; // 不一定有
  protected _scopeContainers: ContainerMapping; // 域内的所有容器
  // protected _scopeContainerss: ContainerMap[]; // 多级, 为了上级某些ngif容器
  protected _childList: ContainerComponent[] = [];
  protected _childMap: ContainerMapping = {};
  // 环境和方法
  public _local: any;
  public _scope: any; // 通过referenceScope来引用root的scopeInstance
  protected _hasDestroy = false;
  protected _version: string;   // 配置版本
  protected _hidden: boolean;
  protected _onCreate: Function; // 内部实现是在非构造之后，是在ngOnInit时
  protected _onInit: Function; // 只能在metadata中定义一次, 后续修改无意义，是在ngAfterView上做的
  protected _onDestroy: Function;
  protected _onResize: Function;
  protected _onSetElement: Function;
  public _onGetElement: Function;
  // 事件
  protected _subscriptionList: Subscription[] = []; // 可观察对象数组, 用于删除用户的自定义订阅
  protected _callbackFunctions: { [id: string]: Function } = {}; // 所有定义的回调函数, 包括onInit,onDestroy,onValueChange等, 还包括自定义的
  protected _callbackEvents: { [id: string]: ContainerEvent } = {}; // 所有定义的事件, 包括valueChange,statusChange等
  public _pending = false; // 是否处于初始化状态
  public _initialized = false; // 是否执行了初始化
  protected _subscriptionPending: Subscription;
  protected pendingSubject: any;
  // 显示
  public _style: Style;
  public _ngStyle: any = {};

  constructor(public _service: ContainerService) {
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get scope(): any { return this._scope; }
  public set scope(scope: any) { }

  public get version(): string { return this._version; }
  public set version(version: string) {
    this._version = version;
  }

  public get hidden() { return this._hidden; }
  public set hidden(hidden: boolean) {
    this._hidden = hidden;
  }

  public get initialized() { return this._initialized; }

  public get style() { return this._style; }
  public set style(style: Style) {
    this._style = this._service.mergeObject(this._style, style);
    const ngStyle: any = {};
    // tslint:disable-next-line:no-unused-expression
    this._style['color'] ? ngStyle.color = this._style['color'] : null;
    // tslint:disable-next-line:no-unused-expression
    this._style['backgroundColor'] ? ngStyle.backgroundColor = this._style['backgroundColor'] : null;
    this._ngStyle = ngStyle;
  }

  public get ngStyle() { return this._ngStyle; }

  public set ngStyle(ngStyle: any) {
    this._ngStyle = this._service.mergeObject(this._ngStyle, ngStyle);
  }

  public get local() { return this._local; }
  public set local(local: string | any) {
    if (local) {
      try {
        // tslint:disable-next-line:no-eval
        typeof local === 'string' ? this._local = eval('(' + local + ')') : this._local = local;
      } catch (error) {
        console.error('options转换出错');
        console.error(local);
      }
    }
  }
  public get onCreate(): string { return this._onCreate.toString(); }
  public set onCreate(onCreate: string) {
    this._onCreate = this._compileCallbackFunction(onCreate);
  }
  public get onInit(): string { return this._onInit.toString(); }
  public set onInit(onInit: string) {
    this._onInit = this._compileCallbackFunction(onInit);
  }
  public get onDestroy(): string { return this._onDestroy.toString(); }
  public set onDestroy(onDestroy: string) {
    this._onDestroy = this._compileCallbackFunction(onDestroy);
  }
  public get onResize(): string { return this._onResize.toString(); }
  public set onResize(onResize: string) {
    this._onResize = this._compileCallbackFunction(onResize);
  }
  public get onSetElement(): string { return this._onSetElement.toString(); }
  public set onSetElement(onSetElement: string) {
    this._onSetElement = this._compileCallbackFunction(onSetElement);
  }
  public get onGetElement(): string { return this._onGetElement.toString(); }
  public set onGetElement(onGetElement: string) {
    this._onGetElement = this._compileCallbackFunction(onGetElement);
  }
  public cid(id: string): ContainerComponent {
    const container: ContainerComponent = this._scopeContainers[id];
    return container;
  }
  public set root(parent: RootComponent) { }
  public get root(): RootComponent {
    if (this._rootPath === null) {
      return;
    }
    const container = this.cid(this._rootPath[0]) as RootComponent;
    return container;
  }
  public set childList(childList: ContainerComponent[]) { }
  public get childList(): ContainerComponent[] { return this._childList; }

  public set parent(parent: ContainerComponent) { }
  public get parent(): ContainerComponent { return this._parent; }

  /*
    * 调用公共方法，public method
    *
     *
     * ### Example
     *
     * ```
     *  this.src.tipDialog('弹出提示框');
     * ```
     *
     */
  public get src() {
    return this._service;
  }

  // TODO 缺少 try catch
  public openBottomSheet(id: string, param?: any, callback?: Function | string) {
    const metadata: RootMetadata = this._service.getRootMetadata(id) as RootMetadata;
    if (!metadata) { throw new Error('未找到对话框id=' + id); }
    metadata['scope'] = param;
    const config = {
      data: metadata,
      panelClass: ['panelClass-dialog', metadata['size'], metadata['height']],
      disableClose: true
    };
    const type = metadata.type;
    const dialogRef = this._service.bottomSheet.open(BsDialogContainerComponent, config);
    if (callback) {
      const func = this._getCallback(callback);
      dialogRef.afterDismissed().subscribe(result => {
        func(result.code, result.data);
      });
    }
  }

  // TODO 缺少 try catch
  public openDialog(id: string, param?: any, callback?: Function | string) {
    const metadata: RootMetadata = this._service.getRootMetadata(id) as RootMetadata;
    if (!metadata) { throw new Error('未找到对话框id=' + id); }
    metadata['scope'] = param;
    const config = {
      data: metadata,
      panelClass: ['panelClass-dialog'],
      disableClose: true
    };
    if (metadata['size'] !== 'customize') { config.panelClass.push(metadata['size']); }
    if (metadata['height'] !== 'customize') { config.panelClass.push(metadata['height']); }
    if (metadata['customizeWidth']) { config['width'] = metadata['customizeWidth'] + 'px'; }
    if (metadata['customizeHeight']) { config['height'] = metadata['customizeHeight'] + 'px'; }
    const type = metadata.type;
    const dialogRef = this._service.dialog.open(DialogContainerComponent, config);
    if (callback) {
      const func = this._getCallback(callback);
      dialogRef.afterClosed().subscribe(result => {
        func(result.code, result.data);
      });
    }
  }
  // 打开自定义对话框
  public openCustDialog(metadata: any, callback?: Function | string) {
    const config = {
      data: metadata,
      panelClass: ['panelClass-dialog', metadata['size'], metadata['height']],
      // disableClose: !!!metadata['isClosedByESC']
      disableClose: true
    };
    const type = metadata.type;
    const dialogRef = this._service.dialog.open(DialogContainerComponent, config);
    if (callback) {
      const func = this._getCallback(callback);
      dialogRef.afterClosed().subscribe(result => {
        func(result.code, result.data);
      });
    }
  }

  public subs(id: string, event: string, callback: Function | string) {
    try {
      const func = this._getCallback(callback);
      const c = this.cid(id);
      if (!c) { throw new Error('未找到容器id=' + id); }
      const e = c._callbackEvents[event];
      if (!e) { throw new Error('未找到事件event=' + event); }
      const obs: Observable<any> = e.observable;
      if (!obs) { throw new Error('未找到可观察对象event=' + event); }
      // if (!func) { throw new Error('无法识别回调类型, callback=' + callback); }
      const _subscription = obs.subscribe((se) => {
        try {
          c[e.doEventFuncName](func, se);
        } catch (e) {
          e += '\n在 容器(id=' + this.id + ')的' + callback + ', function=' + func;
          // console.warn(e);
        }
      }
      );
      this._subscriptionList.push(_subscription);
    } catch (e) {
      e += '\n在 订阅(subs)函数, id=' + id + ', event=' + event + ',callback=' + callback;
      throw e;
    }
  }
  public call(callback: Function | string, p0?: any, p1?: any, p2?: any, p3?: any, p4?: any, p5?: any, p6?: any, p7?: any, p8?: any, p9?: any) {
    const func = this._getCallback(callback);
    try {
      return func(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
    } catch (e) {
      e += '\n在 容器(id=' + this.id + ')的' + callback + ', function=' + func;
    }
  }
  public timeout(msec: number, callback: Function | string) {
    try {
      this.pendingSubject.next(true); // 开启等待状态
      const func = this._getCallback(callback);
      // console.log(func);
      const obs: any = timer(msec);
      const sub: Subscription = obs.subscribe(() => {
        this.pendingSubject.next(false);
        try {
          // console.log(func);
          func(msec);
        } catch (e) {
          console.warn(e + '\n在 容器(id=' + this.id + ')的' + callback + ', function=' + func);
        }
      }, () => { }
      );
      this._subscriptionList.push(sub);
    } catch (e) {
      e += '\n在 计时器(timeout)函数, msec=' + msec + ',callback=' + callback;
      throw e;
    }
  }
  public interval(msec: number, callback: Function | string) {
    try {
      this.pendingSubject.next(true); // 开启等待状态
      const func = this._getCallback(callback);
      const obs: any = interval(msec);
      const sub: Subscription = obs.subscribe(() => {
        this.pendingSubject.next(false);
        try {
          // console.log('do');
          func(msec);
        } catch (e) {
          // console.warn(e + '\n在 容器(id=' + this.id + ')的' + callback + ', function=' + func);
        }
      }, () => { }
      );
      this._subscriptionList.push(sub);
    } catch (e) {
      e += '\n在 间隔器(interval)函数, msec=' + msec + ',callback=' + callback;
      throw e;
    }
  }
  public getData(url: string, param?: object, success?: Function | string, failure?: Function | string, error?: Function | string) {
    this.pendingSubject.next(true); // 开启等待状态
    let func: Function = null;
    const httpPromise = this._service.getData(url, param);
    httpPromise.then(result => {
      if (result['code'] === 0) {
        if (success) {
          func = this._getCallback(success);
          if (func) { func(result); }
        }
      } else {
        if (failure) {
          func = this._getCallback(failure);
          if (func) { func(result); }
        } else {
          this._service.tipDialog(result['msg']);
        }
      }
      this.pendingSubject.next(false);
    }).catch(
      result => {
        this.pendingSubject.next(false);
        if (error) {
          func = this._getCallback(error);
          if (func) { func(result); }
        }
      }
    );
  }
  public postData(url: string, param?: object, success?: Function | string, failure?: Function | string, error?: Function | string) {
    this.pendingSubject.next(true); // 开启等待状态
    let func: Function = null;
    const httpPromise = this._service.postData(url, param, {
      observe: 'response'
    });
    httpPromise.then(res => {

      const result = res['body'] || {};
      const contentType = res['headers']?.get('content-type') || null;

      if (contentType && contentType.includes('application/octet-stream')) {
        console.log('文件');
      } else {
        console.log('json');
      }

      console.log(result);

      if (result['code'] === 0) {
        if (success) {
          func = this._getCallback(success);
          if (func) { func(result); }
        }
      } else {
        if (failure) {
          func = this._getCallback(failure);
          if (func) { func(result); }
        } else {
          this._service.tipDialog(result['msg']);
        }
      }
      this.pendingSubject.next(false);
    }).catch(
      result => {
        this.pendingSubject.next(false);
        if (error) {
          func = this._getCallback(error);
          if (func) { func(result); }
        }
      }
    );
  }
  public download(url: string, param?: object, success?: Function | string, failure?: Function | string, error?: Function | string) {
    this.pendingSubject.next(true); // 开启等待状态
    let func: Function = null;
    const httpPromise = this._service.file(url, param);
    httpPromise.then(result => {
      const res: any = result;
      // console.log(res.headers.get('content-disposition'));
      if (!res.headers.get('content-disposition')) {
        // 将字符串转换成 Blob对象
        const blobObj = new Blob([res.body], {
          type: 'text/plain'
        });
        // 将Blob 对象转换成字符串
        const reader = new FileReader();
        const msg = '';
        reader.readAsText(blobObj, 'utf-8');
        reader.onload = () => {
          // tslint:disable-next-line:no-eval
          const errorResult = eval('(' + reader.result + ')');
          if (failure) {
            func = this._getCallback(failure);
            if (func) { func(errorResult); }
          } else {
            this._service.tipDialog(errorResult['msg']);
          }
        };
      } else {
        this._service.saveFile(res);
        if (success) {
          func = this._getCallback(success);
          if (func) { func(res); }
        }
      }
      this.pendingSubject.next(false);
    }).catch(
      result => {
        console.log('437 result', result);
        console.log('438 error', error);
        this.pendingSubject.next(false);
        if (error) {
          func = this._getCallback(error);
          if (func) { func(result); }
        }
      }
    );
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    this._createBase();
    this._createEnv();
    this._createPending();
    if (this._onCreate) {
      this._onCreate();
    }
  }
  ngOnDestroy() {
    // console.log('ngOnDestroy id' + this.id + ': ' + this.constructor.name);
    if (this._onDestroy) {
      this._onDestroy();
    }
    this._subscriptionList.forEach((value, index, array) => {
      value.unsubscribe();
    });
    this._callbackFunctions = null;
    if (this.id) {
      delete this._scopeContainers[this.id];
      // this._root._removeChildContainer(this.id);
    }
    this._hasDestroy = true;
    // const rootId = this._rootPath[0];
    // this._service.removeChildContainer(rootId, this.id, this);
  }
  ngAfterViewInit(): void {
    if (this.index !== undefined) { // 数据驱动创建的
      if (this.index !== -1) { // -1表示非循环的独立创建的子容器
        const parentData: object[] = this.parent['_data']; // 肯定有数据
        const eleData = parentData[this.index];
        if (this._onSetElement) { this._onSetElement(eleData); }
      }
      setTimeout(() => { this._doOnInit(); });
    }
    const selfInit = this._metadata['_selfInit'];
    if (selfInit && selfInit === true) {
      this._metadata['_selfInit'] = false;
      // this._service.hideMask();
      setTimeout(() => { this._doOnInit(); });
      // console.log('ngAfterViewInit do id=' + this.id + ': ' + this.constructor.name + ', selfInit' + selfInit, this._metadata);
    } else {
      // console.log('ngAfterViewInit skip id=' + this.id + ': ' + this.constructor.name + ', selfInit' + selfInit);
    }
    this.selfInit = true;
  }
  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  protected _createBase() {
    if (!this.parent) {
      return;
    }
    this._rootPath = [...this.parent._getRootPath() || [], ...[this.id]];
    if (this.index !== undefined) { // 存在index, 数据驱动的容器
      this._scopeContainers = Object.assign({}, this._parent._getScopeContainers()); // 新副本
      // // console.log('存在index, 数据驱动的容器, index=', this.index, this._parent._getScopeContainers());
    } else { // 不存在index, 普通容器
      this._scopeContainers = this._parent._getScopeContainers();
    }
    this._scopeContainers[this.id] = this;
    this._parent._addChild(this);
    this._scope = this.index === -1 ? this._metadata.scope : this._parent.scope;
    // if (this.index === -1) {
    //   this._scope = this._metadata.scope;
    // } else {
    //   this._scope = this._parent.scope;
    // }
  }
  protected _createEnv() {
    const metadata = this._metadata;
    this.local = metadata.local || {};
    this.onCreate = metadata.onCreate;
    this.version = metadata.version;
    this.onInit = metadata.onInit;
    this.onDestroy = metadata.onDestroy;
    this.onResize = metadata.onResize;
    this.onSetElement = metadata.onSetElement;
    this.onGetElement = metadata.onGetElement;
    this.style = metadata.style;
    this.hidden = metadata.hidden;
  }
  protected _createPending() {
    const pending = new Subject<boolean>();
    this.pendingSubject = pending.pipe(debounceTime(100));
    this._subscriptionPending = this.pendingSubject.subscribe(
      (event: boolean) => {
        this._pending = event;
      }
    );
    this._subscriptionList.push(this._subscriptionPending);
  }
  protected _setCallbackFunction(name: string, func: Function): Function {
    this._callbackFunctions[name] = func;
    return func;
  }
  protected _getCallbackFunction(name: string): Function {
    let func: Function = this._callbackFunctions[name];
    if (!func) { // 会在每次调用时都试着去metadata取一次
      const funcString = this._metadata[name];
      if (funcString) {
        func = this._compileCallbackFunction(funcString);
        this._setCallbackFunction(name, func);
      }
    }
    return func;
  }
  protected _setCallbackEvent(event: ContainerEvent): ContainerEvent {
    this._callbackEvents[event.name] = event;
    return event;
  }
  protected _getCallbackEvent(name: string): ContainerEvent {
    return this._callbackEvents[name];
  }

  protected _setDoEventFunction(event: ContainerEvent, func: Function) {
    this[event.doEventFuncName] = func;
  }
  protected _getDoEventFunction(event: ContainerEvent): Function {
    return this[event.doEventFuncName];
  }
  protected _doEvent(event: ContainerEvent, func: Function, e: any) {
    const f = this[event.doEventFuncName];
    f(func, e);
  }
  protected _setEvent(eventName: string, funcStr: string) {
    const event = this._getCallbackEvent(eventName);
    const func = this._setCallbackFunction(event.callbackFuncName, funcStr ? this._compileCallbackFunction(funcStr, event.defaultParam) : null);
    event.reset();
    if (func) {
      event.set(event.observable.subscribe((e) => {
        this._doEvent(event, func, e);
      }));
    }
  }

  protected _evalStatement(statement): any {
    if (statement && this._hasDestroy === false) {
      try {
        // tslint:disable-next-line:no-eval
        const ret: any = eval(statement);
        // // console.log('eval ret=', typeof ret);
        return ret;
      } catch (e) {
        console.log(e);
        console.error(statement);
        this._service.tipDialog('执行语句出错!');
      }

    }
  }
  protected _compileCallbackFunction(evalStr: string, argum?: string): any {
    if (evalStr == null) { return null; }
    let evalFunc: any;
    if (this._service.isFunction(evalStr)) {
      evalFunc = this._evalStatement('(\n' + evalStr + '\n)');
    } else {
      evalFunc = this._evalStatement(argum + '=>{\n' + evalStr + '\n}');
    }
    return evalFunc;
  }
  protected _getCallback(callback: Function | string): Function {
    if (!callback) { throw new Error('回调参数(callback)为null'); }
    let func: Function = null;
    if (typeof callback === 'function') {
      func = callback;
    } else if (typeof callback === 'string') {
      func = this._getCallbackFunction(callback);
      if (!func) { throw new Error('无法获取已定义的回调名称(' + callback + ')'); }
    }
    return func;
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  public _doOnInit() {
    if (this._onInit) {
      this._onInit();
    }
    this._childList.forEach((value) => {
      try {
        value._doOnInit();
      } catch (e) {
        e += '\n在 容器(id=' + value.id + ')的onInit, function=' + value.onInit;
      }
    });
    this._initialized = true; //  执行完初始化
  }

  public _addChild(container: ContainerComponent) {
    this._childList.push(container);
    this._childMap[container.id] = container;
  }
  public _removeChild(container: ContainerComponent) {
    let index: number = null;
    this._childList.forEach((v, i) => {
      if (v === container) { index = i; }
    });
    if (index) {
      this._childList.splice(index, 1);
    }
    delete this._childMap[container.id];
  }
  public _getScopeContainers(): { [id: string]: ContainerComponent } {
    return this._scopeContainers;
  }
  public _getRootPath(): string[] {
    return this._rootPath;
  }
  public _self() {
    return this;
  }
  public _isChildHidden(id: string): boolean {
    /**
     * TODO xiex 改成子节点加载完成后ts代码内判断执行hidden 
     * hidden逻辑抽离html
     */

    const container = this._childMap[id]; // 会不存在？ 是的 会

    if (container) {
      return !!container.hidden;
    }


    /*
    if (this._childList.length === 0) {
      // console.log('container _isChildHidden, childmap=', this._childMap);
      return true;
    }
    const container = this._childMap[id]; // 会不存在？ 是的 会
    if (!container) {
      // console.log('container _isChildHidden 找不到container, id=', id);
      return true;
    }
    console.log('======_isChildHidden=====',);
    return !!container.hidden;

    */

  }

}


/***********************************************************************************/
/*                           存取器get/set 用户使用                                */
/***********************************************************************************/

/***********************************************************************************/
/*                            生命周期 life cycle                                  */
/***********************************************************************************/

/***********************************************************************************/
/*                              互相调用  for call                                 */
/***********************************************************************************/

/***********************************************************************************/
/*                    私有或继承  for private or inherit                           */
/***********************************************************************************/


