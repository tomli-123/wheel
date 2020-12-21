import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { DivLayoutMetadata } from './../div/div.component';

export interface AnchorLayoutMetadata extends LayoutMetadata {
  childs: DivLayoutMetadata[];
}

@Component({
  selector: 'anchor-layout',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})

export class AnchorLayoutComponent extends LayoutComponent implements OnInit, OnDestroy {

  protected _metadata: AnchorLayoutMetadata;

  public layoutChange: boolean;


  constructor(public _service: ContainerService) {
    super(_service);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.setLayoutChange();

    const child = document.querySelector('.mat-drawer-content');
    // this.anchorService.attachListner(child as HTMLElement).subscribe();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  setLayoutChange(): void {
    if (this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.layoutChange = !this.layoutChange; });
    }
  }

}
