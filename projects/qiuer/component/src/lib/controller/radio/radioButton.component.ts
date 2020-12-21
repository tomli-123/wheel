/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/* 2019/6/26 贾磊更新 增加isHtmlLable属性 label是否为html
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { HaveSelectControllerComponent, HaveSelectControllerMetadata } from '../haveSelect.component';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface RadioControllerMetadata extends HaveSelectControllerMetadata {
  position?: string; // leabel位置 berfore after
  isHtmlLabel?: boolean; // label是否是一段html
}
/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/***********************************************************************************/
@Component({
  selector: 'radio-ctrl',
  templateUrl: './radioButton.component.html',
  styleUrls: ['./radioButton.component.scss']
})
export class RadioControllerComponent extends HaveSelectControllerComponent implements OnInit {

  protected _metadata: RadioControllerMetadata;
  public position: string;
  public _optLabel: string;
  public _optValue: string;
  public _isHtmlLabel: boolean;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: any) {
    this._formControl.setValue(this.transformValue(value));
  }

  public get value(): any {
    return this._valueType.getValue(this._formControl.value);
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    const metadata: RadioControllerMetadata = this._metadata;
    super.ngOnInit();
    this.position = metadata.position || 'after';
    this._isHtmlLabel = metadata.isHtmlLabel || false;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  public transformValue(value: any): any {
    return this._valueType.setValue(this._options, value);
  }

  public transFromParam(urlParam: string): any {
    return this._valueType.transFromParam(urlParam);
  }

}
