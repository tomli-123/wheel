/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/* 2019/6/10 林清将 添加注释
/***********************************************************************************/
import { OnInit, OnDestroy, Component } from '@angular/core';
import { ContainerEvent, ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { Subject } from 'rxjs';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ButtonMetadata extends ContainerMetadata {
  tip?: string; // hover提示
  tipPosition?: string; // hover提示位置 'left' | 'right' | 'above' | 'below' | 'before' | 'after' 默认above
  icon?: string; // 按钮上的图标
  disabled?: boolean; // 禁用

  top?: string;  // 向上绝对定位
  left?: string; // 向左绝对定位
  bottom?: string; // 向下绝对定位
  right?: string; //  向右绝对定位

  onClick?: string; //  点击事件
}

@Component({ template: '' })
export abstract class ButtonComponent extends ContainerComponent implements OnInit, OnDestroy {

  protected _metadata: ButtonMetadata;

  public _tip: string;
  public _icon: string;
  public _disabled: boolean;


  // 定位
  public position = 'relative';
  public _top: string;
  public _left: string;
  public _bottom: string;
  public _right: string;
  public tipPosition: string;
  // public _buttonStyle = {};
  // public _iconStyle = {};

  // event
  public _clickChangeEvent: ContainerEvent;
  // Subject
  onClickChangeSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService) {
    super(_service);
  }

  registerEvent(): void {
    const clickChangeEvent = new ContainerEvent('clickChange', this.onClickChangeSubject, '()');
    this._setCallbackEvent(clickChangeEvent);

    this._setDoEventFunction(clickChangeEvent, (func: Function, e: any) => {
      func(e);
    });

  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }
  public get disabled(): boolean {
    if (typeof (this._disabled) === 'boolean') {
      return this._disabled;
    } else {
      return false;
    }
  }

  public set tip(tip: string) {
    this._tip = tip;
  }
  public get tip(): string {
    return this._tip;
  }

  public set icon(icon: string) {
    this._icon = icon;
  }
  public get icon(): string {
    return this._icon;
  }

  public set top(top: string) {
    this._top = top || null;
    this._getPosition();
  }
  public get top(): string {
    return this._top;
  }

  public set left(left: string) {
    this._left = left || null;
    this._getPosition();
  }
  public get left(): string {
    return this._left;
  }

  public set bottom(bottom: string) {
    this._bottom = bottom || null;
    this._getPosition();
  }
  public get bottom(): string {
    return this._bottom;
  }

  public set right(right: string) {
    this._right = right || null;
    this._getPosition();
  }
  public get right(): string {
    return this._right;
  }

  // onValueChange 无get
  public set onClick(onClick: string) {
    this._setEvent('clickChange', onClick);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata = this._metadata;
    this.disabled = metadata['disabled'];
    this.tip = metadata['tip'];
    this.icon = metadata['icon'];

    this.top = metadata['top'];
    this.left = metadata['left'];
    this.bottom = metadata['bottom'];
    this.right = metadata['right'];
    this.tipPosition = metadata.tipPosition || 'above';

    this.registerEvent();
    this.onClick = this._metadata.onClick;
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.onClickChangeSubject.unsubscribe();
  }

  /***********************************************************************************/
  /*                              内部方法                                           */
  /***********************************************************************************/
  _getPosition(): void {
    if (this._top || this._left || this.right || this._bottom) {
      this.position = 'absolute';
    } else {
      this.position = 'relative';
    }
  }

  _click(): void {
    this.onClickChangeSubject.next();
  }

}
