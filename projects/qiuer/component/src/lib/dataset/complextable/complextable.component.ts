/***********************************************************************************/
/* author: 王里
/* update logs:
/* 2019/6/10 王里 创建
/* update 20190619 贾磊
/* checkbox为多选 点击为单选 以后可能会增加开关
/* update 20190625 谢祥 添加 styleFn 单元格样式函数
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { merge } from 'rxjs';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ComplexTableDatasetMetadata extends DatasetMetadata {
  /*****数据*****/
  header?: ComplexTableHeaderMetadata[][]; // 头
  columns?: ComplexTableColumnMetadata[]; // 列数据
  footer?: ComplexTableFooterMetadata[]; // 表尾
  /*****功能*****/
  isSelect?: boolean; // 是否支持选择
  isMultiple?: boolean; // 是否支持多选
  isSort?: boolean; // 是否排序
  dragDrop?: boolean; // 是否拖拽
  canSelectText?: boolean; // 是否可以选中文字 默认值false (和托拽互斥,拖拽优先级大,如果想复制文字,请关闭拖拽)
  /*****info工具栏*****/
  isToolbar?: boolean; // 是否支持工具栏 hasToolbar
  isFilter?: boolean; // 是否过滤 hasFilter
  isMsg?: boolean; // 是否显示记录数 hasInfo
  isPaginator?: boolean; // 是否分页 hasPaginator
  /*********事件********/
  onClick?: string;
  onDblClick?: string;
  onSelected?: string;
  onPagination?: string;
}
export class ComplexTableHeaderMetadata {
  label?: string;
  rowspan?: number;
  colspan?: number;
  sortable?: boolean;
}
export class ComplexTableColumnMetadata {
  type: string;   //  image|icon|value|buttons|radio|checkbox|select
  label?: string; // 保底
  value?: string; // 值
  compare?: string; // 排序所用function
  onHover?: string;  // hover上显示的值
  style?: string;
  width?: string;  // 1到99
  minWidth?: string; // 数字
  align?: string;  // (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  buttons?: ComplexTableColumnButton[];
}

export class ComplexTableFooterMetadata {
  type: string;   //  image|icon|value|buttons|radio|checkbox|select
  value?: string; // 值
  colspan?: number;
  onHover?: string;  // hover上显示的值
  style?: string;
  align?: string;  // (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  buttons?: ComplexTableColumnButton[];
}

export interface ComplexTableColumnButton {
  name?: string; // 按钮名
  icon?: string; // 填写icon
  type?: string; // button类型 raised || icon
  tip?: string;
  disabled?: string;
  hidden?: string;
  onClick?: string; // 按钮方法
}

export class ComplexColumnMetadata {
  type: string;   //  image|icon|value|buttons|radio|checkbox|select
  label?: string;  // 列名
  value?: Function; // 值
  compare?: Function; // 排序所用function
  onHover?: Function;  // hover上显示的值
  style?: Function;
  width?: string;  //  1到99
  minWidth?: string; //  1到99
  align?: string;  //  (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  buttons?: ComplexTableColumnButton[];
}

export class FooterMetadata {
  type: string;   //  image|icon|value|buttons|radio|checkbox|select
  value?: Function; // 值
  onHover?: Function;  // hover上显示的值
  style?: Function;
  colspan?: number;
  align?: string;  //  (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  buttons?: ComplexTableColumnButton[];
}
/***********************************************************************************/
/*                                     组件                                        */
/***********************************************************************************/
@Component({
  selector: ' complexTable-dataset',
  styleUrls: ['./complextable.component.scss'],
  templateUrl: './complextable.component.html'
})
export class ComplexTableDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {
  tool = ['t1', 't2', 't3', 't4'];
  showTable = true;
  showTr = true;

  @ViewChild('table', { static: true }) table;
  @ViewChild(MatTable, { static: true }) matTable: MatTable<any>;
  // table数据
  protected _metadata: ComplexTableDatasetMetadata;
  public _dataSource = new MatTableDataSource();

  public _displayHeader = [];
  public _header: ComplexTableHeaderMetadata[][] = [];
  public _displayColumns = [];
  public _columns: ComplexTableColumnMetadata[] = [];
  public _displayFooter = [];
  public _footer: ComplexTableFooterMetadata[] = [];

  public _selection: any;
  public _filterValue = '';
  public _length: number;
  public _filterSelected = [];
  public bottomHeight = 70;
  public _isSelect: boolean;
  public _isSort: boolean;
  public _isMultiple: boolean;
  public _isToolbar: boolean;
  public _isMsg: boolean;
  public _isFilter: boolean;
  public _isPaginator: boolean;
  public _dragDrop: boolean;
  public canSelectText: boolean;
  // event
  protected _clickEvent: ContainerEvent;
  protected _dblClickEvent: ContainerEvent;

  // Subject
  onClickSubject: Subject<any> = new Subject<any>();
  onDblClickSubject: Subject<any> = new Subject<any>();
  onPaginationSubject: Subject<any> = new Subject<any>();
  onSelectedSubject: Subject<any> = new Subject<any>();
  onSortSubject: Subject<any> = new Subject<any>();
  paginationSubscribe: any; // 分页监听对象

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // other
  clickTimer: any; // 300毫秒内能触发两次click 否则视为dbclick
  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  /********************************************************************/
  /*                               table数据                           */
  /********************************************************************/

  public get data(): any {
    return this._dataSource.data;
  }
  public set data(data: any) {
    if (!Array.isArray(data)) {
      return;
    }
    this._dataSource.data = data;
  }


  public get header(): ComplexTableHeaderMetadata[][] {
    return this._header;
  }
  public set header(header: ComplexTableHeaderMetadata[][]) {
    this._displayHeader = [];
    this._header = [];
    let _header = [];
    let _displayHeader = [];
    if (header !== undefined && header !== null && header.length > 0) {
      _displayHeader = this.getHeaderAndDisplay(header);
      _header = header;
    } else {
      // 用columns生成header
      const row = [];
      this.columns.forEach((i, index) => {
        const th = { label: i.label, sortable: true };
        row.push(th);
      });

      if (row.length > 0) {
        _header.push(row);
      }

      _displayHeader = this.getHeaderAndDisplay(_header);
    }
    if (this.isSelect && _displayHeader.length > 0 && _displayHeader[0][0] !== '_chekcbox') {
      _displayHeader[0].unshift('_checkbox');
    }

    this._displayHeader = _displayHeader;
    this._header = _header;
    // console.log(_header);
    // this.updateView();
  }


  getHeaderAndDisplay(header): any {
    if (header.length === 0) {
      return [];
    }
    const newTableArray = []; // 用r*n (n代表最格数,r代表行数)的方式生成二维数组记录占用情况 0代表空 1代表占用
    const n = getTdLength(header);

    for (const item of header) {
      const trLengthArray = [];
      for (let i = 0; i < n; i++) {
        trLengthArray.push(0);
      }
      newTableArray.push(trLengthArray);
    }

    function getTdLength(array): any {
      const row = array[0]; // 用第一列计算td数
      let tdlength = 0;
      for (const td of row) {
        tdlength += td.colspan || 1;
      }
      return tdlength;
    }

    function sum(array: number[]): number {
      let s = 0;
      for (const i of array) {
        s += i;
      }
      return s;
    }

    const trArray = [];
    header.forEach((tr, i) => {
      const tdArray = [];
      tr.forEach((td, j) => {
        // 补全未定义的rowspan colspan
        if (!td.colspan) {
          td['colspan'] = 1;
        }
        if (!td.rowspan) {
          td['rowspan'] = 1;
        }
        if (i === 0) {
          const rowsum = sum(newTableArray[0]);
          // 确认第一行的位置
          for (let r = 1; r < td.rowspan + 1; r++) {
            for (let c = 1; c < td.colspan + 1; c++) {
              newTableArray[i + r - 1][rowsum + c - 1] = 1;
            }
          }
          const def = 'H_R0:C' + rowsum;
          tdArray.push(def);
        } else {
          // 找第一个0的位置插入 插入直到找到1位置
          const beginIndex = newTableArray[i].indexOf(0); // 永远不会等于-1 且永远小于firstOccupyIndex
          const firstOccupyIndex = newTableArray[i].indexOf(1, beginIndex); // 以自身为起点 寻找1第一次出现的位置
          let colspan = 0; // 重新计算colspan

          if (firstOccupyIndex !== -1) {
            const tdMaxColspan = firstOccupyIndex - beginIndex + 1; // 0-1的宽度 td最大占用格数防止夏姬儿写合并导致计算出错
            colspan = tdMaxColspan;
          } else {
            colspan = td.colspan;
          }

          // console.log('colspan', colspan);
          for (let r = 1; r < td.rowspan + 1; r++) {
            for (let c = 1; c < colspan + 1; c++) {
              newTableArray[i + r - 1][beginIndex + c - 1] = 1;
            }
          }
          const def = 'H_R' + i + ':C' + beginIndex;
          tdArray.push(def);
        }
      });
      trArray.push(tdArray);
    });
    // console.log(trArray);
    return trArray;
  }



  _getEvalStatement(func): any {
    if (this._service.isFunction(func)) {
      return this._evalStatement(func);
    } else {
      return this._evalStatement('(rowdata) => {\nreturn ' + func + '\n}');
    }
  }

  public get columns(): ComplexTableColumnMetadata[] {
    return this._columns;
  }
  public set columns(_tableColumns: ComplexTableColumnMetadata[]) {
    this._displayColumns = [];
    this._columns = [];
    const _columns = [];
    const _displayColumns = [];
    // to do
    _tableColumns.forEach((c, index) => {
      const column: ComplexColumnMetadata = new ComplexColumnMetadata;
      column.type = c.type || 'value';
      column.label = c.label || null;
      _displayColumns.push('C_' + index);
      if (c.value) {
        column.value = this._getEvalStatement(c.value);
      }
      if (c.style) {
        column.style = this._getEvalStatement(c.style);
      }
      if (c.compare) {
        column.compare = this._getEvalStatement(c.compare);
      }
      if (c.onHover) {
        column.onHover = this._getEvalStatement(c.onHover);
      } else if (c.value) {
        column.onHover = column.value;
      }
      column.width = c.width + '%';
      column.minWidth = c.minWidth + 'px';
      column.align = this._transformAlign(c.align);
      column.hidden = !!c.hidden;


      column.buttons = c.buttons;

      _columns.push(column);
    });
    if (this.isSelect) {
      _displayColumns.unshift('_checkbox');
    }
    this._displayColumns = _displayColumns;
    this._columns = _columns;
    this.header = this._header;
  }

  public get footer(): ComplexTableFooterMetadata[] {
    return this._footer;
  }
  public set footer(footer: ComplexTableFooterMetadata[]) {
    // console.log(footer);
    this._displayFooter = [];
    this._footer = [];
    const _footer = [];
    const _displayFooter = [];
    footer.forEach((c, index) => {
      const footerOpt: FooterMetadata = new FooterMetadata;
      footerOpt.type = c.type || 'value';
      _displayFooter.push('F_' + index);
      if (c.value) {
        footerOpt.value = this._getEvalStatement(c.value);
      }
      if (c.style) {
        footerOpt.style = this._getEvalStatement(c.style);
      }

      if (c.onHover) {
        footerOpt.onHover = this._getEvalStatement(c.onHover);
      } else if (c.value) {
        footerOpt.onHover = footerOpt.value;
      }

      footerOpt.align = this._transformAlign(c.align);
      footerOpt.hidden = !!c.hidden;
      footerOpt.colspan = c.colspan || 1;
      footerOpt.buttons = c.buttons;
      _footer.push(footerOpt);
    });
    this._displayFooter = _displayFooter;
    this._footer = _footer;
    // console.log(this._displayFooter);
    // console.log(this._footer);

  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }
  toggleTr(): void {
    this.showTr = !this.showTr;
  }
  test(): void {
    this._displayHeader = [];
    this._header = [];
  }

  /********************************************************************/
  /*                               table功能                          */
  /********************************************************************/

  public get isMultiple(): boolean {
    return this._isMultiple;
  }
  public set isMultiple(_isMultiple: boolean) {
    this._isMultiple = !!_isMultiple;
    this._selection = new SelectionModel<Element>(this._isMultiple, []);
    this._selection.changed.subscribe(e => {
      this.onSelectedSubject.next({ added: e.added, removed: e.removed, selected: this._selection.selected });
    });
  }


  public get isSelect(): boolean {
    return this._isSelect;
  }
  public set isSelect(_isSelect: boolean) {
    this._isSelect = !!_isSelect;
    if (this._isSelect) {
      if (this._displayColumns[0] !== '_checkbox') {
        this._displayColumns.unshift('_checkbox');
      }
      if (this._displayHeader.length > 0 && this._displayHeader[0][0] !== '_checkbox') {
        this._displayHeader[0].unshift('_checkbox');
      }
    } else {
      if (this._displayColumns.length > 0 && this._displayColumns[0] === '_checkbox') {
        this._displayColumns.splice(0, 1);
      }
      if (this._displayHeader.length > 0 && this._displayHeader[0][0] === '_checkbox') {
        this._displayHeader[0].splice(0, 1);
      }
    }
  }

  public get isSort(): boolean {
    return this._isSort;
  }
  public set isSort(_isSort: boolean) {
    this._isSort = !!_isSort;
    // if (this.paginator && this._isSort) {
    //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // }
  }

  public set dragDrop(dragDrop: boolean) {
    this._dragDrop = !!dragDrop;
  }
  public get dragDrop(): boolean {
    return this._dragDrop;
  }
  public set filter(filter: string) {
    this._applyFilter(filter);
  }
  public get selected(): any {
    if (this.isMultiple) {
      return this._selection.selected;
    } else {
      return this._selection.selected[0];
    }
  }
  public set selected(selected) {
    if (this.isMultiple) {
      if (selected instanceof Array) {
        for (const i of selected) {
          this._selection.select(i);
        }
      } else {
        console.error('selected应为any[]');
      }
    } else {
      this._selection.select(selected);
    }
  }
  public set selectAll(isSelectAll: boolean) {
    if (this.isMultiple) {
      if (isSelectAll) {
        this._chooseAll();
      } else {
        this._selection.clear();
      }
    }
  }
  /********************************************************************/
  /*                                事件                              */
  /********************************************************************/
  public get onClick(): string { return this._getCallback('onClick').toString(); }
  public set onClick(onClick: string) { this._setEvent('click', onClick); }
  public get onDblClick(): string { return this._getCallback('onDblClick').toString(); }
  public set onDblClick(onDblClick: string) { this._setEvent('dblClick', onDblClick); }
  public get onSelected(): string { return this._getCallback('onSelected').toString(); }
  public set onSelected(onSelected: string) { this._setEvent('selected', onSelected); }

  public get onPagination(): string { return this._getCallback('onPagination').toString(); }
  public set onPagination(onPagination: string) {
    if (onPagination) {
      this._setEvent('pagination', onPagination);
      this.paginationSubscribe = merge(this.sort.sortChange, this.paginator.page).subscribe(
        data => {
          const paginationEvent = {
            pageNum: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: this.sort.active,
            direction: this.sort.direction
          };
          this.onPaginationSubject.next(paginationEvent);
        });
    } else {
      if (this.paginationSubscribe) {
      }
    }
  }


  /********************************************************************/
  /*                            info工具栏                           */
  /********************************************************************/
  public set isToolbar(isToolbar: boolean) {
    this._isToolbar = !!isToolbar;
    if (this._isToolbar) {
      this.bottomHeight = 54;
    } else {
      this.bottomHeight = 12;
    }
  }
  public get isToolbar(): boolean {
    return this._isToolbar;
  }

  public set isMsg(isMsg: boolean) {
    this._isMsg = !!isMsg;
  }
  public get isMsg(): boolean {
    return this._isMsg;
  }

  public get isFilter(): boolean {
    return this._isFilter;
  }
  public set isFilter(_isFilter: boolean) {
    this._isFilter = !!_isFilter;
    // to do
    if (!this._isFilter) {
      this._applyFilter('');
    }
  }

  public get isPaginator(): boolean {
    return this._isPaginator;
  }
  public set isPaginator(_isPaginator: boolean) {
    this._isPaginator = !!_isPaginator;
    if (this._isPaginator) {
      this._dataSource.paginator = this.paginator;
    } else {
      this._dataSource.paginator = null;
      this._applyFilter('');
    }
  }

  public set pageIndex(pageIndex: number) {
    if (this.isPaginator) {
      this.paginator.pageIndex = pageIndex;
    }
  }
  public get pageIndex(): number {
    if (this.isPaginator) {
      return this.paginator.pageIndex;
    } else {
      return 0;
    }
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata: ComplexTableDatasetMetadata = this._metadata;
    // console.log(metadata);
    this.header = metadata.header || [];
    this.columns = metadata.columns || [];
    this.footer = metadata.footer || [];

    this.isSelect = metadata.isSelect;
    this.isMultiple = metadata.isMultiple;
    this.isSort = metadata.isSort;
    this.dragDrop = typeof metadata.dragDrop !== 'undefined' ? metadata.dragDrop : false;

    this.isToolbar = typeof metadata.isToolbar !== 'undefined' ? metadata.isToolbar : true;
    this.isMsg = typeof metadata.isMsg !== 'undefined' ? metadata.isMsg : true;
    this.isFilter = metadata.isFilter;
    this.isPaginator = metadata.isPaginator;


    this.registerEvent();
    this.onClick = metadata.onClick;
    this.onDblClick = metadata.onDblClick;
    this.onSelected = metadata.onSelected;
    this.onPagination = metadata.onPagination;
    this.canSelectText = metadata.canSelectText || false;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                               私有                                              */
  /***********************************************************************************/

  // 列标识规则
  _getHeadDef(row, col): any {
    if (this.isSelect && row === 0) {
      return this._displayHeader[0][col + 1];
    } else {
      return this._displayHeader[row][col];
    }
  }
  _getColumnDef(index): any {
    return 'C_' + index;
  }
  _getFooterDef(index): any {
    return 'F_' + index;
  }


  // 行内获取内容方法
  _getTitle(rowdata: any, column: ComplexColumnMetadata): string {
    if (column.onHover) {
      return column.onHover(rowdata);
    }
    return '';
  }
  _getValue(rowdata: any, column): string {
    if (column.value) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      return column.value(rowdata, index, total);
    }
    return '';
  }
  _getStyle(rowdata: any, column: ComplexColumnMetadata): object {
    if (column.style) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      return column.style(rowdata, index, total);
    }
    return {};
  }
  _getClass(rowdata: any, column: ComplexColumnMetadata): string {
    if (column.value) {
      return column.value(rowdata);
    }
    return '';
  }

  _getImage(rowdata: any, column: ComplexColumnMetadata): string {
    if (column.value) {
      const url = column.value(rowdata);
      return `<img style="height:42px;margin-top:15px;" src="${url}">`;
    }
    return ``;
  }
  _getButtonTip(rowdata: any, button): string {
    if (button.tip) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      const func = this._getEvalStatement(button.tip);
      return func(rowdata, index, total);
    }
    return '';
  }
  getCompare(rowdata: any, column: ComplexColumnMetadata): any {
    if (column.compare) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      return column.compare(rowdata, index, total);
    }
    if (column.value) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      return column.value(rowdata, index, total);
    }
    return '';
  }
  _transformAlign(align: string): string {
    if (align === 'left') {
      return 'flex-start';
    } else if (align === 'right') {
      return 'flex-end';
    }
    return 'center';
  }






  // 过滤
  _applyFilter(filterValue: string): void {
    if (this._dataSource.data && this._dataSource.data.length > 0 && this._dataSource.paginator) {
      this._dataSource.paginator.firstPage();
    }
    this._filterValue = filterValue;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this._dataSource.filter = filterValue;
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }


  // 方法

  registerEvent(): void {
    const clickEvent = new ContainerEvent('click', this.onClickSubject, '(row)');
    const dblClickEvent = new ContainerEvent('dblClick', this.onDblClickSubject, '(row)');
    const paginationEvent = new ContainerEvent('pagination', this.onPaginationSubject, '(pageSize,pageNumber,sort,direction)');
    const selectedEvent = new ContainerEvent('selected', this.onSelectedSubject, '(row)');
    const sortEvent = new ContainerEvent('sort', this.onSortSubject, '(sort)');
    this._setCallbackEvent(clickEvent);
    this._setCallbackEvent(dblClickEvent);
    this._setCallbackEvent(paginationEvent);
    this._setCallbackEvent(selectedEvent);
    this._setCallbackEvent(sortEvent);
    this._setDoEventFunction(clickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(dblClickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(sortEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(paginationEvent, (func: Function, e: any) => {
      // TODO  this.pageSize  this.pageNum  this.sort   this.direction
      func(e.pageSize, e.pageNum, e.sort, e.direction);
    });

    this._setDoEventFunction(selectedEvent, (func: Function, e: any) => {
      func(e);
    });

  }
  // 排序
  sortData(sort: Sort): any {
    const active = sort.active;
    // 根据def规则 H_Rxx:Cxx规则 分解字符串找到点击坐标
    const coordinateStr = active.replace('H_R', '').replace('C', '');
    const coordinateArray = coordinateStr.split(':');
    // console.log(coordinateArray);
    const coordinateX = parseInt(coordinateArray[1], 10);
    const column = this._columns[coordinateX];
    const data = this.data.slice();
    this.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(this._getValue(a, column), this._getValue(b, column), isAsc);
    });

  }
  compare(a, b, isAsc): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  buttonClick(row: any, column: ComplexTableColumnMetadata, event: any, onClick?: string): void {
    event.stopPropagation();
    if (onClick) {
      const onClickFn = this._compileCallbackFunction(onClick);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(row, column);
      }
    }
  }

  buttonFunc(row: any, column: ComplexTableColumnMetadata, func?: string): any {
    if (func) {
      const _func = this._compileCallbackFunction(func);
      return _func(row, column);
    }
    return false;
  }


  _isAllSelected(): boolean {
    const numSelected = this._filterValue.length > 0 ? this._filterSelected.length : this._selection.selected.length;
    const numRows = this._filterValue.length > 0 ? this._dataSource.filteredData.length : this._dataSource.data.length;
    return numSelected === numRows && numSelected !== 0;
  }

  _indeterminate(): boolean {
    if (this._filterValue.length > 0) {
      return this._filterSelected.length > 0 && !this._isAllSelected();
    } else {
      return this._selection.hasValue() && !this._isAllSelected();
    }
  }

  _masterToggle(): void {
    if (this._isAllSelected()) {
      this._clearExisting();
    } else {
      this._chooseAll();
    }
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }

  _clearExisting(): void {
    if (this._filterValue.length > 0) {
      for (const i of this._dataSource.filteredData) {
        if (this._selection.selected.indexOf(i) !== -1) {
          this._selection.toggle(i);
        }
      }
    } else {
      this._selection.clear();
    }
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }
  _chooseAll(): void {
    if (this._filterValue.length > 0) {
      this._selection.select(...this._dataSource.filteredData);
    } else {
      this._selection.select(...this._dataSource.data);
    }
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }
  _selectInvert(): void {
    if (this._filterValue.length > 0) {
      for (const i of this._dataSource.filteredData) {
        this._selection.toggle(i);
      }
    } else {
      for (const i of this._dataSource.data) {
        this._selection.toggle(i);
      }
    }
  }
  _click(row, event?): void {
    if (event) {
      event.stopPropagation();
    }
    if (this._isSelect) {
      this._selection.toggle(row);
      if (this._filterValue.length > 0) {
        this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
      }
    }
    this.onClickSubject.next(row);
  }

  _toggle(row, event?): void {
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => {
      if (event) {
        event.stopPropagation();
      }
      if (this.isMultiple && this._selection.selected.length === 1 && this._selection.selected[0] !== row) {
        this._selection.clear();
      }
      this._click(row);
    });
  }

  _dblclick(row, $event): void {
    clearTimeout(this.clickTimer);
    $event.stopPropagation();
    this.onDblClickSubject.next(row);
  }

  /*******拖拽********/

  objClone(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }
  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const selectedAsIndex = [];
    for (const i of this._selection.selected) {
      selectedAsIndex.push(this._dataSource.data.indexOf(i));
    }
    this._selection.clear();
    const parent = this.objClone(this._dataSource.data);
    const newSelected = [];
    for (const index of selectedAsIndex) {
      newSelected.push(parent[index]);
    }
    const befoerDropItem = parent[event.previousIndex];
    parent.splice(event.previousIndex, 1);
    parent.splice(event.currentIndex, 0, befoerDropItem);
    this._dataSource.data = parent;
    for (const i of newSelected) {
      this._selection.select(i);
    }
  }

  updateView(): void {
    // console.log(this.table);
    // console.log(this.matTable);
    this.table.renderRows();
    this.matTable.renderRows();

  }
}

