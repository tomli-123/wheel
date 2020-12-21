import { Subscription, Observable } from 'rxjs';

export class ContainerEvent {
  protected _name: string; // event名称
  protected _callbackFuncName: string; // 回调函数名称
  protected _doEventFuncName: string; // 运行事件的内部函数
  protected _observable: Observable<any>;
  protected subscription: Subscription = null; // 只用于自身容器的事件改变
  protected _defaultParam: string = null; // 供未写闭包的回调函数使用

  constructor(name: string, observable: Observable<any>, defaultParam: string) {
    this._name = name;
    try {
      this._callbackFuncName = 'on' + this._name.slice(0, 1).toUpperCase() + this._name.slice(1);
      this._doEventFuncName = '_do' + this._name.slice(0, 1).toUpperCase() + this._name.slice(1);
    } catch (error) {
      console.error(error);
      console.error('name解析出错');
    }
    this._observable = observable;
    this._defaultParam = defaultParam;
  }

  public reset() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  public set(subscription: Subscription) {
    this.subscription = subscription;
  }
  public get name(): string {
    return this._name;
  }
  // 获取回调函数名称
  public get callbackFuncName(): string {
    return this._callbackFuncName;
  }
  // 获取事件函数名称
  public get doEventFuncName(): string {
    return this._doEventFuncName;
  }

  public get observable(): Observable<any> {
    return this._observable;
  }

  public get defaultParam(): string {
    return this._defaultParam;
  }

}
