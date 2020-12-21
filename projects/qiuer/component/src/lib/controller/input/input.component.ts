/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { BaseInputControllerComponent, BaseInputControllerMetadata } from '../baseInput.component';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface InputControllerMetadata extends BaseInputControllerMetadata {
  tip?: string; // 提示信息(显示为一个'问号'), 内容可以换行
  hasClear?: boolean; // 有清除按钮
  autocomplete?: boolean; //  是否自动填充 默认为否
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value                                                                   */
/***********************************************************************************/
@Component({
  selector: 'input-ctrl',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputControllerComponent extends BaseInputControllerComponent implements OnInit {

  protected _metadata: InputControllerMetadata;
  public mouserOnHelpButton = false;
  public tip: string;
  public _autocomplete: string;
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
    if (this._formControl.value === undefined || this._formControl.value === '' || this._formControl.value === null) {
      if (this.useEmptyAsString) {
        return '';
      } else {
        return null;
      }
    } else if (this._valueType.type === 'number') {
      return Number(this._formControl.value);
    } else {
      return this._formControl.value;
    }
  }

  public set autocomplete(autocomplete: boolean) {
    if (!!autocomplete) {
      this._autocomplete = 'on';
    } else {
      this._autocomplete = 'off';
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.tip = this._metadata.tip;
    this.autocomplete = this._metadata.autocomplete;
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  public transformValue(value: any): any {
    return this._valueType.setValue(value);
  }
  public transFromParam(urlParam: string): any {
    return this._valueType.transFromParam(urlParam);
  }
}
