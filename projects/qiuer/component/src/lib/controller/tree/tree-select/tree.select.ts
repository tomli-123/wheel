import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { Input, Output, OnInit, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BehaviorSubject, of as ofObservable, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  nodes: TodoItemNode[];
  label: string;
  value: string;
  expandable: boolean;
}

/**
 * Checklist demo with flat tree
 */
@Component({
  selector: 'tree-select',
  templateUrl: 'tree.select.html',
  styleUrls: ['tree.select.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectComponent implements OnInit, OnChanges {
  levels = new Map<TodoItemNode, number>();
  treeControl: FlatTreeControl<TodoItemNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemNode>;

  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  filterSubject: Subject<string> = new Subject<string>();

  title: string;

  checkedPar: any;
  path = [];
  @Input() items: any = [];
  @Input() value: any = [];
  @Input() filter: string;
  @Input() replaceData: any;
  @Input() filterFields: any[] = ['label'];
  @Output() checkEvent = new EventEmitter<SelectionModel<TodoItemNode>>();

  @Output() checkChild = new EventEmitter<any>();

  @Input() multSelect = true;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemNode>(this.multSelect);

  stack: any = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataChange.subscribe(data => {
      if (data && data !== null) {
        this.dataSource.data = data;
      }
    });

    this.filterSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(
      filter => {
        this.filterChange();
        this.changeDetectorRef.markForCheck();
      }
    );

  }

  ngOnInit(): void { }

  replaceName(arr, data): void {
    const myData = {
      nodeName: data.nodes || 'nodes', // 节点名称
      value: data.value || 'value', // 修改添加字段value值
      label: data.label || 'label' // 修改添加的字段值
    };
    for (let i = 0; i < arr.length; i++) {
      arr[i]['value'] = arr[i][myData.value];
      arr[i]['label'] = arr[i][myData.label];
      if (arr[i][myData.nodeName]) {
        for (let j = 0; j < arr[i][myData.nodeName].length; j++) {
          arr[i][myData.nodeName][j]['value'] = arr[i][myData.nodeName][j][myData.value];
          arr[i][myData.nodeName][j]['label'] = arr[i][myData.nodeName][j][myData.label];
        }
        this.replaceName(arr[i][myData.nodeName], {
          nodeName: data['nodes'] || 'nodes',
          value: data.value || 'value',
          label: data.label || 'label'
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      if (this.items && this.replaceData) {
        this.replaceName(this.items, this.replaceData);
      }

      this.checklistSelection = new SelectionModel<TodoItemNode>(this.multSelect);
      this.dataChange.next(this.items);
      this.getSelectedTree(this.items, this.value);
      // console.log('getSelectedTree')
      const list: any = this.uniq(this.checklistSelection.selected);
      // console.log('uniq')
      this.toExpand(list);
      // console.log('toExpand')
      this.checkEvent.emit(list);
      // console.log('emit')
    }
    console.log(changes);
    if (changes.filter && changes.filter.firstChange !== true) {
      this.filterSubject.next(this.filter);
    }

  }

  filterChange(): void {
    if (this.items && this.replaceData) {
      this.replaceName(this.items, this.replaceData);
    }
    const tree = this.objClone(this.items);
    for (const item of tree) {
      this.filterTree(item, this.filter);
    }

    this.getfilterTree(tree);
    this.dataChange.next(tree);
    if (this.filter === '' || this.filter == null) {
      this.treeControl.collapseAll();
    } else {
      this.treeControl.expandAll();
    }

    const selected = [];
    for (const item of this.checklistSelection.selected) {
      selected.push(item.value);
    }
    this.getSelectedTree(tree, selected);
  }

  objClone(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }
  toExpand(nodes): void {
    this.path = [];
    if (nodes.length < 1) {
      return;
    }
    for (const i of Object.keys(nodes)) {
      this.getPathNodes(this.dataSource.data, i, []);
      for (const node of this.path) {
        this.treeControl.expand(node);
      }
    }
  }
  getfilterTree(tree: any): void {
    for (let i = 0; i < tree.length; i++) {
      if (!tree[i].filter) {
        delete (tree[i]);
      } else {
        if (tree[i].nodes) {
          this.getfilterTree(tree[i].nodes);
        }
      }
    }
  }
  checkFilter(node, filter): any {
    if (this.filterFields.length < 1) {
      return false;
    }
    for (const i of this.filterFields) {
      if (node[i] && node[i].indexOf(filter) !== -1) {
        if (filter.length > 0) {
          let filterHtml = node['label'];
          if (filterHtml.indexOf(filter) !== -1) {
            const colorFont = '<span class="primary-color">' + filter + '</span>';
            filterHtml = filterHtml.replace(filter, colorFont);
          }
          node['html'] = filterHtml;
        }
        return true;
      }
    }
    return false;
  }
  filterTree(node, filter): void {
    this.stack.push(node);
    if (this.checkFilter(node, filter)) {
      for (const item of this.stack) {
        item.filter = true;
      }
      this.stack.pop();
    }
    if (node.nodes) {
      for (const item of node.nodes) {
        this.filterTree(item, filter);
      }
    }
    if (this.stack.length > 0) {
      this.stack.pop();
    }
  }

  getSelectedTree(tree: any, value: any): void {
    if (tree) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i] && tree[i].value) {
          for (let j = 0; j < value.length; j++) {
            if (tree[i].value === value[j]) {
              if (this.filter !== undefined) {
                for (let m = 0; m < this.checklistSelection.selected.length; m++) {
                  if (value[j] === this.checklistSelection.selected[m]['value']) {
                    this.checklistSelection.toggle(this.checklistSelection.selected[m]);
                  }
                }
              }
              this.checklistSelection.select(tree[i]);
            }
          }
        }
        if (tree[i] && tree[i].nodes) {
          this.getSelectedTree(tree[i].nodes, value);
        }
      }
    }
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

  isSelected(node): boolean {
    const list = this.checklistSelection;
    if (!node['value']) {
      return false;
    }
    for (const item of list.selected) {
      if (!item['value']) {
        return false;
      }
      if (item['value'] === node['value']) {
        return true;
      }
    }
    return false;
  }

  uniq(array): any {
    const temp = [];
    const index = [];
    const l = array.length;
    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        if (array[i].value === array[j].value) {
          i++;
          j = i;
        }
      }
      if (array[i].value) {
        temp.push(array[i]);
      }
      index.push(i);
    }
    return temp;
  }

  /** Whether all the descendants of the node are selected   判断是否全选 */
  descendantsAllSelected(node: TodoItemNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (!descendants.length) {
      return this.checklistSelection.isSelected(node);
    }
    const selected = this.checklistSelection.isSelected(node);

    const allSelected = this.all(descendants);

    if (!selected && allSelected) {
      this.checklistSelection.select(node);
      this.changeDetectorRef.markForCheck();
    }
    return allSelected;
  }

  /** Whether part of the descendants are selected xxd 部分选中 */
  descendantsPartiallySelected(node: TodoItemNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (!descendants.length) {
      return false;
    }
    const result = descendants.some(child => this.checklistSelection.isSelected(child)); // 是否子节点部分选中

    const isChild = descendants.some(child => child === this.checkedPar); // 当前点击项是否为本节点子项
    // const childHasCheck = descendants.some(child => this.checklistSelection.isSelected(child)); // 是否子节点部分选中
    // if (isChild && childHasCheck && !this.descendantsAllSelected(node)) { // 当前点击为子项,且子节点部分选中非全部选中
    if (isChild && this.descendantsAllSelected(node)) { // 当前点击为子项,且子节点全部选中
      if (node['value']) {
        this.checklistSelection.selected.push(node);
      }
      // } else if (isChild && childHasCheck && !this.descendantsAllSelected(node)) { // 当前点击为子项,且子节点没有一个被选中
    } else if (isChild) { // 当前点击为子项,且子节点没有全部被选中
      if (node['value']) {
        for (let i = this.checklistSelection.selected.length - 1; i > -1; i--) {
          if (this.checklistSelection.selected[i]['value'] === node['value']) {
            this.checklistSelection.selected.splice(i, 1);
          }
        }
      }

    }

    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemNode, $event): void {

    this.checkedPar = node;
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node); // 子节点
    if (node['nodes']) {
      const everyCheck = this.all(descendants); // 是否全部选中
      const someCheck = this.part(descendants); // 是否部分选中
      const checkEle = $event.source._elementRef.nativeElement;
      if (everyCheck) {
        this.checklistSelection.deselect(...descendants, node);
      } else if (!someCheck) {
        this.checklistSelection.select(...descendants, node);
      } else {
        if (checkEle.className.indexOf('mat-checkbox-anim-unchecked-checked') !== -1) {
          this.checklistSelection.deselect(...descendants, node);
        } else {
          this.checklistSelection.select(...descendants, node);
        }
      }
    } else {
      this.checklistSelection.isSelected(node) ?
        this.checklistSelection.select(...descendants, node) :
        this.checklistSelection.deselect(...descendants, node);
    }
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      const list: any = this.uniq(this.checklistSelection.selected);
      this.checkEvent.emit(list);
    }, 50);
  }
  /** 判断部分选中 */
  part(data): any {
    let someSection;
    const hasNodes = data.some(child => 'nodes' in child);
    if (hasNodes) {
      const copeData = [];
      for (const node of data) {
        if (!('nodes' in node)) {
          copeData.push(node);
        }
      }
      someSection = copeData.some(child => this.checklistSelection.isSelected(child));
    } else {
      someSection = data.some(child => this.checklistSelection.isSelected(child));
    }
    return someSection;
  }
  /** 判断全部选中 */
  all(data): any {
    let allSection;
    const hasNodes = data.some(child => 'nodes' in child);
    if (hasNodes) {
      const copeData = [];
      for (const node of data) {
        if (!('nodes' in node)) {
          copeData.push(node);
        }
      }
      allSection = copeData.every(child => this.checklistSelection.isSelected(child)) && copeData.length > 0;
    } else {
      allSection = data.every(child => this.checklistSelection.isSelected(child));
    }
    return allSection;
  }

  getPathNodes(source, node, path): void {
    for (const i of source) {
      const newPath = [...[], ...path];
      newPath.push(i);
      if (i === node) {
        this.path = newPath;
      }
      if (i['nodes']) {
        this.getPathNodes(i['nodes'], node, newPath);
      }
    }
  }

}
