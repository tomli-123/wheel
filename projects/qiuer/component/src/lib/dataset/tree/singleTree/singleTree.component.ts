import { Component, OnInit, OnDestroy, Renderer2, ElementRef, Injectable } from '@angular/core';
import { DatasetService } from '../../dataset.service';
import { TreeDatasetComponent, TodoItemFlatNode, TreeDatasetMetadata, ItemNode, TableColumnButton } from '../tree.component';
import { ContainerService, ContainerEvent } from '@qiuer/core';

import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ItemNode[]>([]);
  public onDrop: Subject<any>;

  get data(): ItemNode[] { return this.dataChange.value; }

  constructor() {
    this.onDrop = new Subject<any>();
  }

  getParentFromNodes(node: ItemNode): any {
    for (const item of this.data) {
      const currentRoot = item;
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: ItemNode, node: ItemNode): any {
    // console.log(currentRoot);
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (const item of currentRoot.children) {
        const child = item;
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  objClone(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }

  copyPasteItem(from: ItemNode, to: ItemNode): void {
    // console.log('起始', from, '结束', to); // 起始
    if (from && to) {
      // if (from['level'] === to['level'] + 1) {
      const fromParent = this.getParentFromNodes(from);
      // 删除起始父节点中的起始项
      const fromArray = fromParent == null ? this.data : fromParent.children;
      fromArray.splice(fromArray.indexOf(from), 1);
      // 在目标位置插入子项
      from.pid = to.id;
      to.children ? to.children.push(from) : to['children'] = [from];
      this.dataChange.next(this.data);
      this.onDrop.next({
        to: to,
        from: from,
        fromParent: fromParent
      });
      // }
      //  else {
      //   this.snackBar.open('移动节点不能改变层级');
      // }
    }
  }

  copyPasteItemAbove(from: ItemNode, to: ItemNode): void {
    const fromParent = this.getParentFromNodes(from);
    const toParent = this.getParentFromNodes(to);
    // console.log('=====copyPasteItemAbove=====', from, to, fromParent, toParent);
    if (from && to) {
      // if (from['level'] === to['level']) {
      const fromArray = fromParent == null ? this.data : fromParent.children;
      const toArray = toParent == null ? this.data : toParent.children;

      from.pid = toParent ? toParent.id : null;

      // 删除起始父节点中的起始项
      fromArray.splice(fromArray.indexOf(from), 1);
      // 在目标位置插入
      toArray.splice(toArray.indexOf(to), 0, from);
      if (fromParent !== null && fromParent.children.length === 0) {
        delete fromParent.children;
      }
      this.dataChange.next(this.data);
      this.onDrop.next({
        to: toParent,
        from: from,
        fromParent: fromParent
      });
      // } else {
      //   this.snackBar.open('移动节点不能改变层级');
      // }
    }
  }

  copyPasteItemBelow(from: ItemNode, to: ItemNode): void {
    const fromParent = this.getParentFromNodes(from);
    const toParent = this.getParentFromNodes(to);
    // console.log('=====copyPasteItemBelow=====', from, to, fromParent, toParent);
    if (from && to) {
      // if (from['level'] === to['level']) {
      const fromArray = fromParent == null ? this.data : fromParent.children;
      const toArray = toParent == null ? this.data : toParent.children;

      from.pid = toParent ? toParent.id : null;

      fromArray.splice(fromArray.indexOf(from), 1);
      toArray.splice(toArray.indexOf(to) + 1, 0, from);
      if (fromParent !== null && fromParent.children.length === 0) {
        delete fromParent.children;
      }
      this.dataChange.next(this.data);
      this.onDrop.next({
        to: toParent,
        from: from,
        fromParent: fromParent
      });
      // } else {
      //   this.snackBar.open('移动节点不能改变层级');
      // }
    }
  }

}

export interface SingleTreeDatasetMetadata extends TreeDatasetMetadata {
  isCheck?: boolean; // 是否可选
  isMultiple?: boolean; // 是否多选
  isCheckStyle?: boolean; // 是否有选中样式
  isDrop?: boolean; // 开启拖拽
  // selected: string | string[];
  selected: any[];
  data: any;
  filter?: string;
  filterFields?: Array<string>;

  indent?: number; // 缩进距离
  verticalSpacing?: string; // 纵向间距
  buttons?: TableColumnButton[];

  // event
  onSelected?: string;
  onDrop?: string;
  onSetCustomizeLabel?: string;
}

@Component({
  selector: 'tree-component',
  templateUrl: './singleTree.component.html',
  styleUrls: ['./singleTree.component.scss'],
  providers: [ChecklistDatabase]
})
export class SingleTreeDatasetComponent extends TreeDatasetComponent implements OnInit, OnDestroy {

  protected _metadata: SingleTreeDatasetMetadata;
  prevCheckNode: TodoItemFlatNode;
  _isCheck = true;
  _isMultiple = true;
  clickData: any;

  stack: any = []; // 用于过滤，暂时存放一条node记录
  _indent = 30; // 缩进 单位px
  _verticalSpacing = 'verticalSpacing_def'; // 间距，详情参见scss
  _filterFields: Array<string> = []; // 过滤的字段list
  _isCheckStyle = false;
  _isDrop = false;
  _buttons: Array<object> = [];

  public handleNode: any;
  showNode: any;

  // 拖拽
  dragNode: any; // 抓取的Node
  dragNodeExpandOverWaitTimeMs = 300; // over上延迟300毫秒展开
  dragNodeExpandOverNode: any; // over的node
  dragNodeExpandOverTime: number; // 覆盖在Node上的时间,大于300毫秒就展开
  dragNodeExpandOverArea: string; // 拖动对比目标的位置
  public hasDropChange = false;
  public _flatData: any = null; // 存放平面结构树数据

  // event
  protected _clickChangeEvent: ContainerEvent;

  // Subject
  onSelectedSubject: Subject<any> = new Subject<any>();
  onDropSubject: Subject<any> = new Subject<any>();

  public checkedNode: any;

  public _onSetCustomizeLabel: Function;

  constructor(private database: ChecklistDatabase, public _service: ContainerService,
    public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);

    database.dataChange.subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;
      this.dataSource.data = this._dataSource.data = data;
    });

    this.database.onDrop.subscribe(res => {
      this.hasDropChange = true;
      this.onDropSubject.next(res);
    });
  }

  registerEvent(): void {
    const selectedEvent = new ContainerEvent('selected', this.onSelectedSubject, '(value)');
    this._setCallbackEvent(selectedEvent);
    this._setDoEventFunction(selectedEvent, (func: Function, e: any) => {
      func(e);
    });

    const dropEvent = new ContainerEvent('drop', this.onDropSubject, '(value)');
    this._setCallbackEvent(dropEvent);
    this._setDoEventFunction(dropEvent, (func: Function, e: any) => {
      func(e.to, e.from, e.fromParent);
    });
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    if (!this._isCheck) {
      return;
    }
    if (!this.descendantsPartiallySelected(node)) {
      this.checklistSelection.toggle(node);
    }
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    // descendants.every(child =>
    //   this.checklistSelection.isSelected(child)
    // );
    this.checkAllParentsSelection(node);
  }

  // 子节点
  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    if (!this._isCheck) {
      return;
    }
    if (!this._isMultiple) {
      if (this.prevCheckNode && this.prevCheckNode !== node) {
        this.checklistSelection.deselect(this.prevCheckNode);
      }
      this.prevCheckNode = node;
    }
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  isParentDisabled(): boolean {
    return false;
  }

  isDisabled(): boolean {
    return true;
  }

  _clickTree(node: TodoItemFlatNode): void {
    //  this.findDataByNode(node.value, this._data);
    setTimeout(() => {
      if (this.isCheckStyle) {
        this.checkedNode = node;
      }
      this.onSelectedSubject.next(node);

    });
    // console.log(this.checklistSelection.selected);
  }

  dataTest(): void {
    // console.log(this.flatData);
  }

  findDataByNode(value: string, trees: any): void {
    for (const item of trees) {
      if (item['children']) {
        this.findDataByNode(value, item['children']);
      }
      if (item['value'] === value) {
        this.clickData = item;
        break;
      }
    }
  }

  buttonClick(node, event, onClick?: string) {
    event.stopPropagation();
    this.handleNode = node;
    if (onClick) {
      const onClickFn = this._compileCallbackFunction(onClick);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(node);
      }
    }
  }

  columnFunc(node, func?: string) {
    if (func) {
      const _func = this._compileCallbackFunction(func);
      return _func(node);
    }
    return false;
  }

  getStyle(node, func?: string) {
    if (func) {
      const _func = this._compileCallbackFunction(func);
      return _func(node);
    }
    return {};
  }

  addTree(result, nodeItem?) {
    const node = nodeItem || this.handleNode;
    if (result && typeof (result) == 'object') {
      const newnode = result, data = this.dataSource.data;
      node.children ? node.children.push(newnode) : node['children'] = [newnode];
      this.database.dataChange.next(data);
      this.treeControl.expand(node);
    }
  }

  editTree(result, nodeItem?) {
    const node = nodeItem || this.handleNode;
    if (result && typeof (result) == 'object') {
      // result['opflag'] = 'Y';
      const newnode = result, data = this.dataSource.data;
      Object.assign(node, newnode);
      this.database.dataChange.next(data);
    }
  }

  delTree(nodeItem?) {
    const node = nodeItem || this.handleNode;
    const parentNode: any = this.getParentNode(node);
    const data = this.dataSource.data;
    const parentData = parentNode ? parentNode.children : data;

    for (let i = 0; i < parentData.length; i++) {
      if (parentData[i].id === node.id) {
        parentData.splice(i, 1);
      }
    }
    this.database.dataChange.next(data);
  }

  treeEnter(e, node) {
    e.preventDefault();
    this.showNode = node;
  }
  treeLeave(e) {
    e.preventDefault();
    this.showNode = null;
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set isCheck(isCheck: boolean) {
    this._isCheck = !!isCheck;
    this.checklistSelection.clear();
  }
  public get isCheck(): boolean {
    return this._isCheck;
  }

  public set isDrop(isDrop: boolean) {
    this._isDrop = !!isDrop;
  }
  public get isDrop(): boolean {
    return this._isDrop;
  }

  public set isMultiple(isMultiple: boolean) {
    this._isMultiple = !!isMultiple;
    this.checklistSelection.clear();
  }
  public get isMultiple(): boolean {
    return this._isMultiple;
  }

  public set isCheckStyle(isCheckStyle: boolean) {
    this._isCheckStyle = !!isCheckStyle;
    if (!isCheckStyle) { this.checkedNode = null; }
  }
  public get isCheckStyle(): boolean {
    return this._isCheckStyle;
  }

  public get flatData(): any {
    let _flatData = this._flatData;
    if (!!this._flatData) {
      const pidKey = this.option.pid || 'pid';
      _flatData = this.treeToFlat(this._service.copy(this.data), 'children');
      _flatData = _flatData.map(item => {
        delete item.children;
        item[pidKey] = item.pid;
        return item;
      });
      // console.log(_flatData, this.option);
    }
    return _flatData;
  }
  public set flatData(flatData: any) {
    this._flatData = flatData;
  }

  public get data(): Array<any> {
    return this.dataSource.data;
  }
  public set data(data: Array<any>) {
    if (data instanceof Array) {
      this._pending = true;

      if (!data[this.option['children']] && (this.option['id'] && this.option['pid'])) {
        this.flatData = data;
        data = this.flatToTree(data, this.option);
        // console.log(this.flatData);
        // console.log(data);
      }

      this.replaceName(data, this.option);
      // console.log(data, this.option);
      // this._data = data || [];
      // this.dataSource.data = this._dataSource.data = this._data;
      this.database.dataChange.next(data);
      setTimeout(() => { this._pending = false; }, 200);
      // this.onDataChangeSubject.next(data);
    }
  }


  public set selected(name: any[]) {
    // console.log('=========tree=======tree', name);
    this.checklistSelection.clear();
    if (this._isMultiple) {
      name && name instanceof Array ? name = name : name = [];
    } else {
      name && name instanceof Array && name.length !== 0 ? name = [name[0]] : name = [];
    }
    this.getSelectedTree(this._treeControl.dataNodes, name);
  }
  public get selected(): any[] {
    const arr = [];
    for (const item of this.checklistSelection.selected) {
      if (item['value']) {
        arr.push(item['value']);
      }
    }
    // for (let i = 0; i < this.checklistSelection.selected.length; i++) {
    //   if (this.checklistSelection.selected[i]['value']) {
    //     arr.push(this.checklistSelection.selected[i]['value']);
    //   }
    // }
    if (!this.isMultiple) {
      return this.checklistSelection.selected.length > 0 ? [this.checklistSelection.selected[0]['value']] : [];
    }
    return arr;
  }

  public set filter(filter: string) {
    const _selected = Object.assign([], this.checklistSelection.selected).map(item => item.value);
    if (filter && filter.length > 0) {
      const tree = JSON.parse(JSON.stringify(this.data));
      for (const item of tree) {
        this.filterTree(item, filter);
      }
      // for (let i = 0; i < tree.length; i++) {
      //   this.filterTree(tree[i], filter);
      // }
      this.getFilterTree(tree);
      this.dataSource.data = tree;
      filter && filter.length > 0 ? this.treeControl.expandAll() : this.treeControl.collapseAll();
    } else {
      this.dataSource.data = this.data;
    }
    this.selected = _selected;
  }

  public set filterFields(filterFields: Array<string>) {
    if (filterFields && filterFields instanceof Array) {
      this._filterFields = filterFields;
    }
  }
  public get filterFields(): Array<string> {
    return this._filterFields;
  }

  public set indent(indent: number) {
    let _indent = isNaN(indent) ? 15 : Number(indent);
    if (_indent < 15) { _indent = 15; }
    this._indent = _indent;
  }
  public get indent(): number {
    return this._indent;
  }

  public set verticalSpacing(verticalSpacing: string) {
    this._verticalSpacing = verticalSpacing || 'verticalSpacing_def';
  }
  public get verticalSpacing(): string {
    return this._verticalSpacing;
  }

  // 重写父类的方法
  public get pSelected(): any {
    const arr = [];
    for (const item of this._pChecklistSelection.selected) {
      if (item['value']) {
        arr.push(item['value']);
      }
    }

    // for (let i = 0; i < this._pChecklistSelection.selected.length; i++) {
    //   if (this._pChecklistSelection.selected[i]['value']) {
    //     arr.push(this._pChecklistSelection.selected[i]['value']);
    //   }
    // }
    return arr;
  }

  // onValueChange 无get
  public set onSelected(onSelected: string) {
    this._setEvent('selected', onSelected);
  }

  public set onDrop(onDrop: string) {
    this._setEvent('drop', onDrop);
  }

  public get onSetCustomizeLabel(): string { return this._onSetCustomizeLabel.toString(); }
  public set onSetCustomizeLabel(onSetCustomizeLabel: string) {
    if (this._service.isFunction(onSetCustomizeLabel)) {
      this._onSetCustomizeLabel = this._evalStatement(onSetCustomizeLabel);
    }
  }

  public set buttons(buttons: Array<object>) {
    if (buttons && buttons instanceof Array) {
      this._buttons = buttons;
    }
  }
  public get buttons() {
    return this._buttons;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.isCheck = this._metadata.isCheck;
    this.isDrop = this._metadata.isDrop;
    this.isMultiple = this._metadata.isMultiple;
    this.isCheckStyle = this._metadata.isCheckStyle;
    this.selected = this._metadata.selected;
    this.buttons = this._metadata.buttons;
    this.registerEvent();
    this.onSelected = this._metadata.onSelected;
    this.onDrop = this._metadata.onDrop;
    this.onSetCustomizeLabel = this._metadata.onSetCustomizeLabel;

    this.data = this._metadata.data;
    this.filter = this._metadata.filter;
    this.indent = this._metadata.indent;
    this.verticalSpacing = this._metadata.verticalSpacing;
    this.filterFields = this._metadata.filterFields;
  }

  getSelectedTree(tree: any, value: any): void {
    if (tree) {
      for (const treeItem of tree) {
        if (treeItem && treeItem.value) {
          for (const valueItem of value) {
            if (treeItem.value === valueItem) {
              this.checklistSelection.select(treeItem);
              this.checkAllParentsSelection(treeItem);
            }
          }
        }
        if (treeItem && treeItem.children) {
          this.getSelectedTree(treeItem.children, value);
        }
      }

      // for (let i = 0; i < tree.length; i++) {
      //   if (tree[i] && tree[i].value) {
      //     for (let j = 0; j < value.length; j++) {
      //       if (tree[i].value === value[j]) {
      //         this.checklistSelection.select(tree[i]);
      //         this.checkAllParentsSelection(tree[i]);
      //       }
      //     }
      //   }
      //   if (tree[i] && tree[i].children) {
      //     this.getSelectedTree(tree[i].children, value);
      //   }
      // }
    }
  }

  filterTree(node, filter): void {
    this.stack.push(node);
    if (this.checkFilter(node, filter)) {
      for (const item of this.stack) {
        item.filter = true;
      }
      // for (let i = 0; i < this.stack.length; i++) {
      //   this.stack[i].filter = true;
      // }
      this.stack.pop();
    }
    if (node.children) {
      for (const item of node.children) {
        this.filterTree(item, filter);
      }
      // for (let j = 0; j < node.children.length; j++) {
      //   this.filterTree(node.children[j], filter);
      // }
    }
    if (this.stack.length > 0) {
      this.stack.pop();
    }
  }

  checkFilter(node, filter): boolean {
    if (this.filterFields.length < 1) {
      return false;
    }
    for (const i of this.filterFields) {
      if (!filter || (node[i] && node[i].indexOf(filter) !== -1)) {
        return true;
      }
    }
    return false;
  }

  getFilterTree(tree: any): void {
    for (let i = 0; i < tree.length; i++) {
      if (!tree[i].filter) {
        delete (tree[i]);
      } else {
        if (tree[i].children) {
          this.getFilterTree(tree[i].children);
        }
      }
    }
  }

  _getCusLabel(node: any) {
    if (this._onSetCustomizeLabel) {
      return this._onSetCustomizeLabel(node);
    }
    return node.name;
  }

  handleDragStart(event, node): void {
    // console.log('handleDragStart', event, node);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node): void {
    // console.log('handleDragOver', event, node);
    event.preventDefault();
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }
    // const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, node): void {
    event.preventDefault();
    if (node !== this.dragNode) {
      // console.log('handleDrop', event, node);
      if (this.dragNodeExpandOverArea === 'above') {
        this.database.copyPasteItemAbove(this.dragNode, node);
      } else if (this.dragNodeExpandOverArea === 'below') {
        this.database.copyPasteItemBelow(this.dragNode, node);
      } else {
        this.database.copyPasteItem(this.dragNode, node);
      }
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd(event): void {
    // console.log('handleDragEnd', event);
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  setNestedData(data): any {
    if (data[this.option['children']]) {
      return data;
    } else if (this.option['id'] && this.option['pid']) {
      this.flatToTree(data, this.option);
    }
    return data;
  }

}

