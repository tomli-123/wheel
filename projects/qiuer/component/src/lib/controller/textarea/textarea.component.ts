/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { ControllerComponent, ControllerMetadata } from '../controller.component';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface TextareaControllerMetadata extends ControllerMetadata {
  minrows?: number; // 设置最小行数
  maxrows?: number; // 设置最大行数
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get
/* value 表单的值
/* urlParam 当表单setURLparam时，url对应字段上处理后的值
/***********************************************************************************/
@Component({
  selector: 'textarea-ctrl',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: TextareaControllerMetadata;
  public _minrows: number;
  public _maxrows: number;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: string) {
    this._formControl.setValue(value);
  }

  public get value(): string {
    return this._formControl.value || '';
  }
  public get urlParam(): any {
    return null;
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this._minrows = this._metadata.minrows || 2;
    this._maxrows = this._metadata.maxrows || 5;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

}
