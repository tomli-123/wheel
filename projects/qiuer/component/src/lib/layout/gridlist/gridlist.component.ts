import { Component, OnInit, Renderer2, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerMetadata, ContainerService } from '@qiuer/core';

export interface GridlistLayoutMetadata extends LayoutMetadata {
  // childs: GirdList[];
  cols?: number;
  rowHeight?: string;
  list?: GirdList[];
}

export interface GirdList {
  childElement?: ContainerMetadata;
  col?: number; // 行
  row?: number; // 列
  value?: string;
  bgColor?: string;
}

@Component({
  selector: 'gridlist-layout',
  templateUrl: './gridlist.component.html',
  styleUrls: ['./gridlist.component.scss']
})

export class GridlistLayoutComponent extends LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  public _metadata: GridlistLayoutMetadata;

  public _list: GirdList[];

  constructor(public _service: ContainerService, private renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef) {
    super(_service);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  set list(list: GirdList[]) {
    this._list = list;
  }

  get list(): GirdList[] {
    return this._list;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.list = this._metadata.list;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/

}
