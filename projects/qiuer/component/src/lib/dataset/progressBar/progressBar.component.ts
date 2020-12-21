/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/7/30 谢祥 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ProgressBarDatasetMetadata extends DatasetMetadata {
  label?: string; // 进度条名称 (上传进度...)
  progress?: number; // 进度 xx%
}

@Component({
  selector: 'progressBar-dataset',
  styleUrls: ['./progressBar.component.scss'],
  templateUrl: './progressBar.component.html'
})
export class ProgressBarDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  public _metadata: ProgressBarDatasetMetadata;
  public _label: string;
  public _progress: number;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                 */
  /***********************************************************************************/
  public set label(label: string) {
    this._label = label || '进度';
  }
  public get label(): string {
    return this._label;
  }

  public set progress(progress: number) {
    if (isNaN(progress) || progress === undefined) {
      this._progress = 0;
    } else if (progress > 100) {
      this._progress = 100;
    } else { this._progress = progress; }
  }
  public get progress(): number {
    return this._progress;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.label = this._metadata.label;
    this.progress = this._metadata.progress;
  }

  /***********************************************************************************/
  /*                            others                                               */
  /***********************************************************************************/


}
