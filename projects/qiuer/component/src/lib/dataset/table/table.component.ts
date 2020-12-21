/***********************************************************************************/
/* author: 王里
/* update logs:
/* 2019/6/10 王里 创建
/* update 20190619 贾磊
/* checkbox为多选 点击为单选 以后可能会增加开关
/* update 20190625 谢祥 添加 styleFn 单元格样式函数
/* update 20190906 林清将 新增按钮动态修改名称和样式功能
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef, AfterViewInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { ContainerEvent, ContainerService, ContainerMetadata } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, from } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface TableDatasetMetadata extends DatasetMetadata {
  theadMode?: boolean; // 表头模式
  isPending?: boolean; // 是否支持动画
  isSelect?: boolean; // 是否支持选择
  isMultiple?: boolean; // 是否支持多选
  isSort?: boolean; // 是否支持排序
  dragDrop?: boolean; // 是否支持拖拽
  isInfinite?: boolean; // 是否支持无限高度
  isFooter?: boolean; // 是否支持底部
  isToolbar?: boolean; // 是否支持工具栏 hasToolbar
  isFilter?: boolean; // 是否过滤 hasFilter
  isMsg?: boolean; // 是否显示记录数 hasInfo
  isPaginator?: boolean; // 是否分页 hasPaginator
  hidePageSize?: boolean; // 是否隐藏分页数
  showFirstLastButtons?: boolean; // 是否显示第一页/最后一页 按钮
  canSelectText?: boolean; // 是否可以选中文字 默认值false (和托拽互斥,拖拽优先级大,如果想复制文字,请关闭拖拽)
  columns?: TableColumnMetadata[]; // 列数据
  height?: number;
  rowStyle?: string; // 行样式
  // event
  onClick?: string;
  onDblClick?: string;
  onSelected?: string;
  onPagination?: string;
  onRowHover?: string;

  radioClear?: boolean; // TODO 单选时否允许清空
  columnFilter?: boolean; // 列过滤 与总过滤不共存 优先级大于总过滤  TODO 改成 isFoooter

  openIntelligent?: boolean; // 是否开启智能模式
}

class TableColumnMetadata {
  type: string;   //  image|icon|value|button|radio|checkbox|select
  name: string;  // 每一列的值对应的字段
  label?: string;  // 列名

  value?: string; // 值
  onHover?: string;  // TODO 是否用回调函数 hover上显示的值
  onClick?: string;
  style?: string;
  filter?: string; // 列过滤的回调函数
  footerValue?: string; // 底部汇总的回调函数

  width?: string;  // TODO 1到99
  minWidth?: string; // TODO  数字 px
  align?: string;  // TODO (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  sticky?: boolean; // TODO 是否锁列
  buttons?: TableColumnButton[];
  checkboxes?: CheckboxColumnButton[];
  child?: ContainerMetadata;
}

interface TableColumnButton {
  name: string; // 按钮名
  tip: string;
  disabled: string;
  hidden: string;
  onClick: string; // 按钮方法
  type?: string; // button类型 raised || icon 默认raised
  style?: string; // 样式
  icon?: string; // 填写icon
}

interface CheckboxColumnButton {
  name: string; // 按钮名
  defaultValue: string;
  disabled: string;
  hidden: string;
  onClick: string; // 按钮方法
}

class ButtonMetadata {
  name: Function; // 按钮名
  tip: string;
  shape?: string; // 按钮形状 rectangle: 方形   circle： 大圆  mini-circle: 小圆  basic：基本按钮  stroked：轻触按钮  flat：扁平化按钮
  disabled: string;
  hidden: string;
  onClick: string; // 按钮方法
  style?: Function; // 样式
}

class CheckboxMetadata {
  name: Function; // 名称
  defaultValue: string; // 是否选中 返回true表示选中
  disabled: string;
  hidden: string;
  onChange: string; // 状态改变的方法
}

interface SetSelectedParam {
  field: string; // 字段名
  value: any; // 值
}

export class ColumnMetadata {
  type: string;   //  image|icon|value|button|radio|checkbox|select 这应该是buttons
  name: string;  // 每一列的值对应的字段
  label?: string;  // 列名
  value?: Function; // 值
  filter?: Function; // 列过滤回调函数
  footerValue?: Function; // 底部汇总的回调函数
  onHover?: Function;  // TODO 是否用回调函数 hover上显示的值
  onClick?: Function;
  style?: Function;
  width?: string;  // TODO 1到99
  minWidth?: string; // TODO 1到99
  align?: string;  // TODO (left right center ) 居左居中居右
  hidden?: boolean; // 是否隐藏
  sticky?: boolean; // TODO 是否锁列
  buttons?: ButtonMetadata[];
  checkboxes?: CheckboxMetadata[];
  child?: ContainerMetadata;
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                 */
/* set/get value
/* set/get data 设置table的data
/* set/get isSelect 是否支持排序
/* set/get isSort 是否排序
/* set/get isMultiple 是否支持多选
/* set/get isToolbar 是否支持工具栏
/* set/get isMsg 是否显示记录数
/* set/get isFilter 是否过滤
/* set/get isPaginator 是否分页
/* set/get columns 列
/* setDefaultValue 设置select的默认值;
/* clearSelect 清除选中
/***********************************************************************************/
@Component({
  selector: 'table-dataset',
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html'
})
export class TableDatasetComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  // public readonly msVersion = '2.3';
  protected _metadata: TableDatasetMetadata;
  public _dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public _selection: any;
  public _filterValue = '';
  public _length: number;
  public _filterSelected = [];
  public bottomHeight = 70;
  public _columnFilter = false;
  public _height: number;
  public _theadMode: boolean;
  public _css: string;
  private cssStr: string; // 用户的css数据
  public _rootClass = '_html_' + Date.now(); // 包裹层class

  // 列表
  public _displayedColumns = [];
  public _columnsToDisplay = [];
  public _columns: ColumnMetadata[];
  public _tableColumns: TableColumnMetadata[];

  public _isFooter: boolean;
  public _isPending: boolean;
  public _isInfinite: boolean;
  public _isSelect: boolean;
  public _isSort: boolean;
  public _isMultiple: boolean;
  public _isToolbar: boolean;
  public _isMsg: boolean;
  public _isFilter: boolean;
  public _isPaginator: boolean;
  public _hidePageSize: boolean;
  public _showFirstLastButtons: boolean;
  public _dragDrop: boolean;
  public canSelectText: boolean;
  public _rowStyle: Function;
  // event
  protected _clickEvent: ContainerEvent;
  protected _dblClickEvent: ContainerEvent;

  public scale = 1;

  public pageSizeOptions = [10, 20, 40];

  public _onRowHover: Function;

  // Subject
  onClickSubject: Subject<any> = new Subject<any>();
  onDblClickSubject: Subject<any> = new Subject<any>();
  onPaginationSubject: Subject<any> = new Subject<any>();
  onSelectedSubject: Subject<any> = new Subject<any>();

  onColumnFilterChangeSubject: Subject<any> = new Subject<any>();
  paginationSubscribe: any; // 分页监听对象

  // other
  _columnfilterValue = {}; // 记录各个column输入的的filter;
  radioGroupControl: FormControl;
  private _openIntelligent: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: ElementRef;
  clickTimer: any; // 300毫秒内能触发两次click 否则视为dbclick

  constructor(public _service: ContainerService,
    public _ds: DatasetService,
    public el: ElementRef,
    public renderer2: Renderer2,
    public changeRef: ChangeDetectorRef) {
    super(_service, _ds, el, renderer2);
  }

  cellClick(row, column, event): void {
    if (column['onClick']) {
      event.stopPropagation();
      const onClickFn = this._compileCallbackFunction(column['onClick']);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(row, column);
      }
    }
  }


  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public get theadMode() {
    return this._theadMode;
  }
  public set theadMode(theadMode: boolean) {
    if (theadMode) {
      // 生成假数据
      const theadData = {};
      this.columns.forEach(column => {
        theadData[column.name] = column.label;
      });
      this.data = [theadData];
      // 去除不必要的部分 选择, 底部工具, 无限高度
      this.isSelect = false;
      this.isToolbar = false;
      this.isInfinite = false;
    }
    this._theadMode = theadMode;
  }

  public get data(): any {
    return this._data;
  }
  public set data(data: any) {
    if (!Array.isArray(data) || this.theadMode) {
      return;
    }
    this._pendingLoading(); // 开启动画
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
    this._dataSource.data = this._data;

    if (this.pageSizeOptions.length === 3) {
      this.pageSizeOptions.push(this._dataSource.data.length);
    } else {
      this.pageSizeOptions.splice(3, 1, this._dataSource.data.length);
    }
    this.pageSizeOptions = [...this.pageSizeOptions, ...[]];
  }
  public get isSelect(): boolean {
    return this._isSelect;
  }
  public set isSelect(_isSelect: boolean) {
    if (this.theadMode) { return; }
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
    // this._selection = new SelectionModel<Element>(this._isMultiple, []);
    // this._selection.changed.subscribe(e => {
    //   const added = e.added.length > 0 ? e.added[0] : null;
    //   const removed = e.removed.length > 0 ? e.removed[0] : null;
    //   this.onSelectedSubject.next({ added, removed, selected: this._selection.selected });
    // });
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

  public get isMultiple(): boolean {
    return this._isMultiple;
  }
  public set isMultiple(_isMultiple: boolean) {
    this._isMultiple = !!_isMultiple;
    // to do
    this._selection = new SelectionModel<Element>(this._isMultiple, []);
    this._selection.changed.subscribe(e => {
      this.onSelectedSubject.next({ added: e.added, removed: e.removed, selected: this._selection.selected });
    });
  }

  public set css(css: string) {
    this.cssStr = css;
    css = css.replace(/[\r\n]/g, '').replace(/\/\*.*?\*\//g, '');
    css = css.replace(/↵/g, ' ');
    const _data_ = this.getLoopBody(css, '{', '}');
    const _cssArr = _data_.template.split('loop%>').filter(item => !!item.trim());
    for (let i = 0; i < _cssArr.length; i++) {
      if (_cssArr[i].indexOf('@media') === -1) {
        const _id = _cssArr[i].replace(/.*?\<%loop id_/, '');
        const _mediaObj = _data_.loops.filter(item => item.id === Number(_id))[0];
        const _prefix = _cssArr[i].indexOf('@keyframes') === -1 ? `.${this._rootClass}` : '';
        _cssArr[i] = `${_prefix} ${_cssArr[i]}`.replace(`<%loop id_${Number(_id)}`, _mediaObj.template);
      } else {
        const _id = _cssArr[i].replace(/@media.*?\<%loop id_/, '');
        const _mediaObj = _data_.loops.filter(item => item.id === Number(_id))[0];
        _mediaObj.template = this.getCss(_mediaObj.template.slice(1, -1));
        _cssArr[i] = _cssArr[i].replace(`<%loop id_${Number(_id)}`, `{${_mediaObj.template}}`);
      }
    }
    this._css = '<style>' + _cssArr.join('') + '</style>';
  }
  public get css(): string { return this.cssStr; }

  public set isToolbar(isToolbar: boolean) {
    if (this.theadMode) { return; }
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


  public set isPending(isPending: boolean) {
    this._isPending = !!isPending;
  }
  public get isPending(): boolean {
    return this._isPending;
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
  public get columns(): TableColumnMetadata[] {
    return this._tableColumns;
  }
  public set columns(_tableColumns: TableColumnMetadata[]) {
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
        if (this._service.isFunction(c.value)) {
          column.value = this._evalStatement(c.value);
        } else {
          column.value = this._evalStatement('(rowdata) => {\nreturn ' + c.value + '\n}');
        }
      }

      if (c.onClick) { // 如果存在且不是function，自动增加return
        if (this._service.isFunction(c.onClick)) {
          column.onClick = this._evalStatement(c.onClick);
        } else {
          column.onClick = this._evalStatement('(rowdata) => {\nreturn ' + c.onClick + '\n}');
        }
      }

      if (c.style) { // 如果存在且不是function，自动增加return
        if (this._service.isFunction(c.style)) {
          column.style = this._evalStatement(c.style);
        } else {
          column.style = this._evalStatement('(rowdata) => {\nreturn ' + c.style + '\n}');
        }
      }

      if (c.type === 'container') {

        c.child['_index'] = -1;
        column.child = c.child;
      }

      if (c.type === 'checkbox') { // button特殊处理
        const checkboxes: CheckboxMetadata[] = c.checkboxes.map(element => {
          const checkbox: CheckboxMetadata = new CheckboxMetadata;
          if (this._service.isFunction(element.name)) {
            element.name = this._evalStatement(element.name);
          } else {
            element.name = this._evalStatement('(rowdata) => {\nreturn \'' + element.name + '\'\n}');
          }
          Object.assign(checkbox, element);
          return checkbox;
        });
        column.checkboxes = checkboxes;
      }

      if (c.type === 'button') { // button特殊处理
        const buttons: ButtonMetadata[] = c.buttons.map(element => {
          const button: ButtonMetadata = new ButtonMetadata;
          if (this._service.isFunction(element.style)) {
            element.style = this._evalStatement(element.style);
          } else {
            element.style = this._evalStatement('(rowdata) => {\nreturn ' + element.style + '\n}');
          }
          if (this._service.isFunction(element.name)) {
            element.name = this._evalStatement(element.name);
          } else {
            element.name = this._evalStatement('(rowdata) => {\nreturn \'' + element.name + '\'\n}');
          }
          Object.assign(button, element);
          switch (button.shape) {
            case 'rectangle': button.shape = 'mat-raised-button'; break;
            case 'circle': button.shape = 'mat-fab'; break;
            case 'mini-circle': button.shape = 'mat-mini-fab'; break;
            case 'basic': button.shape = 'mat-button'; break;
            case 'stroked': button.shape = 'mat-stroked-button'; break;
            case 'flat': button.shape = 'mat-flat-button'; break;
          }
          return button;
        });
        column.buttons = buttons;
      }

      if (c.filter) { // 如果存在且不是function，自动增加return
        if (this._service.isFunction(c.filter)) {
          column.filter = this._evalStatement(c.filter);
        } else {
          column.filter = this._evalStatement('(rowdata) => {\nreturn ' + c.filter + '\n}');
        }
      }

      if (c.footerValue) { // 如果存在且不是function，自动增加return
        if (this._service.isFunction(c.footerValue)) {
          column.footerValue = this._evalStatement(c.footerValue);
        } else {
          column.footerValue = this._evalStatement('(name,data) => {\nreturn ' + c.footerValue + '\n}');
        }
      }

      if (c.onHover) { // 如果存在且不是function，自动增加return
        if (this._service.isFunction(c.onHover)) {
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
      this._columns.push(column);
    });

    this._displayedColumns = displayedColumns;
    this.columnsToDisplay = displayedColumns;
  }

  public set dragDrop(dragDrop: boolean) {
    this._dragDrop = !!dragDrop;
  }
  public get dragDrop(): boolean {
    return this._dragDrop;
  }

  public set isInfinite(isInfinite: boolean) {
    if (this.theadMode) { return; }
    this._isInfinite = !!isInfinite;
    if (this._isInfinite) {
      this._height = null;
    }
  }
  public get isInfinite(): boolean {
    return this._isInfinite;
  }

  public get displayedColumns(): any[] {
    return [].concat(this._displayedColumns);
  }

  public set columnsToDisplay(columnsToDisplay: any[]) {
    this._columnsToDisplay = columnsToDisplay;
    // 维护_columnfilterValue
    for (const i of this._columnsToDisplay) {
      this._columnfilterValue[i] = null;
    }
  }

  public get columnsToDisplay(): any[] {
    return this._columnsToDisplay;
  }

  public set isFooter(isFooter: boolean) {
    this._isFooter = !!isFooter;
  }

  public set height(height: number) {
    if (!this.isInfinite) {
      this._height = height - this.bottomHeight;
    }
  }

  public get height(): number {
    return this._height;
  }

  public get onClick(): string { return this._getCallback('onClick').toString(); }
  public set onClick(onClick: string) { this._setEvent('click', onClick); }
  public get onDblClick(): string { return this._getCallback('onDblClick').toString(); }
  public set onDblClick(onDblClick: string) { this._setEvent('dblClick', onDblClick); }
  public get onSelected(): string { return this._getCallback('onSelected').toString(); }
  public set onSelected(onSelected: string) { this._setEvent('selected', onSelected); }

  public get onRowHover(): string { return this._onRowHover.toString(); }
  public set onRowHover(onRowHover: string) {
    if (this._service.isFunction(onRowHover)) {
      this._onRowHover = this._evalStatement(onRowHover);
    }
  }

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

  // public set height(height: string) {
  //   if (height) {
  //     // height.endsWith('px') || height.endsWith('%') ? this._height = height : this._height = height + 'px';
  //   }
  // }
  // public get height() {
  //   if (this.isMaxHeight) {
  //     return null;
  //   } else {
  //     return this._height;
  //   }
  // }

  setDefaultValue(param: SetSelectedParam): any {
    if (this._isMultiple) {
      if (param.value instanceof Array) {
        const selectedRows = this._dataSource.data.filter((item) => {
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
      const selectedRow = this._dataSource.data.find((item) => {
        return param.value === item[param.field];
      });
      if (selectedRow) {
        this._selection.select(selectedRow);
      }
    }
  }

  public get selectedRow(): any {
    return this._selection.selected;
  }
  public get hasSelected(): boolean {
    return (this._selection.selected.length > 0);
  }
  public clearSelect(): void {
    this._selection.clear();
  }

  public selected(array: any[]): void {
    for (const i of array) {
      this._selection.select(i);
    }
  }
  public set showColumnFilter(columnFilter: boolean) {
    this._columnFilter = !!columnFilter;
    if (columnFilter) {
      this.isFilter = false; // 关闭总过滤
      this.overWriteDataSourceFilter();
      this.onColumnFilterChangeSubject.pipe(
        debounceTime(300)
      ).subscribe(res => {
        this._applyFilter(res);
      });
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    // config
    this.columns = this._metadata.columns;
    this.isPending = this._metadata.isPending;
    this.isSelect = this._metadata.isSelect;
    this.isInfinite = this._metadata.isInfinite;
    this.isSort = this._metadata.isSort;
    this.isMultiple = this._metadata.isMultiple;
    this.isToolbar = typeof this._metadata.isToolbar !== 'undefined' ? this._metadata.isToolbar : true;
    this.isMsg = typeof this._metadata.isMsg !== 'undefined' ? this._metadata.isMsg : true;
    this.isFilter = this._metadata.isFilter;
    this.showColumnFilter = this._metadata.columnFilter || false;
    this.isPaginator = this._metadata.isPaginator;
    this.isFooter = this._metadata.isFooter;
    this.dragDrop = typeof this._metadata.dragDrop !== 'undefined' ? this._metadata.dragDrop : false;
    this.registerEvent();
    this.onClick = this._metadata.onClick;
    this.onDblClick = this._metadata.onDblClick;
    this.onSelected = this._metadata.onSelected;
    this.onRowHover = this._metadata.onRowHover;
    this.onPagination = this._metadata.onPagination;
    this._hidePageSize = this._metadata.hidePageSize || false;
    this._showFirstLastButtons = this._metadata.showFirstLastButtons || false;
    this.canSelectText = this._metadata.canSelectText || false;
    this.theadMode = !!this._metadata.theadMode;
    this._openIntelligent = this._metadata.openIntelligent || false;
    this.setLayoutChange();
    if (this._metadata.rowStyle) {
      if (this._service.isFunction(this._metadata.rowStyle)) {
        this._rowStyle = this._evalStatement(this._metadata.rowStyle);
      } else {
        this._rowStyle = this._evalStatement('(rowdata) => {\nreturn ' + this._metadata.rowStyle + '\n}');
      }
    }
    document.addEventListener('keydown', (e) => {

      const keycode = e.keyCode || e.which;
      if (this.isPaginator && keycode === 33) {
        e.preventDefault();
        this._dataSource.paginator.previousPage();
      }
      if (this.isPaginator && keycode === 34) {
        e.preventDefault();
        this._dataSource.paginator.nextPage();
      }
    });
  }


  ngAfterContentInit(): void {
    this.getLayoutChange();
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
    document.removeEventListener('keydown', (e) => {
      const keycode = e.keyCode || e.which;
      if (this.isPaginator && keycode === 33) {
        e.preventDefault();
        this._dataSource.paginator.previousPage();
      }
      if (this.isPaginator && keycode === 34) {
        e.preventDefault();
        this._dataSource.paginator.nextPage();
      }
    });
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                               私有                                              */
  /***********************************************************************************/

  _pendingLoading(): void {
    if (this.isPending) {
      this._pending = true;
      setTimeout(() => { this._pending = false; }, 300);
    }
  }

  setLayoutChange(): void {
    if (this._rootPath && this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.getLayoutChange(); });
    }
  }

  getLayoutChange(): void {
    setTimeout(() => {
      let height = this.el.nativeElement.querySelector('.table_content').offsetHeight;
      let newHeight = height - this.bottomHeight;
      if (!this.height || this.height !== newHeight) {
        if (height > 100) {
          this.height = height;
        }
      }
    }, 100);
    // if (!this.isInfinite) {
    //   if (this.height) {
    //     this._height = (this.height  - this.bottomHeight)+'px';
    //   } else {
    //     let divEle = this.el.nativeElement.querySelector('div');
    //     const maxHeight = divEle.getBoundingClientRect().height - this.bottomHeight;
    //     this._height = maxHeight + 'px';
    //   }
    //   console.log(this._height );
    //   this.changeRef.detectChanges();
    // }


    // let height = 0;
    // if (this._initHeight) {
    //   this._height = this._initHeight;
    // }
    // if (!this.isInfinite) {
    //   let divEle = this.el.nativeElement.querySelector('div');
    //   console.dir(divEle.clientHeight);
    //   this._height = (divEle.clientHeight-this.bottomHeight) + 'px';
    //   if (!this._initHeight) {
    //     this._initHeight = this._height;
    //   }
    // }
  }

  registerEvent(): void {
    const clickEvent = new ContainerEvent('click', this.onClickSubject, '(rowdata)');
    const dblClickEvent = new ContainerEvent('dblClick', this.onDblClickSubject, '(rowdata)');
    const paginationEvent = new ContainerEvent('pagination', this.onPaginationSubject, '(pageSize,pageNumber,sort,direction)');
    const selectedEvent = new ContainerEvent('selected', this.onSelectedSubject, '(rowdata)');
    this._setCallbackEvent(clickEvent);
    this._setCallbackEvent(dblClickEvent);
    this._setCallbackEvent(paginationEvent);
    this._setCallbackEvent(selectedEvent);

    this._setDoEventFunction(clickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(dblClickEvent, (func: Function, e: any) => {
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

  checkboxClick(row: any, column: TableColumnMetadata, event: any, onClick?: string): void {
    if (onClick) {
      const onClickFn = this._compileCallbackFunction(onClick);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(event.checked, row, column);
      }
    }
  }

  buttonClick(row: any, column: TableColumnMetadata, event: any, onClick?: string): void {
    event.stopPropagation();
    if (onClick) {
      const onClickFn = this._compileCallbackFunction(onClick);
      if (onClickFn && onClickFn instanceof Function) {
        onClickFn(row, column);
      }
    }
  }

  columnFunc(row: any, column: TableColumnMetadata, func?: string): any {
    if (func) {
      const _func = this._compileCallbackFunction(func);
      return _func(row, column);
    }
    return false;
  }

  setColumnFilterValue(column, ev): void {
    this._columnfilterValue[column.name] = ev.target.value;
    this.onColumnFilterChangeSubject.next(ev.target.value);
  }

  _applyFilter(filterValue: string): void {
    if (this._dataSource.data && this._dataSource.data.length > 0 && this._dataSource.paginator) {
      this._dataSource.paginator.firstPage();
    }

    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    // 因 this._dataSource.filter === '' 时,不会触发dataSource的filterPredicate方法 所以当列过滤开启时 只有所有过滤控件都为空时 this._dataSource.filter才为空
    if (this._columnFilter && (filterValue === null || filterValue === '')) {
      for (const i in this._columnfilterValue) {
        if (this._columnfilterValue[i] !== '' && this._columnfilterValue[i] !== null) { filterValue = this._columnfilterValue[i]; }
      }
      this._filterValue = '';
    }


    this._filterValue = filterValue;
    this._dataSource.filter = filterValue.trim().toLowerCase();
    this._filterSelected = this._selection.selected.filter(item => this._dataSource.filteredData.indexOf(item) > -1);
  }

  private overWriteDataSourceFilter(): any {
    if (!this._columnsToDisplay || this._columnsToDisplay.length < 1) {
      return;
    }
    this._dataSource.filterPredicate = (data, filter: string) => {
      for (const i in this._columnfilterValue) {
        if (this.getColumn(i) !== null) {
          const column = this.getColumn(i);
          if (!this._getFilter(data, column, this._columnfilterValue[i])) {
            return false;
          }
        }
      }
      return true;
    };
  }
  getColumn(name: string): any {
    for (const i of this._columns) {
      if (i.name === name) {
        return i;
      }
    }
    return null;
  }
  _getFilter(rowdata: any, column: ColumnMetadata, filter: string): boolean {
    if (column.filter) {
      const index = this._dataSource.data.indexOf(rowdata);
      const total = this._dataSource.data.length;
      return column.filter(rowdata, filter, index, total);
    }
    return true;
  }
  /** Whether the number of selected elements matches the total number of rows. */
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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

  _chooseAll(): void {
    if (this._filterValue.length > 0) {
      this._selection.select(...this._dataSource.filteredData);
      // this._dataSource.filteredData.forEach(row => this._selection.select(row));
    } else {
      this._selection.select(...this._dataSource.data);
      // this._dataSource.data.forEach(row => this._selection.select(row));
    }
  }

  _transformAlign(align: string): string {
    if (align === 'left') {
      return 'flex-start';
    } else if (align === 'right') {
      return 'flex-end';
    }
    return 'center';
  }

  _getTitle(rowdata: any, column: ColumnMetadata): string {
    if (column.onHover) {
      return column.onHover(rowdata);
    }
    return '';
  }

  _getRowTitle(row: any) {
    if (this._onRowHover) {
      return this._onRowHover(row);
    }
    return '';
  }

  _getValue(rowdata: any, column: ColumnMetadata): string {
    if (column.value) {
      let value;
      value = column.value(rowdata);
      if (value !== null && value !== undefined && value instanceof String) {
        value = value.replace(/\s/g, '&nbsp;');
      }
      return value;
    }
    return '';

  }

  _getFooterValue(column: ColumnMetadata): string {
    if (column.footerValue) {
      return column.footerValue(column.name, this.data);
    }
    return '';
  }


  _getClass(rowdata: any, column: ColumnMetadata): string {
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

  _getStyle(rowdata: any, column: ColumnMetadata): object {
    if (column.style) {
      return column.style(rowdata);
    }
    return {};
  }
  _getRowStyle(rowdata: any): object {
    if (this._rowStyle) {
      return this._rowStyle(rowdata);
    }
    return {};
  }
  _getName(rowdata: any, button: ButtonMetadata | CheckboxMetadata): string {
    if (button.name) {
      const name = button.name(rowdata);
      return name;
    }
    return '';
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
      if (this.isMultiple && this._selection.selected.length === 1 && this._selection.selected[0] !== row && this._openIntelligent) {
        this._selection.clear();
      }
      this._click(row);
    }, 300);

  }

  _dblclick(row, $event, index): void {
    clearTimeout(this.clickTimer);
    $event.stopPropagation();
    row.clickIndex = index;
    this.onDblClickSubject.next(row);
  }

  private getLoopBody(template: string, startStr: string, endStr: string, hasData?: boolean) {
    const _indexArr = [];
    let _start = template.indexOf(startStr), _end = template.indexOf(endStr);
    while (_start > -1) {
      _indexArr.push({ startIndex: _start, id: _indexArr.length });
      _start = template.indexOf(startStr, _start + 1);
    }
    while (_end > -1) {
      for (let i = _indexArr.length - 1; i > -1; i--) {
        if ('endIndex' in _indexArr[i] === false && _end > _indexArr[i]['startIndex']) { _indexArr[i]['endIndex'] = _end; break; }
      }
      _end = template.indexOf(endStr, _end + 1);
    }
    for (let j = 0; j < _indexArr.length; j++) {
      _indexArr.forEach(item => {
        if (item.startIndex < _indexArr[j].startIndex && item.endIndex > _indexArr[j].endIndex) { _indexArr[j]['pid'] = item.id; }
      });
      _indexArr[j]['template'] = template.substring(_indexArr[j]['startIndex'], _indexArr[j]['endIndex']);
      if (hasData) {
        _indexArr[j]['dataKey'] = _indexArr[j]['template'].match(/\<%\[.*?data.*?=.*?<%{.*?}%>/)[0].replace(/[\r\n]/g, '')
          .replace(/\s+/g, '').match(/<%{\S*}%>/)[0].replace(/<%{/, '').replace(/}%>/, '');
      }
      _indexArr[j]['template'] = _indexArr[j]['template'] + endStr;
    }
    const _topLoop = _indexArr.filter(item => ('pid' in item) === false);
    for (let i = 0; i < _topLoop.length; i++) {
      template = template.replace(_topLoop[i].template, `<%loop id_${_topLoop[i].id} loop%>`);
    }
    return { template: template, loops: _indexArr };
  }

  getCss(str) {
    const _arr = str.split(/({.*?})/);
    const _pushArr = [];
    _arr.forEach((item, index) => {
      const _str = item.replace(/[\r\n]/g, '').trim();
      if (index % 2 === 0 && _str) {
        item = item.trim();
        item = '.' + this._rootClass + ' ' + item;
      }
      _pushArr.push(item);
    });
    return _pushArr.join('');
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
    this._data = this._dataSource.data;
    for (const i of newSelected) {
      this._selection.select(i);
    }
  }
}
