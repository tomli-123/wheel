import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
export interface QrcodeDatasetMetadata extends DatasetMetadata {
  url?: string; // 显示内容路径
  size?: number; // 显示宽度
}

@Component({
  selector: 'qrcode-dataset',
  styleUrls: ['./qrcode.component.scss'],
  templateUrl: './qrcode.component.html'
})
export class QrcodeDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  protected _metadata: QrcodeDatasetMetadata;

  public _url: string;
  public _size: number;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set url(url: string) {
    this._url = url;
  }
  public get url(): string {
    return this._url;
  }

  public set size(size: number) {
    this._size = size;
  }
  public get size(): number {
    return this._size;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.url = this._metadata.url;
    this.size = this._metadata.size;
  }

}
