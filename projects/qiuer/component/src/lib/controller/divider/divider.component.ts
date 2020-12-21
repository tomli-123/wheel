/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/7/4 贾磊 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { ControllerService } from '../controller.service';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DividerMetadata extends ContainerMetadata {
  color?: string; // #开头的16进制颜色代码
}

/***********************************************************************************/
/*                                     组件                                        */
/***********************************************************************************/
@Component({
  selector: 'divider-ctrl',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerControllerComponent extends ContainerComponent implements OnInit, OnDestroy {

  public color: string;


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.color = this._metadata.color || '#888888';
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
