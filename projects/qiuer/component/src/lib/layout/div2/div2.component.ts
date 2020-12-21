import { Component, OnInit, Renderer2, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerMetadata, ContainerService } from '@qiuer/core';

export interface Div2LayoutMetadata extends LayoutMetadata {
  childs: ContainerMetadata[];
}

@Component({
  selector: 'div2-layout',
  templateUrl: './div2.component.html',
  styleUrls: ['./div2.component.scss']
})

export class Div2LayoutComponent extends LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: Div2LayoutMetadata;

  public _css: string;


  constructor(public _service: ContainerService, private renderer: Renderer2, private el: ElementRef) {
    super(_service);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set css(css: string) { this._css = css; }
  public get css(): string { return this._css; }
  /***********************************************************************************/
  /*                    公共方法                                                     */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                    私有方法                                                      */
  /***********************************************************************************/

}
