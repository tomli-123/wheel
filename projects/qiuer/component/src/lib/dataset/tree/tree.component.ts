import { OnInit, OnDestroy, Renderer2, ElementRef, Component } from '@angular/core';

import { ContainerService } from '@qiuer/core';
import { DatasetService } from '../dataset.service';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export class TodoItemNode {
  children: TodoItemNode[];
  name: string;
  value: string;
}

export class ItemNode {
  children: ItemNode[];
  name: string;
  value: string;
  id: string;
  pid: string;
  expandable: boolean;
  level: number;
  // order: number;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  name: string;
  value: string;
  level: number;
  expandable: boolean;
}

export class DataSetOption {
  children?: string; // 节点名；
  value?: string; // 选中的value字段;
  name?: string; // 展示的label;
  id?: string; // 平面树时的子节点标识字段
  pid?: string; // 平面树时的父节点标识字段
}

export interface TableColumnButton {
  name: string; // 按钮名
  tip: string;
  disabled: string;
  hidden: string;
  onClick: string; // 按钮方法
  type?: string; // button类型 raised || icon 默认raised
  style?: string; // 样式
  icon?: string; // 填写icon
}

export interface TreeDatasetMetadata extends DatasetMetadata {
  option?: DataSetOption; // 配置对应的节点名称（children），展示名称（name），对应节点值（value）
}

@Component({ template: '' })
export abstract class TreeDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  levels = new Map<ItemNode, number>();

  protected _metadata: TreeDatasetMetadata;
  public option: DataSetOption = { children: 'children', value: 'value', name: 'name', id: null, pid: null };

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, ItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;
  _treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, TodoItemFlatNode>;
  _dataSource: MatTreeFlatDataSource<ItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  /** 非完全选中的父节点数组 */
  _pChecklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this._treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._dataSource = new MatTreeFlatDataSource(this._treeControl, this.treeFlattener);
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.name === '';


  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public get pSelected(): any {
    return this._pChecklistSelection.selected;
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    /*
    const existingNode = this.nestedNodeMap.get(node);
    // console.log(existingNode, node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode : new TodoItemFlatNode();

    for (const key of Object.keys(node)) {
      flatNode[key] = node[key];
    }
    // flatNode.name = node.name;
    // flatNode.value = node.value;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
    */

    this.levels.set(node, level);
    node.level = level;
    node.expandable = !!node.children;
    return node;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    // if (descAllSelected &&  !this.checklistSelection.isSelected(node) ) {
    //   this.checklistSelection.select(node);
    // }
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    if (result && !this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(node);
    }
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  // todoItemSelectionToggle(node: TodoItemFlatNode): void {
  //   if (!this._isCheck) {
  //      return ;
  //   }
  //   this.checklistSelection.toggle(node);
  //   const descendants = this.treeControl.getDescendants(node);
  //   this.checklistSelection.isSelected(node)
  //     ? this.checklistSelection.select(...descendants)
  //     : this.checklistSelection.deselect(...descendants);

  //   // Force update for the parent
  //   descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );
  //   this.checkAllParentsSelection(node);
  // }

  // tslint:disable-next-line:member-ordering
  // prevCheckNode: TodoItemFlatNode;

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  // todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
  //   if (!this._isCheck) {
  //     return ;
  //  }
  //   if (!this._isMultiple) {
  //     if (this.prevCheckNode &&  this.prevCheckNode !== node) {
  //       this.todoLeafItemSelectionToggle(this.prevCheckNode);
  //     }
  //     this.prevCheckNode = node;
  //   }
  //   this.checklistSelection.toggle(node);
  //   this.checkAllParentsSelection(node);
  // }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    if (this.descendantsPartiallySelected(node)) {
      this._pChecklistSelection.select(node);
    } else {
      this._pChecklistSelection.deselect(node);
    }
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      if (this.descendantsPartiallySelected(parent)) {
        this._pChecklistSelection.select(parent);
      } else {
        this._pChecklistSelection.deselect(parent);
      }
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  replaceName(arr, data): void {
    const myData: DataSetOption = {
      children: data.children || 'children', // 节点名称
      value: data.value || 'value', // 修改添加字段value值
      name: data.name || 'name' // 修改添加的字段值
    };
    if (data['id'] || data['pid']) {
      myData['id'] = data.id || 'id';
      myData['pid'] = data.pid || 'pid';
    }
    for (const item of arr) {
      item['value'] = item[myData.value];
      item['name'] = item[myData.name];
      if (myData['id'] || myData['pid']) {
        item['id'] = item[myData.id];
        item['pid'] = item[myData.pid];
      }
      if (item[myData.children]) {
        for (const minItem of item[myData.children]) {
          minItem['value'] = minItem[myData.value];
          minItem['name'] = minItem[myData.name];
        }
        item['children'] = item[myData.children];
        this.replaceName(item[myData.children], myData);
      }
    }
  }


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    if (this._metadata['option'] && this._metadata.option instanceof Object) {
      for (const i of Object.keys(this.option)) {
        this.option[i] = this._metadata.option[i] || this.option[i];
      }
    }
  }

  getSelected(): void {
    const node1 = this.treeControl.dataNodes[0];
    this.checklistSelection.toggle(node1);
    // const  node2 = this.treeControl.dataNodes[1];
    // console.log(node2);
    // this.checklistSelection.toggle(node2);
    // const  node3 = this.treeControl.dataNodes[2];
    // console.log(node3);
    // this.checklistSelection.toggle(node3);
  }

  treeToFlat(node, nodesKey): any {
    const result = [];
    node.forEach(item => {
      const loop = data => {
        result.push(data);
        const child = data[nodesKey];
        // tslint:disable-next-line:prefer-for-of
        if (child) { for (let i = 0; i < child.length; i++) { loop(child[i]); } }
      };
      loop(item);
    });
    return result;
  }

  flatToTree(data, option): any {
    // tslint:disable-next-line:one-variable-per-declaration
    const parents = [], children = [], pidKey = option ? option['pid'] || 'pid' : 'pid', idKey = option ? option['id'] || 'id' : 'id';
    for (const i of data) {
      if (!i[pidKey] || i[pidKey] == null) { parents.push(i); }
      if (i[pidKey] && i[pidKey] != null) { children.push(i); }
    }
    this.translator(parents, children, { id: idKey, pid: pidKey });
    return parents;
  }

  translator(parents, children, option): void {
    for (const parent of parents) {
      for (const current of children) {
        if (current[option.pid] === parent[option.id]) {
          this.translator([current], children, option);
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current];
        }
      }
    }
  }

}
