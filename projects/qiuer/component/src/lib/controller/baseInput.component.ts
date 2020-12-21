import { OnInit, Component } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from './controller.component';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from './controller.service';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypePassword, ValueTypeEmail } from './input.valuetype';
export enum ValueTypes {
  string = 'string',
  number = 'number',
  password = 'password',
  email = 'email'
}



export interface BaseInputControllerMetadata extends ControllerMetadata {
  valueType?: string;
  prefixHtml?: string; // 前置
  suffixHtml?: string; // 后置
  useEmptyAsString?: boolean; // 是否使用空字符串作为空值 默认值为false;
}

@Component({ template: '' })
export abstract class BaseInputControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: BaseInputControllerMetadata;
  public _valueType: ValueType;
  public prefixHtml: string; // 前缀
  public suffixHtml: string; // 后缀
  public useEmptyAsString = false;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  protected _createValueType(valueType: string): any {
    if (!valueType) { valueType = 'string'; }
    let ret: ValueType = null;
    let vt: string;
    if (ValueTypes[valueType.toLowerCase()]) {
      vt = valueType.toLowerCase();
    } else {
      vt = 'string';
    }

    switch (vt) {
      case 'string': ret = new ValueTypeString(); break;
      case 'number': ret = new ValueTypeNumber(); break;
      case 'password': ret = new ValueTypePassword(); break;
      case 'email': ret = new ValueTypeEmail(); break;
    }
    return ret;
  }


  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/




  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    this._valueType = this._createValueType(this._metadata.valueType);
    super.ngOnInit();
    this.prefixHtml = this._metadata.prefixHtml;
    this.suffixHtml = this._metadata.suffixHtml;
    this.useEmptyAsString = this._metadata.useEmptyAsString || false;
  }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

}
