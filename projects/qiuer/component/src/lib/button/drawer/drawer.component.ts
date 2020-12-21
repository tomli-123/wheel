/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/* 2019/6/10 林清将 添加注释
/***********************************************************************************/
import { Component, OnInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ButtonComponent, ButtonMetadata } from '../button.component';
import { ContainerService } from '@qiuer/core';
import { RaisedButtonMetadata } from '../raised/raised.component';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DrawerButtonMetadata extends ButtonMetadata {
  childs: RaisedButtonMetadata[]; // 子按钮 必填
  // backgroundColor?: string; // 主题色: primary accent warn 或者#开头的16进制颜色代码
  label?: string; // 按钮上的文字
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get childs 子按钮
/* doOnClick 菜单点击事件处理方法
/***********************************************************************************/
@Component({
  selector: 'drawer-button',
  styleUrls: ['./drawer.component.scss'],
  templateUrl: './drawer.component.html'
})
export class DrawerButtonComponent extends ButtonComponent implements OnInit, OnDestroy {

  protected _metadata: DrawerButtonMetadata;
  public _signal = false;
  public _label: string;
  public _childs: RaisedButtonMetadata[];

  constructor(public _service: ContainerService, public el: ElementRef) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set childs(childs: RaisedButtonMetadata[]) {
    if (childs && childs instanceof Array) {
      childs.forEach(child => {
        child.type = 'raised-button';
        child.shape = 'mini-circle';
      });
    }
    this._childs = childs;
  }
  public get childs(): Array<RaisedButtonMetadata> {
    return this._childs;
  }

  set label(label: string) {
    this._label = label;
  }
  get label(): string {
    return this._label;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.childs = this._metadata.childs;
    this.label = this._metadata.label || '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  public doOnClick(): void {
    this._signal = !this._signal;
  }

  @HostListener('document:click', ['$event', '$event.target'])
  _onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this._signal = false;
    }
  }

}
