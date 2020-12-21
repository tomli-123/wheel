/***********************************************************************************/
/* author: 林清将
/* update logs:
/* 2019/6/10 林清将 创建
/* update 2019/7/4 谢祥 html添加 dynlayout 修改数据格式
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { LayoutComponent } from '../../layout.component';
import { PanelLayoutMetadata } from '../panel.component';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ExpansionPanelLayoutMetadata extends PanelLayoutMetadata {
  titles?: string[]; // 所有的标题
  statusList?: boolean[]; // 所有的状态 true 展开 false 闭合
  multi?: boolean; // 是否允许同时展开多个面板
  // childs: ExpansionPanelChildMetadata[]; // TODO 什么鬼
}

// export interface ExpansionPanelChildMetadata extends PanelLayoutMetadata {
//   title?: string; // 标题
//   expandedStatus?: boolean; // 是否展开
//   childs?: any[]; // TODO 什么鬼
// }

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get childs
/* onChildChange 子元素改变时调用 参数 child 子元素的this
/***********************************************************************************/
@Component({
  selector: 'expansionpanel-layout',
  styleUrls: ['./expansionPanel.component.scss'],
  templateUrl: './expansionPanel.component.html'
})
export class ExpansionPanelLayoutComponent extends LayoutComponent implements OnInit, OnDestroy {
  protected _metadata: ExpansionPanelLayoutMetadata;
  public _multi: boolean;
  public _titles: string[];
  public _statusList: boolean[];
  // public onChildChangeSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  // public set childs(childs: ExpansionPanelChildMetadata[]) {
  //   if (childs && childs instanceof Array) {
  //     if (childs.length === 1 && typeof childs[0].expandedStatus !== 'boolean') {
  //       childs[0].expandedStatus = true;
  //     }
  //     const titles = childs.map(item => item.title || '');
  //     this._titles = titles;
  //     const statusList = childs.map(item => !!item.expandedStatus);
  //     this._statusList = statusList;
  //   }
  //   this._childs = childs;
  // }

  // public get childs() {
  //   return this._childs;
  // }

  public set titles(titles: string[]) {
    this._titles = titles;
  }

  public get titles(): string[] {
    return this._titles;
  }

  public set statusList(statusList: boolean[]) {
    this._statusList = statusList;
    const num = this._childs.length - statusList.length;
    if (num > 0) {
      for (let i = num; i--;) {
        this._statusList.push(false);
      }
    }
  }

  public get statusList(): boolean[] {
    return this._statusList;
  }

  public set multi(multi: boolean) {
    this._multi = !!multi;
  }

  public get multi(): boolean {
    return this._multi;
  }
  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  // protected registerEvent() {
  //   super.registerEvent();
  //   const childChangeEvent = new ContainerEvent('childChange', this.onChildChangeSubject, '(row)');
  //   this._setCallbackEvent(childChangeEvent);

  //   this._setDoEventFunction(childChangeEvent, (func: Function, e: any) => {
  //     func(e);
  //   });
  // }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  // public onChildChange(child) {
  //   this.onChildChangeSubject.next(child);
  // }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    // this.registerEvent();
    this.titles = this._metadata.titles || [];
    this.statusList = this._metadata.statusList || [];
    // this.childs = this._metadata.childs || [];
    this.multi = typeof this._metadata.multi !== 'undefined' ? !!this._metadata.multi : false;
    // this.onChildChangeSubject.subscribe(child => {
    //   const titles = this.titles.slice(0);
    //   const statusList = this.statusList.slice(0);
    //   for (let i = this._metadata.childs.length; i--;) {
    //     const element = this._metadata.childs[i];
    //     if (element.id === child.id) {
    //       titles[i] = child.title || child._metadata.title || '';
    //       statusList[i] = typeof child.expandedStatus !== 'undefined' ? !!child.expandedStatus : !!child._metadata.expandedStatus;
    //       break;
    //     }
    //   }
    //   this.titles = titles;
    //   this.statusList = statusList;
    // });
  }

}
