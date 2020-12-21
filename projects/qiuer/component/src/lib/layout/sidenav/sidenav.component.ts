import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerEvent, ContainerService, ContainerMetadata } from '@qiuer/core';
import { Subject } from 'rxjs';

export interface SidenavLayoutMetadata extends LayoutMetadata {
  sidenavChild: ContainerMetadata;
  contentChild: ContainerMetadata;
  isOpen: boolean;
  title: string;
  mode: string;
  sidenavWidth: string;
  isHiddenClose: boolean; // 隐藏关闭按钮

  onOpenedChange?: string;
  onClosedChange?: string;
}

@Component({
  selector: 'sidenav-layout',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavLayoutComponent extends LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: SidenavLayoutMetadata;
  public _sidenavChild: ContainerMetadata;
  public _contentChild: ContainerMetadata;
  public _isOpen: boolean;
  public _title: string;
  public _mode: string;
  public _sidenavWidth: string;
  public options: any;
  public _isHiddenClose: boolean;


  onOpenedChangeEventSubject: Subject<any> = new Subject<any>();
  onClosedChangeEventSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService) {
    super(_service);

  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set sidenavChild(sidenavChild: ContainerMetadata) { this._sidenavChild = sidenavChild; }
  public get sidenavChild(): ContainerMetadata {
    return this._sidenavChild;
  }

  public set contentChild(contentChild: ContainerMetadata) { this._contentChild = contentChild; }
  public get contentChild(): ContainerMetadata {
    return this._contentChild;
  }

  public set title(title: string) { this._title = title; }
  public get title(): string {
    return this._title;
  }

  public set isOpen(isOpen: boolean) { this._isOpen = isOpen; }
  public get isOpen(): boolean {
    return this._isOpen;
  }

  public set isHiddenClose(isHiddenClose: boolean) { this._isHiddenClose = isHiddenClose; }
  public get isHiddenClose(): boolean {
    return this._isHiddenClose;
  }

  public set mode(mode: string) { this._mode = mode; }
  public get mode(): string {
    return this._mode;
  }

  public set sidenavWidth(sidenavWidth: string) { this._sidenavWidth = sidenavWidth; }
  public get sidenavWidth(): string {
    return this._sidenavWidth;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.registerEvent();
    this.sidenavChild = this._metadata.sidenavChild;
    this.contentChild = this._metadata.contentChild;
    this.isOpen = this._metadata.isOpen;
    this.isHiddenClose = !!this._metadata.isHiddenClose;
    this.mode = this._metadata.mode || 'side';
    this.title = this._metadata.title;
    this.sidenavWidth = this._metadata.sidenavWidth || '300px';
    this.options = {
      bottom: 0,
      fixed: false,
      top: 64
    };
    this.onOpenedChange = this._metadata.onOpenedChange;
    this.onClosedChange = this._metadata.onClosedChange;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                            事件函数  event function                             */
  /***********************************************************************************/

  protected registerEvent(): void {
    super.registerEvent();
    const openedChangeEvent = new ContainerEvent('openedChange', this.onOpenedChangeEventSubject, '()');
    const closedChangeEvent = new ContainerEvent('closedChange', this.onClosedChangeEventSubject, '()');
    this._setCallbackEvent(openedChangeEvent);
    this._setCallbackEvent(closedChangeEvent);

    this._setDoEventFunction(openedChangeEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(closedChangeEvent, (func: Function, e: any) => {
      func(e);
    });
  }

  openedChange(): void {
    this.onOpenedChangeEventSubject.next();
  }

  closedChange(): void {
    this.onClosedChangeEventSubject.next();
  }

  public set onOpenedChange(onOpenedChange: string) {
    this._setEvent('openedChange', onOpenedChange);
  }

  public set onClosedChange(onClosedChange: string) {
    this._setEvent('closedChange', onClosedChange);
  }



}
