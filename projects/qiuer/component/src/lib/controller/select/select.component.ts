/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/* 2019/6/26 贾磊更新 增加isHtmlLable属性 label是否为html
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { BaseSelectControllerMetadata, BaseSelectControllerComponent } from '../baseSelect.component';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface SelectControllerMetadata extends BaseSelectControllerMetadata {
  isHtmlLabel?: boolean; // label是否是一段html
  emptyLabel?: string; // 空选项标签, required=true就不会显示
  hasClear?: boolean;
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value  当value不存在与options时 值为null
/* set hasClear 是否有清除按钮
/* set/get emptyLabel 设置空选项标签
/* option函数化 TODO
/***********************************************************************************/
@Component({
  selector: 'select-ctrl',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectControllerComponent extends BaseSelectControllerComponent implements OnInit {

  protected _metadata: SelectControllerMetadata;
  public mouserOnHelpButton = false;
  public _hasClear: boolean;
  public _emptyLabel: string;
  public _isHtmlLabel: boolean;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }


  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set hasClear(hasClear: boolean) {
    this._hasClear = !!hasClear;
  }

  public set emptyLabel(emptyLabel: string) {
    if (!this._metadata.required) {
      this._emptyLabel = emptyLabel;
    }
  }
  public get emptyLabel(): string {
    return this._emptyLabel;
  }

  public set value(value: any) {
    const transformValue = this.transformValue(value);
    const valueType = this._metadata.type || 'string';

    if ((this.options && this.options.length > 0) || valueType.toLowerCase() === 'object' || value === null) {
      this._innerValue = undefined;
      this._formControl.setValue(transformValue);
    } else {
      this._innerValue = transformValue;
    }
  }
  public get value(): any {
    return this._valueType.getValue(this._formControl.value);
  }



  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    // console.log('onInit select');
    const metadata = this._metadata;
    super.ngOnInit();
    this.hasClear = metadata.hasClear;
    this.emptyLabel = metadata.emptyLabel;
    this._isHtmlLabel = metadata.isHtmlLabel || false;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  public openedChange(search): void {
    search.value = '';
  }

  public transFromParam(urlParam: string): any {
    return this._valueType.transFromParam(urlParam);
  }

  public transformValue(value: any): any {
    return this._valueType.setValue(this._options, value);
  }
}
