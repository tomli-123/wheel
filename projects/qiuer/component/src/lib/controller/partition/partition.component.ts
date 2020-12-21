/***********************************************************************************/
/* author: 潘露露
/* update logs:
/* 2019/11/5 潘露露 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { ControllerService } from '../controller.service';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface PartitionMetadata extends ContainerMetadata {
  title?: string; // 分段标题
  theme?: string; // primary|accent|warn
  color?: string; // 优先级大于theme
}

/***********************************************************************************/
/*                                     组件                                        */
/***********************************************************************************/
@Component({
  selector: 'partition-ctrl',
  templateUrl: './partition.component.html',
  styleUrls: ['./partition.component.scss']
})
export class PartitionControllerComponent extends ContainerComponent implements OnInit, OnDestroy {

  public theme: string;
  public title: string;
  public _fontColor = {};
  public _backgroundColor = {};
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service);
  }

  set color(_color: string) {
    this._fontColor = { color: _color };
    this._backgroundColor = { 'background-color': _color };
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.theme = this._metadata.theme || 'primary';
    this.title = this._metadata.title || '标题';
    if (this._metadata.color !== undefined) {
      this.color = this._metadata.color;
    }
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
