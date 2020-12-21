import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

export class ColumnMetadata {
  type: string;   //  image|icon|value|button|radio|checkbox|select 这应该是buttons
  name: string;  // 每一列的值对应的字段
  label?: string;  // 列名
  value?: Function; // 值
  onHover?: Function;  // 是否用回调函数 hover上显示的值
  style?: Function;
  width?: string;  // 1到99
  minWidth?: string; // 1到99
  align?: string;  // (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  sticky?: boolean; // 是否锁列
  buttons?: any[];
}

export interface SetSelectedParam {
  field: string; // 字段名
  value: any; // 值
}

@Component({
  selector: 'app-table-select',
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: ElementRef;
  @Output() eventTrigger = new EventEmitter<any>();
  public _dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public canSelectText: boolean;
  public displayedColumns: string[] = [];
  public bottomHeight: number; // 底部高度
  public _height = null;
  public _filterValue = '';
  public _filterSelected = [];
  public _filterLength = 0;
  public _isMaxHeight: boolean; // 是否撑满屏幕
  public _pending = false; // 是否处于初始化状态
  public _isMultiple: boolean; // 是否多选
  public _length: number;
  public _dragDrop: boolean; // 是否拖拽
  public clickTimer: any; // 300毫秒内能触发两次click 否则视为dbclick
  public canMove: boolean; // 是否可移动
  private _openIntelligent: boolean; // 智能模式

  // 列表
  public _metadata: any = {}; // table结构
  public _displayedColumns = [];
  public _columnsToDisplay = [];
  public _tableColumns: any[];
  public _columns: any[];
  public _isSort: boolean; // 是否排序
  public _isSelect: boolean; // 是否可以选中

  // 数据
  protected _data: any; // 可视化数据
  public _selection: any; // 选中的数据

  // 工具栏
  public _isToolbar: boolean;
  public _isMsg: boolean;
  public _isFilter: boolean;
  public _isPaginator: boolean;

  constructor() {
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  @Input() set metadata(metadata: any) {
    // console.log('set metadata', metadata);
    this._metadata = this.getCopy(metadata);
    this.columns = this._metadata.columns || [];
    this.isSelect = this._metadata.isSelect;
    this.isMaxHeight = this._metadata.isMaxHeight;
    // this.isInfinite = this._metadata.isInfinite;
    this.isSort = this._metadata.isSort;
    this.isMultiple = this._metadata.isMultiple;
    this.isToolbar = typeof this._metadata.isToolbar !== 'undefined' ? this._metadata.isToolbar : true;
    this.isMsg = typeof this._metadata.isMsg !== 'undefined' ? this._metadata.isMsg : true;
    this.isFilter = this._metadata.isFilter;
    this.isPaginator = this._metadata.isPaginator;
    this.dragDrop = typeof this._metadata.dragDrop !== 'undefined' ? this._metadata.dragDrop : false;
    this.canSelectText = this._metadata.canSelectText || false;
    this._openIntelligent = this._metadata.openIntelligent || false;
  }

  @Input() public set data({ data = [], defaultValue = null }) {
    if (!Array.isArray(data)) {
      return;
    }
    this._data = data;
    if (this._selection) {
      this._selection.clear();
    }
    if (this._isPaginator && data && data.length !== this._length) {
      if (this._dataSource['paginator']) {
        this._dataSource['paginator']['pageIndex'] = 0;
      }
      this._length = data.length;
    }
    setTimeout(() => {
      this._pending = false;
      this._dataSource.data = this._data;
      if (defaultValue) {
        this.setDefaultValue(defaultValue);
      }
    }, 300);
  }

  public get dataSource(): any {
    return this._dataSource;
  }

  public get columns(): any[] {
    return this._tableColumns;
  }
  public set columns(_tableColumns: any[]) {
    this._tableColumns = _tableColumns;
    this._columns = [];
    // to do
    const displayedColumns = [];
    this._tableColumns.forEach(c => {
      const column: ColumnMetadata = new ColumnMetadata;
      column.type = c.type || 'value';
      column.name = c.name;
      column.label = c.label;
      displayedColumns.push(c.name);
      if (c.value) { // 如果存在且不是function，自动增加return
        if (this.isFunction(c.value)) {
          column.value = this._evalStatement(c.value);
        } else {
          column.value = this._evalStatement('(rowdata) => {\nreturn ' + c.value + '\n}');
        }
      }

      if (c.style) { // 如果存在且不是function，自动增加return
        if (this.isFunction(c.style)) {
          column.style = this._evalStatement(c.style);
        } else {
          column.style = this._evalStatement('(rowdata) => {\nreturn ' + c.style + '\n}');
        }
      }

      if (c.onHover) { // 如果存在且不是function，自动增加return
        if (this.isFunction(c.onHover)) {
          column.onHover = this._evalStatement(c.onHover);
        } else {
          column.onHover = this._evalStatement('(rowdata) => {\nreturn ' + c.onHover + '\n}');
        }
      } else if (c.value) {
        column.onHover = column.value;
      }

      // column.transform = column.transform || null;
      column.width = c.width + '%';
      column.minWidth = c.minWidth + 'px';
      column.align = this._transformAlign(c.align);
      column.hidden = !!c.hidden;
      column.sticky = !!c.sticky;
      column.buttons = c.buttons;
      this._columns.push(column);
    });

    this._displayedColumns = displayedColumns;
    this.columnsToDisplay = displayedColumns;
  }

  public get selectedRow(): any {
    return this._selection.selected;
  }

  public set columnsToDisplay(columnsToDisplay: any[]) {
    this._columnsToDisplay = columnsToDisplay;
  }
  public get columnsToDisplay(): any[] {
    return this._columnsToDisplay;
  }

  public set isMaxHeight(isMaxHeight: boolean) {
    this._isMaxHeight = !!isMaxHeight;
  }

  public get isSelect(): boolean {
    return this._isSelect;
  }
  public set isSelect(_isSelect: boolean) {
    this._isSelect = !!_isSelect;
    this._isSelect ? this._displayedColumns = ['_checkbox'] : this._displayedColumns = [];
    if (this._columns && this._columns.length) {
      for (let i = 0; i < this._columns.length; i++) {
        if (!this.columns[i].hidden) {
          this._displayedColumns.push(this.columns[i].name);
        }
      }
    }
    this.columnsToDisplay = this._displayedColumns;
  }

  public get isSort(): boolean {
    return this._isSort;
  }
  public set isSort(_isSort: boolean) {
    this._isSort = !!_isSort;
    this._isSort ? this._dataSource.sort = this.sort : this._dataSource.sort = null;
    if (this.paginator && this._isSort) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  public set isToolbar(isToolbar: boolean) {
    this._isToolbar = !!isToolbar;
    if (this._isToolbar) {
      this.bottomHeight = 50;
    } else {
      this.bottomHeight = 10;
    }
  }

  public get isToolbar(): boolean {
    return this._isToolbar;
  }

  public get isMultiple(): boolean {
    return this._isMultiple;
  }

  public set isMultiple(_isMultiple: boolean) {
    this._isMultiple = !!_isMultiple;
    this._selection = new SelectionModel<Element>(this._isMultiple, []);
    this._selection.changed.subscribe(e => {
      this.eventTrigger.next({
        type: 'selectionChange',
        data: { added: e.added, removed: e.removed, selected: this._selection.selected }
      });
    });
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

  public set dragDrop(dragDrop: boolean) {
    this._dragDrop = !!dragDrop;
  }
  public get dragDrop(): boolean {
    return this._dragDrop;
  }

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseup(e): void {
    this.canMove = false;
  }
  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

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

  getLayoutChange(): void {
    let height = 0;
    if (!this.isMaxHeight) {
      setTimeout(() => {
        height = this.table.nativeElement.clientHeight - this.bottomHeight;
      }, 300);
      setTimeout(() => {
        this._height = height + 'px';
      }, 400);
    }
  }

  setDefaultValue(param: SetSelectedParam): any {
    // console.log('table setDefaultValue', param, this._data);
    if (this._isMultiple) {
      if (param.value instanceof Array) {
        const selectedRows = this._data.filter((item) => {
          return param.value.indexOf(item[param.field]) > -1;
        });
        this._selection.select(...selectedRows);
      } else {
        console.warn('table为多选,value请传数组格式');
      }
    } else {
      if (param.value instanceof Array && param.value.length > 1) {
        console.warn('table为单选,请不要传多个选中值');
        return false;
      }
      const selectedRow = this._data.find((item) => {
        return param.value === item[param.field];
      });
      if (selectedRow) {
        this._selection.select(selectedRow);
      }
    }
  }

  _getTitle(rowdata: any, column: any): string {
    if (column.onHover) {
      return column.onHover(rowdata);
    }
    return '';
  }

  _getValue(rowdata: any, column: any): string {
    if (column.value) {
      return column.value(rowdata);
    }
    return '';
  }

  _getImage(rowdata: any, column: ColumnMetadata): string {
    if (column.value) {
      const url = column.value(rowdata);
      return `<img style="height:42px;margin-top:15px;" src="${url}">`;
    }
    return ``;
  }

  _indeterminate(): boolean {
    if (this._filterValue.length > 0) {
      return this._filterSelected.length > 0 && !this._isAllSelected();
    } else {
      return this._selection.hasValue() && !this._isAllSelected();
    }
  }

  _evalStatement(statement): any {
    if (statement) {

      try {
        // tslint:disable-next-line:no-eval
        const ret: any = eval(statement);
        // // console.log('eval ret=', typeof ret);
        return ret;
      } catch (e) {
        console.log(e);
        console.error(statement);
        // this._service.tipDialog('执行语句出错!');
      }

    }
  }

  _stickyColumn(column: any): boolean {
    return !!column.sticky;
  }

  _transformAlign(align: string): string {
    if (align === 'left') {
      return 'flex-start';
    } else if (align === 'right') {
      return 'flex-end';
    }
    return 'center';
  }

  _isAllSelected(): boolean {
    const numSelected = this._filterValue.length > 0 ? this._filterSelected.length : this._selection.selected.length;
    const numRows = this._filterValue.length > 0 ? this._dataSource.filteredData.length : this._dataSource.data.length;
    return numSelected === numRows && numSelected !== 0;
  }

  _chooseAll(): void {
    if (this._filterValue.length > 0) {
      this._selection.select(...this._dataSource.filteredData);
      // this._dataSource.filteredData.forEach(row => this._selection.select(row));
    } else {
      this._selection.select(...this._dataSource.data);
      // this._dataSource.data.forEach(row => this._selection.select(row));
    }
  }

  _masterToggle(): void {
    if (this._isAllSelected()) {
      if (this._filterValue.length > 0) {
        for (const i of this._dataSource.filteredData) {
          this._selection.toggle(i);
        }
      } else {
        this._selection.clear();
      }
    } else {
      if (this._filterValue.length > 0) {
        if (this._filterSelected.length === this._dataSource.filteredData.length) {
          this._selection.select(...this._filterSelected);
        } else {
          this._selection.select(...this._dataSource.filteredData);
        }
      } else {
        this._chooseAll();
      }
    }
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }

  _getStyle(rowdata: any, column: ColumnMetadata): object {
    if (column.style) {
      return column.style(rowdata);
    }
    return {};
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
    this.eventTrigger.next({ type: 'click', data: row });
  }

  _toggle(row, event?): void {
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => {
      if (event) {
        event.stopPropagation();
      }
      if (this.isMultiple && this._selection.selected.length === 1 && this._selection.selected[0] !== row && this._openIntelligent) {
        this._selection.clear();
      }
      this._click(row);
    }, 300);

  }

  _dblclick(row, $event): void {
    clearTimeout(this.clickTimer);
    $event.stopPropagation();
    this.eventTrigger.next({ type: 'dbclick', data: row });
  }

  _compileCallbackFunction(evalStr: string, argum?: string): any {
    if (evalStr == null) { return null; }
    let evalFunc: any;
    if (this.isFunction(evalStr)) {
      evalFunc = this._evalStatement('(\n' + evalStr + '\n)');
    } else {
      evalFunc = this._evalStatement(argum + '=>{\n' + evalStr + '\n}');
    }
    return evalFunc;
  }

  buttonClick(row: any, column: any, event: any, onClick?: string): void {
    event.stopPropagation();
    if (onClick) {
      const onClickFn = this._compileCallbackFunction(onClick);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(row, column);
      }
    }
  }

  buttonFunc(row: any, column: any, func?: string): any {
    if (func) {
      const _func = this._compileCallbackFunction(func);
      return _func(row, column);
    }
    return false;
  }

  getCopy(obj): object {
    return JSON.parse(JSON.stringify(obj));
  }

  isFunction(str: string): any {
    const pattern = /^\s*\([A-Za-z0-9, ]*\)\s*=>/;
    return pattern.test(str);
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
    const parent: any = this.getCopy(this._dataSource.data);
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
    // console.log('拖拽事件', this.dataSource.data);
  }

  paramsChg(index, value, name): void {
    // console.log('paramsChg', index);
    const data = this.dataSource.data;
    data[index][name] = value;
    if (!data[index]['value'] && data[index]['value'] == null || data[index]['value'] === '') {
      data[index]['value'] = value;
    }
    this.eventTrigger.next({ type: 'paramsChg', data });
  }

  canDrop(): boolean {
    return !this.dragDrop || !this.canMove || this._filterValue.length > 0;
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    this.canMove = false;
  }

  ngAfterViewInit(): void {
    this.getLayoutChange();
  }
}
