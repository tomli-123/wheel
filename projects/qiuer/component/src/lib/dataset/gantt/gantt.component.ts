import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContainerEvent, ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { Subject } from 'rxjs';
// 样式
// import 'dhtmlx-gantt';
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js'; // 悬浮显示详情
// import 'dhtmlx-gantt/codebase/locale/locale_cn.js';
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_undo.js'; // undo撤销修改，redo恢复修改
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_quick_info.js'; // 点击显示详情
import { gantt } from 'dhtmlx-gantt';
// import * as gantt from 'dhtmlx-gantt';

/***********************************************************************************/
/*                                     TODO                                       */
/***********************************************************************************/
/*重要
使用本组件之前先执行 npm install dhtmlx-gantt
1.点击加号会弹出弹窗
2.点击加号后点击保存,会触发insert事件
3.双击每一行数据会触发编辑事件,点击保存会触发update事件
4.点击删除会触发delete事件
5.点击每一项任务会触发onAttachTask事件
6.点击每一条关系会触发onAttachLink事件
*/
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface Task {
  id: number; // 编号,唯一标识   任务id
  start_date: string; // 项目开始日期
  text: string; // 任务描述
  progress: number; // 项目进度,已完成3/6=0.5, 0到1
  duration: number; // 项目持续时间,总时长   在当前时间刻度下的任务持续周期
  parent: number; // 是否属于某一个项目,若属于写父级项目编号,若独立一个项目,可不填   父任务的id
}
export interface Link {
  id: number;  // 关系编号, 唯一标识   关联线id
  source: number; // 关系源头   数据源任务的id
  target: number; // 关系指向目标  目标源任务的id
  type: string; // 关系类型:分为0,1,2   关联线类型：0 - "结束到开始 "，1 - "开始到开始 "，2 - "结束到结束 "
}
export interface GanttData {
  data?: Task[];
  links?: Link[];
}
export interface GanttDatasetMetadata extends DatasetMetadata {
  data?: GanttData;
  // taskevent
  onTaskInsert?: string; // 新增项目事件
  onTaskUpdate?: string; // 修改项目事件
  onTaskDelete?: string; // 删除项目事件    当删除项目时,若其有对应的关系,则会同时触发删除关系事件
  // linkevent
  onLinkInsert?: string; // 新增关系事件
  onLinkUpdate?: string; // 修改关系事件
  onLinkDelete?: string; // 删除关系事件
}


@Component({
  selector: 'gantt-dataset',
  styleUrls: ['./gantt.component.scss'],
  templateUrl: './gantt.component.html'
  // encapsulation: ViewEncapsulation.None,
})
export class GanttComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit {
  // event
  protected _taskInsertEvent: ContainerEvent;
  protected _taskUpdateEvent: ContainerEvent;
  protected _taskDeleteEvent: ContainerEvent;

  protected _linkInsertEvent: ContainerEvent;
  protected _linkUpdateEvent: ContainerEvent;
  protected _linkDeleteEvent: ContainerEvent;
  protected _attachLinkEvent: ContainerEvent;
  // subject
  onTaskInsertSubject: Subject<any> = new Subject<any>();
  onTaskUpdateSubject: Subject<any> = new Subject<any>();
  onTaskDeleteSubject: Subject<any> = new Subject<any>();

  onLinkInsertSubject: Subject<any> = new Subject<any>();
  onLinkUpdateSubject: Subject<any> = new Subject<any>();
  onLinkDeleteSubject: Subject<any> = new Subject<any>();

  @ViewChild('gantt_here', { static: true }) ganttContainer: ElementRef;

  protected _metadata: GanttDatasetMetadata;
  protected _data: GanttData;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get data(): any {
    return this._data;
  }
  public set data(data: any) {
    console.log('data', data);
    this._data = data;
    gantt.clearAll();
    gantt.parse(this.formatData(this._data));
  }

  public get onTaskInsert(): string { return this._getCallback('onTaskInsert').toString(); }
  public set onTaskInsert(onTaskInsert: string) { this._setEvent('taskInsert', onTaskInsert); }
  public get onTaskUpdate(): string { return this._getCallback('onTaskUpdate').toString(); }
  public set onTaskUpdate(onTaskUpdate: string) { this._setEvent('taskUpdate', onTaskUpdate); }
  public get onTaskDelete(): string { return this._getCallback('onTaskDelete').toString(); }
  public set onTaskDelete(onTaskDelete: string) { this._setEvent('taskDelete', onTaskDelete); }

  public get onLinkInsert(): string { return this._getCallback('onLinkInsert').toString(); }
  public set onLinkInsert(onLinkInsert: string) { this._setEvent('linkInsert', onLinkInsert); }
  public get onLinkUpdate(): string { return this._getCallback('onLinkUpdate').toString(); }
  public set onLinkUpdate(onLinkUpdate: string) { this._setEvent('linkUpdate', onLinkUpdate); }
  public get onLinkDelete(): string { return this._getCallback('onLinkDelete').toString(); }
  public set onLinkDelete(onLinkDelete: string) { this._setEvent('linkDelete', onLinkDelete); }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    // console.log(this._metadata);
    this.registerEvent();
    this.onTaskInsert = this._metadata.onTaskInsert;
    this.onTaskUpdate = this._metadata.onTaskUpdate;
    this.onTaskDelete = this._metadata.onTaskDelete;
    this.onLinkInsert = this._metadata.onLinkInsert;
    this.onLinkUpdate = this._metadata.onLinkUpdate;
    this.onLinkDelete = this._metadata.onLinkDelete;
    // console.log('afterInit');
  }

  ngAfterViewInit(): void {
    gantt.config.xml_date = '%Y-%m-%d %H:%i';
    gantt.config.scale_unit = 'month';	// 按月显示
    gantt.config.date_scale = '%F, %Y';		// 设置时间刻度的格式(X轴) 多个尺度
    gantt.config.scale_height = 50; // 设置时间刻度的高度和网格的标题
    gantt.config.subscales = [
      { unit: 'day', step: 1, date: '%j, %D' }
    ];			// 指定第二个时间刻度
    gantt.init(this.ganttContainer.nativeElement);
    // console.log('初始化', this._data);
    this.data = this._metadata.data;
    gantt.createDataProcessor({
      task: {
        create: (data: Task) => { console.log('InsertTask插入', data); this.taskInsert(data); },
        update: (data: Task) => { console.log('UpdateTask修改', data); this.taskUpdate(data); },
        delete: (data) => { console.log('deleteTask删除', data); this.taskDelete(data); },
      },
      link: {
        create: (data: Link) => { console.log('insertLink插入', data); this.linkInsert(data); },
        update: (data: Link) => { console.log('updateLink修改', data); this.linkUpdate(data); },
        delete: (data) => { console.log('deleteLink删除', data); this.linkDelete(data); },
      }
    });
    this.getLayoutChange();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  /***********************************************************************************/
  /*                            私有                                 */
  /***********************************************************************************/
  registerEvent(): void {
    const taskInsertEvent = new ContainerEvent('taskInsert', this.onTaskInsertSubject, '(data)');
    const taskUpdateEvent = new ContainerEvent('taskUpdate', this.onTaskUpdateSubject, '(data)');
    const taskDeleteEvent = new ContainerEvent('taskDelete', this.onTaskDeleteSubject, '(data)');

    const linkInsertEvent = new ContainerEvent('linkInsert', this.onLinkInsertSubject, '(data)');
    const linkUpdateEvent = new ContainerEvent('linkUpdate', this.onLinkUpdateSubject, '(data)');
    const linkDeleteEvent = new ContainerEvent('linkDelete', this.onLinkDeleteSubject, '(data)');

    this._setCallbackEvent(taskInsertEvent);
    this._setCallbackEvent(taskUpdateEvent);
    this._setCallbackEvent(taskDeleteEvent);

    this._setCallbackEvent(linkInsertEvent);
    this._setCallbackEvent(linkUpdateEvent);
    this._setCallbackEvent(linkDeleteEvent);

    this._setDoEventFunction(taskInsertEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(taskUpdateEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(taskDeleteEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(linkInsertEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(linkUpdateEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(linkDeleteEvent, (func: Function, e: any) => {
      func(e);
    });
  }
  /***********************************************************************************/
  /*                            others                                 */
  /***********************************************************************************/
  public taskInsert(data): void {
    this.onTaskInsertSubject.next(data);
  }
  public taskUpdate(data): void {
    this.onTaskUpdateSubject.next(data);
  }
  public taskDelete(data): void {
    this.onTaskDeleteSubject.next(data);
  }

  public linkInsert(data): void {
    this.onLinkInsertSubject.next(data);
  }
  public linkUpdate(data): void {
    this.onLinkUpdateSubject.next(data);
  }
  public linkDelete(data): void {
    this.onLinkDeleteSubject.next(data);
  }
  formatData(data): any {
    if (data === undefined || data === null) {
      return { data: [], links: [] };
    }

    if (data.data === undefined && data.links === undefined) {
      return { data: [], links: [] };
    }
    if (data.data === undefined && data.links !== undefined && Array.isArray(data.links)) {
      return { data: [], links: data.links };
    }
    if (data.data !== undefined && data.links === undefined && Array.isArray(data.data)) {
      return { data: data.data, links: [] };
    }
    if (data.data !== undefined && data.links !== undefined && !Array.isArray(data.data)) {
      return { data: [], links: data.links };
    }
    if (data.data !== undefined && data.links !== undefined && !Array.isArray(data.links)) {
      return { data: data.data, links: [] };
    }
    if (data.data !== undefined && data.links !== undefined && !Array.isArray(data.links) && !Array.isArray(data.data)) {
      return { data: [], links: [] };
    }
    return data;
  }
}

