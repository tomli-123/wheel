import { Component, OnInit } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';

export interface SwitchControllerMetadata extends ControllerMetadata {
  position?: string;  // 文字所在位置 'before' 'after'
}

@Component({
  selector: 'switch-ctrl',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})

export class SwitchControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: SwitchControllerMetadata;
  public position: string;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  public transFromParam(value: string): boolean {
    return !!(value && value === 'true');
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: boolean) {
    this._formControl.setValue(value);
  }

  public get value(): boolean {
    return this._formControl.value;
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.position = this._metadata.position || 'after';
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
