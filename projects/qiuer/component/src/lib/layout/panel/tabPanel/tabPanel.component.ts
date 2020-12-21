import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { PanelLayoutMetadata, PanelLayoutComponent } from '../panel.component';
import { DivLayoutMetadata } from './../../div/div.component';

export interface TabPanelLayoutMetadata extends PanelLayoutMetadata {
  tabIndex?: number;
  isLazy?: boolean; // 是否开启懒加载
  onSelectedIndexChange?: string;
  childs?: DivLayoutMetadata[];
  isLoop?: boolean; // 是否数据驱动循环第一个child
}

export interface DisplayChild {
  DivLayoutMetadata;
  disabled?: boolean;
  canDelete?: boolean;
}

export interface LoopTabData {
  label: string;
  data: any;
}

@Component({
  selector: 'tabpanel-layout',
  templateUrl: './tabPanel.component.html',
  styleUrls: ['./tabPanel.component.scss']
  // encapsulation: ViewEncapsulation.None,
})

export class TabPanelLayoutComponent extends PanelLayoutComponent implements OnInit, OnDestroy, AfterContentInit {


  public readonly msVersion = '2.5';
  protected _metadata: TabPanelLayoutMetadata;
  protected _displayChilds: DisplayChild[];
  _tabIndex = 0;
  _tabHeight: number;
  _isLazy = false;
  protected _data: object[] = null;
  protected _childs: Array<any> = [];
  _isLoop: boolean;
  onSelectedIndexChangeSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService, public changeRef: ChangeDetectorRef, public el: ElementRef) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set tabIndex(tabIndex: number) {
    if (tabIndex !== undefined && tabIndex !== null) {
      this._tabIndex = tabIndex;
    }
  }
  public get tabIndex(): number { return this._tabIndex; }

  public set displayChilds(childs: DisplayChild[]) { this._displayChilds = this._service.copy(childs); }
  public get displayChilds(): DisplayChild[] { return this._displayChilds; }

  public set isLazy(isLazy: boolean) { this._isLazy = !!isLazy; }
  public get isLazy(): boolean { return this._isLazy; }

  public set isLoop(isLoop: boolean) { this._isLoop = !!isLoop; }
  public get isLoop(): boolean { return this._isLoop; }

  public set data(data: Array<LoopTabData>) {
    if (!this._service.isArray(data) || !this.isLoop) {
      return;
    }
    this._childList = [];
    this._data = data;
    const childs: DisplayChild[] = [];
    if (this._childs.length > 0) {
      data.forEach((d, i) => {
        const child = Object.assign({}, this._childs[0]);
        child['_index'] = i; child['name'] = d.label;
        child['disabled'] = child['canDelete'] = false;
        childs.push(child);
      });
    }
    this.displayChilds = childs;
    this.changeRef.detectChanges();
  }

  public get data(): Array<LoopTabData> {
    const data = [];
    this._childList.forEach((item) => {
      if (item._onGetElement) {
        data.push(item._onGetElement());
      }
    });
    return data;
  }

  public set tabHeight(tabHeight: number) { this._tabHeight = tabHeight; }
  public get tabHeight(): number { return this._tabHeight; }


  /***********************************************************************************/
  /*                            事件函数  event function                             */
  /***********************************************************************************/
  protected registerEvent(): void {
    super.registerEvent();
    const selectedIndexChangeEvent = new ContainerEvent('selectedIndexChange', this.onSelectedIndexChangeSubject, '(row)');
    this._setCallbackEvent(selectedIndexChangeEvent);

    this._setDoEventFunction(selectedIndexChangeEvent, (func: Function, e: any) => {
      func(e);
    });
  }

  public set onSelectedIndexChange(onSelectedIndexChange: string) {
    this._setEvent('selectedIndexChange', onSelectedIndexChange);
  }


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.registerEvent();
    this.displayChilds = this._metadata.childs as any;
    this._childs = this._service.copy(this.displayChilds);
    this.tabIndex = this._metadata.tabIndex;
    this.isLazy = !!this._metadata.isLazy;
    this.isLoop = !!this._metadata.isLoop;
    this.onSelectedIndexChange = this._metadata.onSelectedIndexChange;
  }

  ngAfterContentInit(): void {
    if (!this.tabHeight) {
      const height = this.el.nativeElement.querySelector('.dyn-tabs').offsetHeight;
      this.tabHeight = this.setTabHeight(height);
    }
  }

  /***********************************************************************************/
  /*                              内部方法  private method                           */
  /***********************************************************************************/

  getLayoutChange(): void {
    // if (this.getTabHeight() > 0) {
    //   // this.tabHeight = this.getTabHeight()+ 'px';
    // }
  }

  _isDisabled(index: number): boolean {
    return !!this.displayChilds[index].disabled;
  }

  _showDelete(index: number): boolean {
    return !!this.displayChilds[index].canDelete;
  }

  _selectedIndexChange(index: number): void {
    this._tabIndex = index;
    if (!this.isLazy) {
      this.root.layoutChange();
    }
  }

  _animationDone(): void {
    if (this.isLazy) {
      this.root.layoutChange();
    }
    this.onSelectedIndexChangeSubject.next(this.tabIndex);
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  setTabHeight(height: number): number {
    return height - 50;
  }

  restore(): void {
    this.displayChilds = this._metadata.childs as any;
  }

  deleteTab(startIndex: number, num: number = 1): void {
    try {
      this.displayChilds.splice(startIndex, num);
    } catch (error) {
      this._service.tipDialog('删除异常');
    }
  }

}
