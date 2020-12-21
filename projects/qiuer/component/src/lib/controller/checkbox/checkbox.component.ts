/***********************************************************************************/
/* author: 章梦瑶
/* update logs:
/* 2019/6/10 章梦瑶 创建
/* 2019/6/27 谢祥 添加tip 修改样式
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';

export interface CheckboxControllerMetadata extends ControllerMetadata {
  position?: string;  // 复选框相对文本的位置(before、after),默认为after
  tip?: string; // 提示信息(显示为一个'问号'), 内容可以换行
}

/***********************************************************************************/
/*                                        组件                                     */
/* 方法：
/* set/get value
/* transFromParam  从地址栏上取值,转为布尔值后赋给组件
/***********************************************************************************/
@Component({
  selector: 'checkbox-ctrl',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: CheckboxControllerMetadata;
  public position: string;
  public mouserOnHelpButton = false;
  public tip: string;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.position = this._metadata.position || 'after';
    this.tip = this._metadata.tip;
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


  public transFromParam(value: string): void {
    if (value === 'true') {
      this.value = true;
    } else {
      this.value = false;
    }
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
