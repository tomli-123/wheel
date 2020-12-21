/***********************************************************************************/
/* author: 王里
/* update logs:
/* 2019/6/10 王里 创建
/***********************************************************************************/
import { OnInit, OnDestroy, ElementRef, Renderer2, Component } from '@angular/core';
import { ContainerService, ContainerComponent, ContainerMetadata } from '@qiuer/core';
import { DatasetService } from './dataset.service';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DatasetMetadata extends ContainerMetadata {
  defaultData?: any; // 默认数据 无用
  // clazz?: Clazz;
  clsBoxing?: boolean;
  clsPadding?: boolean;
  clsMargin?: boolean;
  clsTopMargin?: boolean;

  // TODO 名称和实现检查 @wl
  isMaxHeight?: boolean; // 是否撑满页面高度
}


/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value                                                                   */
/***********************************************************************************/

@Component({ template: '' })
export abstract class DatasetComponent extends ContainerComponent implements OnInit, OnDestroy {

  protected _metadata: DatasetMetadata;
  protected _data: any; // 可视化数据

  // 默认样式
  public _clazz: any = {};
  protected _clsBoxing: boolean;
  protected _clsPadding: boolean;
  protected _clsMargin: boolean;
  protected _clsTopMargin: boolean;

  public layoutChange: boolean;

  public _isActive = false;
  public _isDialogActive = false;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get data(): any { return null; }
  public set data(data: any) { }

  public get clsBoxing(): boolean { return this._clsBoxing; }
  public set clsBoxing(clsBoxing: boolean) {
    if (clsBoxing) {
      this._clsBoxing = !!clsBoxing;
      this._clazz['boxing'] = this._clsBoxing;
    }
  }

  public get clsPadding(): boolean { return this._clsPadding; }
  public set clsPadding(clsPadding: boolean) {
    if (clsPadding) {
      this._clsPadding = !!clsPadding;
      this._clazz['padding'] = this._clsPadding;
    }
  }

  public get clsMargin(): boolean { return this._clsMargin; }
  public set clsMargin(clsMargin: boolean) {
    if (clsMargin) {
      this._clsMargin = !!clsMargin;
      this._clazz['margin'] = this._clsMargin;
    }
  }

  public get clsTopMargin(): boolean { return this._clsTopMargin; }
  public set clsTopMargin(clsTopMargin: boolean) {
    if (clsTopMargin) {
      this._clsTopMargin = !!clsTopMargin;
      this._clazz['topMargin'] = this._clsTopMargin;
    }
  }

  public set isMaxHeight(isMaxHeight: boolean) {
    if (this.root && this.root['dialogData'] && this.root['dialogData'] instanceof Object) {
      this._isDialogActive = isMaxHeight;
    } else {
      this._isActive = isMaxHeight;
    }
  }
  public get isMaxHeight(): boolean {
    return this._isActive || this._isDialogActive;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.clsBoxing = this._metadata.clsBoxing;
    this.clsPadding = this._metadata.clsPadding;
    this.clsMargin = this._metadata.clsMargin;
    this.clsTopMargin = this._metadata.clsTopMargin;
    this.isMaxHeight = !!this._metadata.isMaxHeight;
    this.setLayoutChange();
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                            others                                 */
  /***********************************************************************************/

  setLayoutChange(): void {
    if (this._rootPath && this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.getLayoutChange(); });
    }
  }

  getLayoutChange(): void {

  }

}
