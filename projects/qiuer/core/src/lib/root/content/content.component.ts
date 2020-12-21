import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RootComponent, RootMetadata } from '../root.container';
import { ContainerService } from '../../container/container.service';
import { ContainerMetadata } from '../../container/container.component';

export interface ContentRootMetadata extends RootMetadata {
  childs: ContainerMetadata[];
}

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentRootComponent extends RootComponent implements OnInit, AfterViewInit, OnDestroy {

  protected _metadata: ContentRootMetadata;
  public _childs: ContainerMetadata[];
  constructor(public _service: ContainerService) {
    super(_service);
  }

  /********************************* get set *********************************/

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this._childs = this._metadata.childs;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

}
