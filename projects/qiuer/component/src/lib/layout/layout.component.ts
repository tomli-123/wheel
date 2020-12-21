import { OnInit, OnDestroy, Component } from '@angular/core';
import { ContainerService, ContainerComponent, ContainerMetadata } from '@qiuer/core';

import { Style } from './style';
export interface LayoutMetadata extends ContainerMetadata {
  childStyle?: Style;
  childs?: ContainerMetadata[];

  fxLayout?: string; // 排列方式
  fxLayoutAlign?: string; // 子元素对齐方式
  clsBoxing?: boolean;
  clsPadding?: boolean;
  clsMargin?: boolean;
  clsTopMargin?: boolean;
}

@Component({ template: '' })
export abstract class LayoutComponent extends ContainerComponent implements OnInit, OnDestroy {

  protected _metadata: LayoutMetadata;
  protected _childs: ContainerMetadata[];

  public _fxLayout: string;
  public _fxLayoutAlign: string;

  // 默认样式
  public _clazz: any = {};
  protected _clsBoxing: boolean;
  protected _clsPadding: boolean;
  protected _clsMargin: boolean;
  protected _clsTopMargin: boolean;
  // 显示
  _defaultChildStyle: Style = { flex: '100', xs: { flex: '100' }, sm: { flex: '100' } };
  _specialChildStyle: any; // 特殊layout设置

  constructor(public _service: ContainerService) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set childs(childs: ContainerMetadata[]) {
    this._childs = childs;
    this.defaultChildStyle = this._metadata.childStyle;
  }
  public get childs(): ContainerMetadata[] {
    return this._childs;
  }

  public get fxLayout(): string { return this._fxLayout; }
  public set fxLayout(fxLayout: string) {
    this._fxLayout = fxLayout;
  }

  public get fxLayoutAlign(): string { return this._fxLayoutAlign; }
  public set fxLayoutAlign(fxLayoutAlign: string) {
    this._fxLayoutAlign = fxLayoutAlign;
  }

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


  public set defaultChildStyle(childStyle: Style) {
    if (childStyle && childStyle !== null) {
      const def = this._service.mergeObject(this._defaultChildStyle, childStyle);
      this._service.setLayout(def, this.childs, this.fxLayout, this._specialChildStyle);
    } else {
      this._service.setLayout(this._defaultChildStyle, this.childs, this.fxLayout, this._specialChildStyle);
    }
  }


  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  protected registerEvent(): void { }


  public changeStyle(style: Style, id: string): void {
    try {
      // this.childs[index]['style'] =  style ;
      let child = null;
      this.childs.forEach(element => {
        if (element['id'] === id) {
          child = element;
        }
      });
      if (child) {
        child['style'] = style;
        this.defaultChildStyle = this._metadata.childStyle;
        this.root.layoutChange();
      }
    } catch (error) {
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.fxLayout = this._metadata.fxLayout || 'row wrap';
    this.fxLayoutAlign = this._metadata.fxLayoutAlign || 'start start';
    this.childs = this._metadata.childs || [];
    this.clsBoxing = this._metadata.clsBoxing;
    this.clsPadding = this._metadata.clsPadding;
    this.clsMargin = this._metadata.clsMargin;
    this.clsTopMargin = this._metadata.clsTopMargin;
    this.setLayoutChange();
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  setLayoutChange(): void {
    if (this._rootPath && this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.getLayoutChange(); });
    }
  }

  getLayoutChange(): void {

  }

}
