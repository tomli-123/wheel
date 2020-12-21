import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerService, ContainerMetadata } from '@qiuer/core';

export interface LoopLayoutMetadata extends LayoutMetadata {
  child: ContainerMetadata;
  fullHeight?: boolean; // 是否撑满页面高度
}

@Component({
  selector: 'loop-layout',
  templateUrl: './loop.component.html',
  styleUrls: ['./loop.component.scss']
})

export class LoopLayoutComponent extends LayoutComponent implements OnInit, OnDestroy {

  protected _metadata: LoopLayoutMetadata;

  protected _child: ContainerMetadata;
  protected _data: object[] = null;

  public layoutChange: boolean;

  public _isActive = false;
  public _isDialogActive = false;


  constructor(public _service: ContainerService, private changeRef: ChangeDetectorRef) {
    super(_service);
  }

  /************************************ set get ************************************/
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


  public set child(child: ContainerMetadata) {
    this._child = child;
  }

  public get child(): ContainerMetadata {
    return this._child;
  }

  public set data(data: object[]) {
    if (!this._service.isArray(data)) {
      return;
    }
    this._childList = [];
    this._data = data;
    const childs: ContainerMetadata[] = [];
    data.forEach((d, i) => {
      const child = Object.assign({}, this._child);
      // child['data'] = d;
      child['_index'] = i;
      // child['_parent'] = this;
      childs.push(child);
    });
    this.childs = childs;
    this.changeRef.detectChanges();
  }

  public get data(): object[] {
    const data = [];
    this._childList.forEach((item) => {
      if (item._onGetElement) {
        data.push(item._onGetElement());
      }
    });
    return data;
  }


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.child = this._metadata.child;
    this.fullHeight = !!this._metadata.fullHeight;
    this.setLayoutChange();
  }

  setLayoutChange(): void {
    if (this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.layoutChange = !this.layoutChange; });
    }
  }


}
