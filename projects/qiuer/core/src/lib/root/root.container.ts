import { OnInit, HostListener, AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ContainerComponent, ContainerMetadata, ContainerMapping, HeaderBtn } from '../container/container.component';
import { ContainerService } from '../container/container.service';
import { ContainerEvent } from '../container/container.event';

export interface RootMetadata extends ContainerMetadata {
  scope?: any;
  headerBtns?: HeaderBtn[];
  onHeaderBtnClick?: string;
}

@Component({ template: '' })
export abstract class RootComponent extends ContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  protected _metadata: RootMetadata;
  protected _headerBtns: HeaderBtn[];
  protected _scopeInstance: any = {}; // 只有rootContainer才有
  protected _scopeContainersInstance: ContainerMapping = {};
  protected _headerBtnScribe: any;
  // Subject
  onLayoutChangeSubject: Subject<any> = new Subject<any>();
  onHeaderBtnClickSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService) {
    super(_service);
  }
  protected registerEvent() {
    const layoutChangeEvent = new ContainerEvent('layoutChange', this.onLayoutChangeSubject.pipe(debounceTime(100)), '()');

    this._setCallbackEvent(layoutChangeEvent);

    this._setDoEventFunction(layoutChangeEvent, (func: Function, e: any) => {
      func(e);
    });

  }

  public registerHeaderBtn() {
    const headerBtnClickEvent = new ContainerEvent('headerBtnClick', this.onHeaderBtnClickSubject, '(id)');
    this._setCallbackEvent(headerBtnClickEvent);
    this._setDoEventFunction(headerBtnClickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._headerBtnScribe = this._service.eventChange.subscribe((clickEvent: any) => {
      if (clickEvent.type === 'headerClick') {
        if (this._metadata.onHeaderBtnClick) {
          this.onHeaderBtnClickSubject.next(clickEvent.data);
        } else {
          this.headerBtnClick(clickEvent.data);
        }
      }
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get onHeaderBtnClick(): string { return this._getCallback('onHeaderBtnClick').toString(); }
  public set onHeaderBtnClick(onHeaderBtnClick: string) { this._setEvent('headerBtnClick', onHeaderBtnClick); }

  public get headerBtns(): HeaderBtn[] { return this._headerBtns; }
  public set headerBtns(headerBtns: HeaderBtn[]) {
    if (headerBtns) {
      this._headerBtns = headerBtns;
    }
    this._service.registerHeaderBtn(this._headerBtns);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    // this._metadata._rootPath = [this.id]; // 只有root容器才创建
    this._rootPath = [this.id];
    const id = this._metadata.id;
    this._service.setRootContainer(id, this);
    this._metadata['_selfInit'] = true;
    this._scopeInstance = this._service.mergeObject(this._scopeInstance, this._metadata.scope); // TODO 放到dialog
    this._scope = this._getScopeInstance();

    this._scopeContainers = this._scopeContainersInstance;
    this._scopeContainers[this.id] = this;

    this.registerEvent();
    this.registerHeaderBtn();
    this.onHeaderBtnClick = this._metadata.onHeaderBtnClick;
    this.headerBtns = this._metadata.headerBtns;
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.root.layoutChange();
    this._service.hookChange.emit({});
  }

  ngOnDestroy() {
    if (this._headerBtnScribe) {
      this._service.clearHeaderBtn();
      this._headerBtnScribe.unsubscribe();
    }
    super.ngOnDestroy();
  }

  public _getScopeContainersInstance(): { [id: string]: ContainerComponent } {
    return this._scopeContainersInstance;
  }
  public _getScopeInstance(): any {
    return this._scopeInstance;
  }

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.layoutChange();
  }

  /***********************************************************************************/
  /*                           自定义方法                             */
  /***********************************************************************************/
  public layoutChange(): any {
    this.onLayoutChangeSubject.next(true);
  }

  public headerBtnClick(id: string) {

  }

}
