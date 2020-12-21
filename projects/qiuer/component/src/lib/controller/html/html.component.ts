/***********************************************************************************/
/* author: 林清将
/* update logs:
/* 2019/6/10 林清将 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { ControllerService } from '../controller.service';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface HtmlMetadata extends ContainerMetadata {
  isOneLine?: boolean; // 是否换行显示 true 超出显示省略号 false 超出换行
  label: string; // 展示的string数据
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get isOneLine 是否换行显示 true 超出显示省略号 false 超出换行
/* set/get label 显示内容
/***********************************************************************************/
@Component({
  selector: 'html-ctrl',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss']
})
export class HtmlControllerComponent extends ContainerComponent implements OnInit, OnDestroy {

  protected _metadata: HtmlMetadata;
  private _isOneLine: boolean;

  public _label: string;

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isOneLine = !!this._metadata.isOneLine;
    this.label = this._metadata.label || '';
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set isOneLine(isOneLine: boolean) {
    this._isOneLine = isOneLine;
  }

  public get isOneLine(): boolean {
    return this._isOneLine;
  }

  public set label(label: string) {
    this._label = label;
  }

  public get label(): string {
    return this._label;
  }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
