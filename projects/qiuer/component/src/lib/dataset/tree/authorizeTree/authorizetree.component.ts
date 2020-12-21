import {
  ChangeDetectorRef, ChangeDetectionStrategy,
  Component, OnInit
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BehaviorSubject, of as ofObservable, Observable, Subject } from 'rxjs';

import { ContainerMetadata, ContainerComponent, ContainerService, ContainerEvent } from '@qiuer/core';

/**
 * Node for to-do item
 */
class TodoItemNode {
  nodes: TodoItemNode[];
  name: string;
  value: string;
  expandable: boolean;
}

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface AuthorizeTreeMetadata extends ContainerMetadata {
  items: any;
  // replaceData: any;
  replaceName: string;
  replaceValue: string;
  replaceNode: string;

  onDataChange: string;
  onDisabledChange: string;
  onCheckedChange: string;
}

/**
 * Checklist demo with flat tree
 */
@Component({
  templateUrl: 'authorizetree.component.html',
  styleUrls: ['authorizetree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizeTreeComponent extends ContainerComponent implements OnInit {
  levels = new Map<TodoItemNode, number>();
  treeControl: FlatTreeControl<TodoItemNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemNode>;
  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  title: string;
  checkedPar: any;

  protected _metadata: AuthorizeTreeMetadata;
  // @Input('items') items: any;
  // @Input('filter') filter: string;
  // @Input('replaceData') replaceData: any;
  _items: any;
  _filter = '';
  _replaceName: string;
  _replaceValue: string;
  _replaceNode: string;

  /** The selection for checklist */
  arraySource = [];
  treedata = [];
  stack: any = [];

  _disabledList: any;
  _checkedList: any;

  // @Output() change = new EventEmitter();
  // @Output() disabledChange = new EventEmitter();
  // @Output() checkedChange = new EventEmitter();

  // event
  protected _clickChangeEvent: ContainerEvent;

  // Subject
  onDataChangeSubject: Subject<any> = new Subject<any>();
  onDisabledChangeSubject: Subject<any> = new Subject<any>();
  onCheckedChangeSubject: Subject<any> = new Subject<any>();

  public get onDataChange(): string { return this._getCallback('onDataChange').toString(); }
  public set onDataChange(onDataChange: string) { this._setEvent('dataChange', onDataChange); }
  public get onDisabledChange(): string { return this._getCallback('onDisabledChange').toString(); }
  public set onDisabledChange(onDisabledChange: string) { this._setEvent('disabledChange', onDisabledChange); }
  public get onCheckedChange(): string { return this._getCallback('onCheckedChange').toString(); }
  public set onCheckedChange(onCheckedChange: string) { this._setEvent('checkedChange', onCheckedChange); }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get filter(): string { return this._filter; }
  public set filter(filter: string) {
    this._filter = filter || '';
    if (filter && filter !== undefined) {
      this.reFilter();
      const tree = this.treedata;
      for (let i = 0; i < tree.length; i++) {
        this.filterTree(tree[i], filter);
      }
    }
    this.updateView();
  }

  public get replaceName(): string { return this._replaceName; }
  public set replaceName(replaceName: string) {
    if (replaceName) {
      this._replaceName = replaceName;
    }
  }

  public get replaceValue(): string { return this._replaceValue; }
  public set replaceValue(replaceValue: string) {
    if (replaceValue) {
      this._replaceValue = replaceValue;
    }
  }

  public get replaceNode(): string { return this._replaceNode; }
  public set replaceNode(replaceNode: string) {
    if (replaceNode) {
      this._replaceNode = replaceNode;
    }
  }



  public get disabledList(): any { return this._disabledList; }
  public get checkedList(): any { return this._checkedList; }

  public get items(): any { return this._items; }
  public set items(items: any) {
    this._items = this.objClone(items);
    this._disabledList = [];
    this._checkedList = [];
    this._items.forEach((item) => {
      if (item['disabled']) {
        this._disabledList.push(item);
      }
      if (item['checked']) {
        this._checkedList.push(item);
      }
    });

    this.arraySource = this._items;
    // this.getAttr();
    this.treedata = this.translateDataToTree(this.arraySource);
    if (this.treedata) {
      this.replaceNodeValue(this.treedata);
    }
    // this.checklistSelection = new SelectionModel<TodoItemNode>(true);
    this.dataChange.next(this.treedata);
    const result = this.objClone(this.arraySource);
    this.delNodes(result);
    this.onDataChangeSubject.next(result);
  }



  constructor(public _service: ContainerService, public changeDetectorRef: ChangeDetectorRef) {
    super(_service);

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.myInit();
    this.registerEvent();
    this.replaceName = this._metadata.replaceName;
    this.replaceValue = this._metadata.replaceValue;
    this.replaceNode = this._metadata.replaceNode;

    this.onDataChange = this._metadata.onDataChange;
    this.onDisabledChange = this._metadata.onDisabledChange;
    this.onCheckedChange = this._metadata.onCheckedChange;
    this.items = this._metadata.items;
  }

  registerEvent(): void {
    const dataChangeEvent = new ContainerEvent('dataChange', this.onDataChangeSubject, '(data)');
    const disabledChangeEvent = new ContainerEvent('disabledChange', this.onDisabledChangeSubject, '(data)');
    const checkedChangeEvent = new ContainerEvent('checkedChange', this.onCheckedChangeSubject, '(data)');
    this._setCallbackEvent(dataChangeEvent);
    this._setCallbackEvent(disabledChangeEvent);
    this._setCallbackEvent(checkedChangeEvent);

    this._setDoEventFunction(dataChangeEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(disabledChangeEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(checkedChangeEvent, (func: Function, e: any) => {
      func(e);
    });
  }

  myInit(): void {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataChange.subscribe(data => {
      if (data && data !== null) {
        console.log(data);
        this.dataSource.data = data;
      }
    });
  }

  getLevel = (node: TodoItemNode): number => {
    return this.levels.get(node) || 0;
  }

  isExpandable = (node: TodoItemNode): boolean => {
    return node.expandable;
  }

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.nodes);
  }

  transformer = (node: TodoItemNode, level: number) => {
    this.levels.set(node, level);
    node.expandable = !!node.nodes;
    return node;
  }
  hasChild = (node: TodoItemNode) => {
    if (node.nodes && node.nodes.length > 0) {
      return true;
    }
    return false;
  }


  replaceNodeValue(arr): void {
    const myData = {
      nodeName: this.replaceNode || 'nodes', //  节点名称
      value: this.replaceValue || 'value', //  修改添加字段value值
      name: this.replaceName || 'name' //  修改添加的字段值
    };
    for (let i = 0; i < arr.length; i++) {
      arr[i]['value'] = arr[i][myData.value];
      arr[i]['name'] = arr[i][myData.name];
      if (arr[i][myData.nodeName]) {
        for (let j = 0; j < arr[i][myData.nodeName].length; j++) {
          arr[i][myData.nodeName][j]['value'] = arr[i][myData.nodeName][j][myData.value];
          arr[i][myData.nodeName][j]['name'] = arr[i][myData.nodeName][j][myData.name];
        }
        this.replaceNodeValue(arr[i][myData.nodeName]);
      }
    }
  }
  updateView(): void {
    this.changeDetectorRef.detectChanges();
    const result = this.objClone(this.arraySource);
    this.delNodes(result);
    // this.change.emit(result);
    this.onDataChangeSubject.next(result);
  }

  reFilter(): void {
    for (const i of this.arraySource) {
      if (i.filter) {
        i.filter = false;
      }
    }
  }
  delNodes(source): void {
    for (const i of source) {
      if (i.nodes) {
        delete i.nodes;
      }
    }
  }
  objClone(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }

  filterTree(node, filter): void {
    this.stack.push(node);
    if (node.name.indexOf(filter) > -1) {
      for (let i = 0; i < this.stack.length; i++) {
        this.stack[i].filter = true;
      }
      this.stack.pop();
    }
    if (node.nodes) {
      for (let j = 0; j < node.nodes.length; j++) {
        this.filterTree(node.nodes[j], filter);
      }
    }
    if (this.stack.length > 0) {
      this.stack.pop();
    }
  }



  isSelected(node): boolean {
    return !!node.checked;
  }
  checkedToggle(node): void {
    const valueField = this.replaceValue || 'value';
    if (node.checked) {
      node['checked'] = false;
      const index = this.isInclude(this._checkedList, node[valueField]);
      this._checkedList.splice(index, 1);
    } else {
      node['checked'] = true;
      this._checkedList.push(node);
    }
    this.onCheckedChangeSubject.next(node);
  }

  uniq(array): any {
    const temp = [];
    const index = [];
    const l = array.length;
    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        if (array[i] === array[j]) {
          i++;
          j = i;
        }
      }
      if (array[i]) {
        temp.push(array[i]);
      }
      index.push(i);
    }
    return temp;
  }


  toDisabled(node): void {
    const valueField = this.replaceValue || 'value';
    if (node.disabled) {
      node.disabled = false;
      const index = this.isInclude(this._disabledList, node[valueField]);
      this._disabledList.splice(index, 1);
    } else {
      node['disabled'] = true;
      node['checked'] = false;
      const index = this.isInclude(this._checkedList, node[valueField]);
      if (index !== -1) {
        this._checkedList.splice(index, 1);
      }

      this._disabledList.push(node);
    }
    this.onDisabledChangeSubject.next(node);
  }

  translateDataToTree(data): any {
    const parents = [];
    const children = [];
    for (const i of data) {
      if (!i.pid || i.pid == null) {
        parents.push(i);
      }
      if (i.pid && i.pid != null) {
        children.push(i);
      }
    }

    this.translator(parents, children);
    return parents;
  }


  isInclude(array: any[], value): number {
    let includeIndex = -1;
    const valueField = this.replaceValue || 'value';
    array.forEach((arr, index) => {
      if (arr[valueField] === value) {
        includeIndex = index;
        return;
      }
    });
    return includeIndex;
  }

  translator(parents, children): void {
    for (const parent of parents) {
      for (const current of children) {
        if (current.pid === parent.id) {
          this.translator([current], children);
          typeof parent.nodes !== 'undefined' ? parent.nodes.push(current) : parent.nodes = [current];
        }
      }
    }
  }
}
