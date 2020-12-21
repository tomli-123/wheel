/***********************************************************************************/
/* author: 杨强伟
/* update logs:
/* 2019/6/10 杨强伟 创建
/* update 2019/7/3 谢祥 添加disabled、isVertical属性, 修改逻辑bug
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ControllerMetadata, ControllerComponent } from '../controller.component';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';

export interface Toggle {
  name: string; // button名字
  value: string; // button的值
  icon: string; // 图标
  disabled: boolean; // 是否禁用
}
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ButtonToggleControllerMetadata extends ControllerMetadata {
  group: Toggle[]; // 定义整个buttonToggle的名字，值，图标的数组
  isVertical: boolean; // 是否垂直排列
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get
/***********************************************************************************/
@Component({
  selector: 'toggle-ctrl',
  templateUrl: './buttonToggle.component.html',
  styleUrls: ['./buttonToggle.component.scss']
})

export class ButtonToggleControllerComponent extends ControllerComponent implements OnInit, OnDestroy {

  public _metadata: ButtonToggleControllerMetadata;
  public _group: Toggle[] = [];
  public _isVertical: boolean;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: any) {
    this._formControl.setValue(value);
  }
  public get value(): any {
    return this._formControl.value;
  }

  public set group(group: Toggle[]) {
    group && group instanceof Array ? this._group = group : this._group = [];
  }
  public get group(): Toggle[] {
    return this._group;
  }

  public set isVertical(isVertical: boolean) {
    this._isVertical = !!isVertical;
  }
  public get isVertical(): boolean {
    return this._isVertical;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.group = this._metadata.group;
    this.isVertical = this._metadata.isVertical;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
