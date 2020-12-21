import { Component, OnInit, Renderer2, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerMetadata, ContainerService } from '@qiuer/core';

export interface DivLayoutMetadata extends LayoutMetadata {
  childs: ContainerMetadata[];
  fullHeight?: boolean; // 是否撑满页面高度
  name?: string;
}

@Component({
  selector: 'div-layout',
  templateUrl: './div.component.html',
  styleUrls: ['./div.component.scss']
})

export class DivLayoutComponent extends LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: DivLayoutMetadata;

  public layoutChange: boolean;

  public _isActive = false;
  public _isDialogActive = false;
  public _name: string;
  public _css: string;


  constructor(public _service: ContainerService, private renderer: Renderer2, private el: ElementRef, public changeDetectorRef: ChangeDetectorRef) {
    super(_service);

  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get detectorRef(): any { return this.changeDetectorRef; }

  public set name(name: string) { this._name = name; }
  public get name(): string { return this._name; }

  public set fullHeight(fullHeight: boolean) {
    if (this.root['dialogData'] && this.root['dialogData'] instanceof Object) {
      this._isDialogActive = fullHeight;
    } else {
      this._isActive = fullHeight;
    }
  }
  public get fullHeight(): boolean {
    return this._isActive || this._isDialogActive;
  }

  public set css(css: string) { this._css = css; }
  public get css(): string { return this._css; }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.fullHeight = !!this._metadata.fullHeight;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/

  addHtml(html: string): void {
    console.log(this.el.nativeElement.querySelector('.div_content'));
    // this.el.nativeElement.innerHTML = this.el.nativeElement.innerHTML + html;
  }

  addClass(className: string): void {
    this.renderer.addClass(this.el.nativeElement.querySelector('.div_content'), className);
  }

  removeClass(className: string): void {
    this.renderer.removeClass(this.el.nativeElement.querySelector('.div_content'), className);
  }


  setAttribute(attributeName: string, attributeValue: string): void {
    this.renderer.setAttribute(this.el.nativeElement.querySelector('.div_content'), attributeName, attributeValue);
  }

  removeAttribute(attributeName: string, attributeValue: string): void {
    this.renderer.removeAttribute(this.el.nativeElement.querySelector('.div_content'), attributeName, attributeValue);
  }

  setStyle(style: string, value: string): void {
    this.renderer.setStyle(this.el.nativeElement.querySelector('.div_content'), style, value);
  }

  removeStyle(style: string, value: string): void {
    this.renderer.removeStyle(this.el.nativeElement.querySelector('.div_content'), style);
  }

  getLayoutChange() {
    this.layoutChange = !this.layoutChange;
  }

}
