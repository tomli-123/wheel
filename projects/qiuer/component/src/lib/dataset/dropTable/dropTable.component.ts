/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2020/2/21 谢祥 创建
/***********************************************************************************/
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DropTableDatasetMetadata extends DatasetMetadata {
  rows: Array<CellMetadata>;  // 行title
  columns: Array<CellMetadata>; // 列title
  contentLength: number; // 所有单元格中单个元素出现的次数限制
  items: Array<any>; // 可拖拽的数据集合
  item: ItemMetadata; // 数据字段配置
  data: DataMetadata; // 表格内数据
}

interface CellMetadata {
  id: string;
  title: string;
  contentLength?: number; // 单个单元格中元素的个数限制
}

interface ItemMetadata {
  availableLength?: number;
  label: string; // 展示的字段
  key: string | number; // 键
}

interface DataMetadata {
  direction: string;
  data: Array<any>;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dropTable-dataset',
  styleUrls: ['./dropTable.component.scss'],
  templateUrl: './dropTable.component.html'
})
export class DropTableDatasetComponent extends DatasetComponent implements OnInit {

  protected _metadata: DropTableDatasetMetadata;

  private _rows: Array<CellMetadata> = [];
  private _columns: Array<CellMetadata> = [];
  private _contentLength: number;
  private _items: Array<any>;
  private _item: ItemMetadata;

  public viewItems: Array<any> = [];
  public dataSource: any = [];

  filterValue = '';

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  public set rows(rows: Array<CellMetadata>) {
    this._rows = rows;
    this.getViewData();
  }
  public get rows(): Array<CellMetadata> {
    return this._rows;
  }

  public set columns(columns: Array<CellMetadata>) {
    this._columns = columns;
    this.getViewData();
  }
  public get columns(): Array<CellMetadata> {
    return this._columns;
  }

  public set contentLength(contentLength: number) {
    this._contentLength = contentLength;
  }
  public get contentLength(): number {
    return this._contentLength;
  }

  public set items(items: Array<any>) {
    this._items = items;
    this.filterChange();
  }
  public get items(): Array<any> {
    return this._items;
  }

  public set item(item: ItemMetadata) {
    this._item = item;
  }
  public get item(): ItemMetadata {
    return this._item;
  }

  public set data(data: DataMetadata) {
    this._data = data;
    // const keys = data['direction'] === 'RC' ? ['columns', 'rows'] : ['rows', 'columns'];
    // let _data: any;
    // const key = data['direction'] === 'RC' ? 'columns' : 'rows';
    if (data['data'] && data['data'] instanceof Array) {
      data['data'].forEach(ext => {
        const extI = this.dataSource.findIndex(item => ext.id === item.id);
        if (ext['data'] instanceof Array && this.rows.length > 0 && extI > -1) {
          ext['data'].forEach(inside => {
            const insideI = this.dataSource[extI].data.findIndex(item => inside.id === item.id);
            if (insideI > -1 && inside['data'] instanceof Array) {
              this.dataSource[extI].data[insideI]['data'] = this.items.filter(item => inside['data'].indexOf(item.id) > -1);
            }
          });
        } else if (ext['data'] instanceof Array && extI > -1) {
          this.dataSource[extI].data = this.items.filter(item => extI['data'].indexOf(item.id) > -1);
        }
      });
    }
  }
  public get data(): DataMetadata {
    return this._data;
  }

  ngOnInit(): void {
    super.ngOnInit();
    // config
    this.items = this._metadata.items;
    this.item = this._metadata.item;
    this.columns = this._metadata.columns;
    this.rows = this._metadata.rows;
    this.contentLength = this._metadata.contentLength;
    this.data = this._metadata.data;
  }


  drop(event: CdkDragDrop<string[]>): void {
    // console.log(event.previousContainer);
    /**
     * event.previousContainer : 从什么地方来
     * event.container : 到什么地方去
     * event.item : 被移动的项
     * event.previousIndex : 来的列表的index
     * event.currentIndex : 去的列表的index
     */
    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
    // transferArrayItem(event.previousContainer.data,
    //   event.container.data,
    //   event.previousIndex,
    //   event.currentIndex);
    // }
  }

  cellDrop(event, i, j, columnD, rowD): void {
    console.log(event, columnD, rowD);
    // tslint:disable-next-line:one-variable-per-declaration
    const itemData = event.previousContainer.data[event.previousIndex],
      total = this.getItemInTableLength(itemData),
      itemInTableOut = typeof (itemData['availableLength']) === 'number' ?
        total >= itemData['availableLength'] : total >= this.contentLength,
      itemInCell = event.container.data.filter(item =>
        item[this.item.key] === event.previousContainer.data[event.previousIndex][this.item.key]).length > 0,
      previousEle = event.previousContainer.element.nativeElement,
      itemEle = event.item.element.nativeElement;
    // tslint:disable-next-line:one-variable-per-declaration
    let cellMaxLength, isMoveItem;

    if (itemInTableOut && previousEle.classList.value.indexOf('dropCell') === -1) {
      this._service.tipDialog('超过单人可排班最大次数限制');
      return;
    }

    if (typeof (columnD['contentLength']) === 'number') {
      cellMaxLength = columnD['contentLength'];
    } else if (typeof (rowD['contentLength']) === 'number') { cellMaxLength = rowD['contentLength']; }
    if (typeof (cellMaxLength) === 'number' && event.container.data.length === cellMaxLength) {
      this._service.tipDialog('超过该单元格内最大数量限制');
      return;
    }

    if (itemInCell) {
      if (previousEle.classList.value.indexOf('dropCell') > -1 && event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        isMoveItem = true;
      } else {
        this._service.tipDialog('同一单元格内数据不能重复');
        return;
      }
    }

    if (!isMoveItem) {
      this.dataSource[i].data[j].data.splice(event.currentIndex, 0, event.previousContainer.data[event.previousIndex]);
    }

    if (previousEle.classList.value.indexOf('dropCell') > -1 && !isMoveItem) {
      // tslint:disable-next-line:one-variable-per-declaration
      const rowIndex = previousEle.getAttribute('data-rowIndex'),
        columnIndex = previousEle.getAttribute('data-columnIndex'),
        cellIndex = itemEle.getAttribute('data-cellIndex');
      this.dataSource[rowIndex].data[columnIndex].data.splice(cellIndex, 1);
    }
  }

  test(): void {
    console.log(this.dataSource);
  }

  getItemInTableLength(item): number {
    // tslint:disable-next-line:one-variable-per-declaration
    const dataList = this.dataSource.map(data => data.data).flat(),
      itemList = dataList.filter(data => data['data'] instanceof Array &&
        data['data'].filter(res => res[this.item.key] === item[this.item.key]).length > 0);
    return itemList.length;
  }

  remove(data, rowIndex, columnIndex, cellIndex): void {
    this.dataSource[rowIndex].data[columnIndex].data.splice(cellIndex, 1);
  }

  getViewData(): void {
    if (this.rows instanceof Array && this.rows.length > 0 && this.columns instanceof Array) {
      const data = [];
      for (const i of this.rows) {
        const row: any = Object.assign({ data: [] }, i);
        for (const j of this.columns) {
          row.data.push(Object.assign({ data: [] }, j));
        }
        data.push(row);
      }
      this.dataSource = data;
    }
  }

  filterChange(value?): void {
    let view = this.items;
    if (value) {
      view = this.items.filter(item => item[this.item.label].indexOf(value) > -1);
    }
    this.viewItems = view;
  }

  clearFilter($event): void {
    if ($event.value.length > 0) {
      $event.value = '';
      this.filterChange($event.value);
    }
  }

}

