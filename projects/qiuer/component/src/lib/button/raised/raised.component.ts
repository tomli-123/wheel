/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/* 2019/6/10 林清将 添加注释
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonComponent, ButtonMetadata } from '../button.component';
import { ContainerService } from '@qiuer/core';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface RaisedButtonMetadata extends ButtonMetadata {
  label?: string;  // 按钮上的文字
  //  backgroundColor?: string; // TODO 是否跟layout冲突 主题色: primary accent warn 或者#开头的16进制颜色代码
  shape?: string; // 按钮形状 rectangle: 方形   circle： 大圆  mini-circle: 小圆  basic：基本按钮  stroked：轻触按钮  flat：扁平化按钮
  // icon?: string; // 按钮上的图标
}

/***********************************************************************************/
/*                                     组件                                        */
/***********************************************************************************/
@Component({
  selector: 'raised-button',
  templateUrl: './raised.component.html',
  styleUrls: ['./raised.component.scss']
})
export class RaisedButtonComponent extends ButtonComponent implements OnInit, OnDestroy {

  protected _metadata: RaisedButtonMetadata;
  // public _backgroundColor: string;

  public _label: string;
  public _shape: string;

  constructor(public _service: ContainerService) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  set shape(shape: string) {
    switch (shape) {
      case 'rectangle': this._shape = 'mat-raised-button'; break;
      case 'circle': this._shape = 'mat-fab'; break;
      case 'mini-circle': this._shape = 'mat-mini-fab'; break;
      case 'basic': this._shape = 'mat-button'; break;
      case 'stroked': this._shape = 'mat-stroked-button'; break;
      case 'flat': this._shape = 'mat-flat-button'; break;
    }
  }

  get shape(): string {
    return this._shape;
  }

  set label(label: string) {
    this._label = label;
  }
  get label(): string {
    return this._label;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.shape = this._metadata.shape || 'mat-raised-button';
    this.label = this._metadata.label || '';
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
