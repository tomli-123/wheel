import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { DomSanitizer } from '@angular/platform-browser';
export interface IframeDatasetMetadata extends DatasetMetadata {
  iframeSrc?: string; // 显示内容路径
}

@Component({
  selector: 'iframe-dataset',
  styleUrls: ['./iframe.component.scss'],
  templateUrl: './iframe.component.html'
})
export class IframeDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  protected _metadata: IframeDatasetMetadata;

  public _iframeSrc: any;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2, public sanitizer: DomSanitizer) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set iframeSrc(iframeSrc: string) {
    this._iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }
  public get iframeSrc(): string {
    return this._iframeSrc;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.iframeSrc = this._metadata.iframeSrc;
  }

}
