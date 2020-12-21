import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { DatasetService, DatasetComponent, DatasetMetadata } from '@qiuer/component';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { Subject } from 'rxjs';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';

// aggrid 子组件
// 预览
import { AggridViewButtonComponent } from './childComponent/view/button/aggrid-view-button.component';
import { AggridViewIconComponent } from './childComponent/view/icon/aggrid-view-icon.component';
import { AggridViewSwitchComponent } from './childComponent/view/switch/aggrid-view-switch.component';
import { AggridViewInputComponent } from './childComponent/view/input/aggrid-view-input.component';
import { AggridViewSliderComponent } from './childComponent/view/slider/aggrid-view-slider.component';
import { AggridViewSelectComponent } from './childComponent/view/select/aggrid-view-select.component';
import { AggridViewCheckboxComponent } from './childComponent/view/checkbox/aggrid-view-checkbox.component';
// 编辑
import { AggridEditorSelectComponent } from './childComponent/editor/select/aggrid-editor-select.component';
import { AggridEditorInputComponent } from './childComponent/editor/input/aggrid-editor-input.component';

// 过滤
import { AggridFilterSelectComponent } from './childComponent/filter/select/aggrid-filter-select.component';
import { AggridFilterSwitchComponent } from './childComponent/filter/switch/aggrid-filter-switch.component';
import { AggridFilterDatepickerComponent } from './childComponent/filter/datepicker/aggrid-filter-datepicker.component';
import { AggridFilterInputComponent } from './childComponent/filter/input/aggrid-filter-input.component';
// 浮动过滤
import { AggridFloatFilterSelectComponent } from './childComponent/floatFilter/select/aggrid-floatFilter-select.component';
import { AggridFloatFilterSwitchComponent } from './childComponent/floatFilter/switch/aggrid-floatFilter-switch.component';
import { AggridFloatFilterDatepickerComponent } from './childComponent/floatFilter/datepicker/aggrid-floatFilter-datepicker.component';
import { AggridFloatFilterInputComponent } from './childComponent/floatFilter/input/aggrid-floatFilter-input.component';
import { AggridFloatFilterSliderComponent } from './childComponent/floatFilter/slider/aggrid-floatFilter-slider.component';
// 自定义侧边栏
import { AggridToolPanelGlobalFilterComponent } from './childComponent/toolPanel/globalFilter/aggrid-toolPanel-globalFilter';
import { AggridToolPanelContainerComponent } from './childComponent/toolPanel/container/aggrid-toolPanel-container';

/***********************************************************************************/
/*                                     TODO                                       */
/***********************************************************************************/
/*重要
单选去掉全选
全局过滤增加信息
更改数据时 新旧对比  remove>add>change {old:[],new:[],update:{add:[],change:[],remove:[]}} 每次setData时重置
子组件是否需要加自己的valueGetter
分页控制
子组件增加是否突出选项 并去掉mat样式 部分改成原生模式
增加新增 选中插入 插入空行 删除示例
自定义的吸顶 以及底部固定
resize事件
*/
/*挑战
单元格大小 数据超出大小处理
自定义底部状态栏
侧边工具栏
过滤是否区分大小写控制开关
excel 导出导入 csv导出
自定义侧边栏 放置container
*/

/*待整理
双击事件会触发单击事件并触发编辑事件
*/


/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface AgGridDatasetMetadata extends DatasetMetadata {
  data?: any[];
  columns?: TableColumnMetadata[];
  hasColumnResizable?: boolean; // 列宽调整
  hasColumnMovable?: boolean; // 列拖拽
  hasSortable?: boolean; // 列排序
  hasFilter?: boolean; // 过滤
  hasRowDrag?: boolean; // 行拖拽
  hasPagination?: boolean; // 分页
  paginationPageSize?: number; // 分页数量
  columnFullSize?: boolean; // 是否让列自动撑满表格

  // selection
  hasSelection?: boolean; // 是否含有选择
  hasSelectCheckbox?: boolean; // 是否含有checkbox
  selectionModel?: string; // 选择模式 'single' || 'multiple'
  suppressRowClickSelection?: string; // 是否禁止点击行来选择

  // 侧边栏
  hasSideBar?: boolean; // 是否含有侧边栏 默认false
  siderBarPosition?: string; // 侧边栏位置 默认right
  toolPanel?: string[]; // 侧边栏tab功能 cloumn cloumnFilter globalFilter 默认全部
  containerToolPanel?: any[]; // 自定义container 展示在侧边栏 与默认的单独区分
  defaultToolPanel?: string; // 默认展示tab
  // event
  onClick?: string;
  onDblClick?: string;
  onSelected?: string;
}


export interface TableColumnMetadata {
  label?: string; // 表头名
  headerValueGetter?: string; // 表头回调函数
  field?: string; // 列字段
  style?: string; // 样式
  width?: number; // 宽度
  minWidth?: number; // 最小宽度


  viewComponent?: string; // 预览所用模板名 icon|button|input|select|date|html|img|checkbox|img|switch
  viewComponentParams?: any; // 模板的入参
  viewComponentResultEvent?: string; // 模板发生回调后触发事件名或函数 output(rowdata,value)

  // editable?: boolean; // 是否可以编辑
  editorComponent?: any; // 编辑所用模板名
  // editorComponentParams?: any;
  // editorComponentResultEvent?: string;

  filter?: string; // filter组件名
  filterParams?: any; // filter参数
  doesFilterPass?: string; // 过滤是否通过的回调函数

  floatingFilterComponent?: string; // 浮动的过滤组件名
  floatingFilterComponentParams?: any; // 浮动的过滤组件参数


  value?: string; // 值
  valueFormatter?: string; // 转化value
  getValueFormatter?: string;
  setValueFormatter?: string;
}



export class ColumnDefs {
  headerName?: string;
  headerValueGetter?: Function;
  field?: string;
  width?: number;
  minWidth?: number;
  cellStyle?: Function;

  cellRenderer?: string;
  cellRendererParams?: any;
  cellRendererResultEvent?: string; // 组件回调函数名

  editable?: boolean; // 是否可以编辑
  cellEditor?: string;
  cellEditorParams?: any;
  cellEditorResultEvent?: string;

  valueGetter?: Function; // valueGetter优先级要大于 field
  valueSetter?: Function; // 用来做编辑交互
  valueFormatter?: Function;

  filter?: string; // 过滤类型
  filterParams?: any;
  doesFilterPass?: Function; // 过滤是否通过

  floatingFilterComponent?: string;
  floatingFilterComponentParams?: any;

  headerCheckboxSelection?: boolean;
  headerCheckboxSelectionFilteredOnly?: boolean;
  checkboxSelection?: boolean;
  rowDrag?: boolean;
  menuTabs?: string[]; /*菜单栏控制 "filterMenuTab", "generalMenuTab", "columnsMenuTab"
  如果弹出菜单被遮挡 参考https://www.ag-grid.com/javascript-grid-context-menu/#popup-parent*/

  suppressMenu?: boolean;
}

export interface UpdateHistory {
  // 权重 add>remove>update add+remove = 无
  add: any[];
  remove: any[];
  update: any[];
}

export class TableData extends Array {
  protected environment: any; // AgGridDatasetComponent
  protected updateInfo: any; // 当前改动
  constructor(args: any[], environment: any) {
    super(...args);
    this.environment = environment;
  }
  push(item: any) {
    const index = super.push(item);
    const updateInfo = this.environment.gridApi.updateRowData({ add: [item] });
    this.updateInfo = updateInfo;
    this.environment.updateHistory.add.push(item);
    return index;
  }
  splice(start: number, deleteCount: number, ...items) {
    const newArray = new Array(...this);
    const del = newArray.splice(start, deleteCount, ...items);
    let updateInfo;
    if (deleteCount === 0) {      // 为0代表不删除 等于 push

      this.updateInfo = updateInfo;
      // 历史操作记录
      for (const i of items) {
        this.environment.updateHistory.add.push(i);
      }
      // 本次操作记录
      updateInfo = this.environment.gridApi.updateRowData({ add: items, addIndex: start });
    } else {

      // 历史操作记录
      // splic 在updateHistory上分为 add remove两个操作:
      // remove
      this.updateHistoryRemove(this[start]);
      // add
      for (const i of items) {
        this.environment.updateHistory.add.push(i);
      }


      // 本次操作记录
      updateInfo = this.environment.gridApi.updateRowData({ add: items, addIndex: start, remove: [this[start]] });
    }

    this.length = newArray.length;
    for (let i = 0; i < newArray.length; i++) {
      this[i] = newArray[i];
    }
    return del;
  }
  pop() {
    // 历史操作记录
    this.updateHistoryRemove(this[this.length - 1]);
    // 本次操作记录
    const updateInfo = this.environment.gridApi.updateRowData({ remove: [this[this.length - 1]] });
    this.updateInfo = updateInfo;
    return super.pop();
  }
  shift() {
    // 历史操作记录
    this.updateHistoryRemove(this[0]);
    // 本次操作记录
    const updateInfo = this.environment.gridApi.updateRowData({ remove: [this[0]] });
    this.updateInfo = updateInfo;
    return super.shift();
  }
  unshift(...item: any) {
    // 本次操作记录
    const updateInfo = this.environment.gridApi.updateRowData({ add: item });
    this.updateInfo = updateInfo;
    // 历史操作记录
    for (const i of item) {
      this.environment.updateHistory.add.push(i);
    }
    return super.unshift(...item);
  }

  protected updateHistoryRemove(item) {
    // remove
    if (this.environment.updateHistory.add.indexOf(item) !== -1) { // 先判断是否在历史记录的add里
      this.environment.updateHistory.add.splice(this.environment.updateHistory.add.indexOf(item), 1);
    } else {
      // 不在add里 进入remove
      const index = this.indexOf(item);
      if (this.environment.updateHistory.update.indexOf(index) !== -1) { // 再判断是否在历史记录的update里
        this.environment.updateHistory.update.splice(this.environment.updateHistory.update.indexOf(index), 1);
      }
      this.environment.updateHistory.remove.push(item);
    }
  }
}

@Component({
  selector: 'aggrid-dataset',
  styleUrls: ['./aggrid.component.scss'],
  templateUrl: './aggrid.component.html'
})
export class AgGridDatasetComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit {

  // 国际化
  localeText = {
    // for filter panel
    page: '页面',
    more: '更多',
    to: '到',
    of: '属于',
    next: '下一个',
    last: '最后',
    first: '第一',
    previous: '以前的',
    loadingOoo: '加载中...',

    // for set filter
    selectAll: '全选',
    searchOoo: '搜索中...',
    blanks: '空白',

    // for number filter and text filter
    filterOoo: '过滤中...',
    applyFilter: '应用过滤器',
    equals: '等于',
    notEqual: '不等于',

    // for number filter
    lessThan: '小于',
    greaterThan: '大于',
    lessThanOrEqual: '小于等于',
    greaterThanOrEqual: '大于等于',
    inRange: '范围内',

    // for text filter
    contains: '包含',
    notContains: '不包含',
    startsWith: '开始使用',
    endsWith: '结束使用',

    // filter conditions
    andCondition: '与条件',
    orCondition: '或条件',

    // the header of the default group column
    group: '组',

    // tool panel
    columns: '列',
    filters: '过滤器',
    rowGroupColumns: '行组列',
    rowGroupColumnsEmptyMessage: '行组列空白信息',
    valueColumns: '列的值',
    pivotMode: '核心模式',
    groups: '组',
    values: '值',
    pivots: '核心',
    valueColumnsEmptyMessage: '列值空白信息',
    pivotColumnsEmptyMessage: '核心列空白信息',
    toolPanelButton: '工具面板按钮',

    // other
    noRowsToShow: '不显示行',
    enabled: '使实现',

    // enterprise menu
    pinColumn: '固定列',
    valueAggregation: '值集合',
    autosizeThiscolumn: '自动调整此列宽大小',
    autosizeAllColumns: '自动调整所有列宽大小',
    groupBy: '分组',
    ungroupBy: '不分组',
    resetColumns: '重置列',
    expandAll: '展开所有',
    collapseAll: '关闭所有',
    toolPanel: '工具面板',
    export: '导出',
    csvExport: '导出csv',
    excelExport: '导出excel',
    excelXmlExport: '导出xml',

    // enterprise menu (charts)
    pivotChartAndPivotMode: '数据透视图和数据透视模式',
    pivotChart: '数据透视图',
    chartRange: '图表范围',

    columnChart: '图表列',
    groupedColumn: '分组列',
    stackedColumn: '堆叠列',
    normalizedColumn: '标准化列',

    barChart: '柱状图',
    groupedBar: '分组条',
    stackedBar: '堆叠条',
    normalizedBar: '标准化条',

    pieChart: '饼图',
    pie: '饼',
    doughnut: '圈',

    line: '线',

    xyChart: 'XY坐标轴',
    scatter: '分散',
    bubble: '气泡',

    areaChart: '面积图',
    area: '面积',
    stackedArea: '堆积面积',
    normalizedArea: '标准化区域',

    // enterprise menu pinning
    pinLeft: '左固定',
    pinRight: '右固定',
    noPin: '不固定',

    // enterprise menu aggregation and status bar
    sum: '和',
    min: '最小值',
    max: '最大值',
    none: '无',
    count: '计算',
    average: '平均值',
    filteredRows: '已过滤行',
    selectedRows: '选中行',
    totalRows: '总行数',
    totalAndFilteredRows: '已过滤总行数',

    // standard menu
    copy: '复制',
    copyWithHeaders: '包含头部复制',
    ctrlC: 'ctrl + C',
    paste: '粘贴',
    ctrlV: 'ctrl + V',

    // charts
    pivotChartTitle: '数据透视图标题',
    rangeChartTitle: '范围图表标题',
    settings: '设置',
    data: '数据',
    format: '格式',
    categories: '类别',
    series: '系列',
    xyValues: 'XY值',
    paired: '成对的',
    axis: '轴',
    color: '颜色',
    thickness: '厚度',
    xRotation: 'X轴旋转',
    yRotation: 'Y轴旋转',
    ticks: '记号',
    width: '宽度',
    length: '长度',
    padding: '内边距',
    chart: '图表',
    title: '标题',
    background: '背景',
    font: '字体',
    top: '顶部距离',
    right: '右边距',
    bottom: '底部距离',
    left: '左边距',
    labels: '标签',
    size: '尺寸',
    minSize: '最小尺寸',
    maxSize: '最大尺寸',
    legend: '说明',
    position: '位置',
    markerSize: '数字',
    markerStroke: '标记',
    markerPadding: '标记内边距',
    itemPaddingX: '元素距离左边距离',
    itemPaddingY: '元素距离顶部距离',
    strokeWidth: '轻触宽度',
    offset: 'laOffset',
    offsets: 'laOffsets',
    tooltips: '工具提示',
    callout: '标注',
    markers: '标记',
    shadow: '阴影',
    blur: '焦点',
    xOffset: 'laX Offset',
    yOffset: 'laY Offset',
    lineWidth: '线宽',
    normal: '正常',
    bold: '加粗',
    italic: '斜体',
    boldItalic: '加粗且斜体',
    predefined: '预定义',
    fillOpacity: '填充不透明度',
    strokeOpacity: '条纹不透明度',
    columnGroup: '列组',
    barGroup: '柱组',
    pieGroup: '饼组',
    lineGroup: '线组',
    scatterGroup: '散射群',
    areaGroup: '区域组',
    groupedColumnTooltip: '列组的工具提示',
    stackedColumnTooltip: '轻触列的工具提示',
    normalizedColumnTooltip: '标准列的工具提示',
    groupedBarTooltip: '柱状组的工具提示',
    stackedBarTooltip: '轻触柱状图工具提示',
    normalizedBarTooltip: '标准柱状图提示',
    pieTooltip: '饼图工具提示',
    doughnutTooltip: '圈工具提示',
    lineTooltip: '折线图提示',
    groupedAreaTooltip: '区域图组的提示',
    stackedAreaTooltip: '轻触区域提示',
    normalizedAreaTooltip: '标准区域提示',
    scatterTooltip: '分散图提示',
    bubbleTooltip: '气泡图提示',
    noDataToChart: '图表无数据',
    pivotChartRequiresPivotMode: '数据透视图要求的数据透视模式'
  };
  // tabled的基础支持
  private gridApi;
  private gridColumnApi;
  public gridOptions: GridOptions;
  public modules: Module[] = AllModules;

  // table的全局功能定义
  _hasColumnResizable?: boolean; // 列宽调整
  _hasColumnMovable?: boolean; // 列拖拽
  _hasSortable?: boolean; // 列排序
  _hasFilter?: boolean; // 过滤
  _hasFloatFilter?: boolean; // 浮动过滤 根据column中是否有float来判断
  _hasRowDrag?: boolean; // 行拖拽
  _hasPagination?: boolean; // 分页
  _paginationPageSize?: number; // 分页数
  _colResizeDefault: string;

  _hasSelection: boolean; // 是否可以选择
  _hasSelectCheckbox: boolean; // 是否有checkbox列
  _selectionModel: string; // 选择模式
  _suppressRowClickSelection: boolean; // 是否禁止点击行来选择
  _rowMultiSelectWithClick: boolean; // 是否允许单击选择多行
  _columnFullSize: boolean; // 是否让列自动撑满表格
  // column模板
  _frameworkComponents?: any;
  public defaultColDef = { resizable: false, suppressMovable: true, sortable: false, filter: false, suppressMenu: false };
  public componentParams = {}; // 以列ID名存放的组件参数
  // 列定义
  protected _metadata: AgGridDatasetMetadata;
  public _columnDefs: ColumnDefs[];

  // 数据
  public _data: any[];
  public updateHistory: UpdateHistory;



  public _filterValue: string;

  // 侧边工具
  public sideBar = {
    toolPanels: [], // 工具组tab
    defaultToolPanel: 'columns', // 默认显示tab
    position: 'right',
    containerToolPanel: []
  };

  // 自定义图标
  public icons = {
    globalFilter: '<span class="ag-icon qf icon-filter"></span>'
  };
  // Subject
  onClickSubject: Subject<any> = new Subject<any>();
  onDblClickSubject: Subject<any> = new Subject<any>();
  onSelectedSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
    this.gridOptions = ({
      context: {
        _parent: this
      }
    } as GridOptions);

    // this.gridOptions = <GridOptions> {
    //   context: {
    //     _parent: this
    //   }
    // };

    this._frameworkComponents = {
      // 预览
      input_ViewComponent: AggridViewInputComponent,
      slider_ViewComponent: AggridViewSliderComponent,
      icon_ViewComponent: AggridViewIconComponent,
      button_ViewComponent: AggridViewButtonComponent,
      switch_ViewComponent: AggridViewSwitchComponent,
      select_ViewComponent: AggridViewSelectComponent,
      checkbox_ViewComponent: AggridViewCheckboxComponent,
      // 编辑
      input_EditorComponent: AggridEditorInputComponent,
      select_EditorComponent: AggridEditorSelectComponent,
      // 过滤
      select_FilterComponent: AggridFilterSelectComponent,
      switch_FilterComponent: AggridFilterSwitchComponent,
      input_FilterComponent: AggridFilterInputComponent,
      datepicker_FilterComponent: AggridFilterDatepickerComponent,
      // 浮动过滤
      select_FloatFilterComponent: AggridFloatFilterSelectComponent,
      switch_FloatFilterComponent: AggridFloatFilterSwitchComponent,
      datepicker_FloatFilterComponent: AggridFloatFilterDatepickerComponent,
      input_FloatFilterComponent: AggridFloatFilterInputComponent,
      slider_FloatFilterComponent: AggridFloatFilterSliderComponent,
      // 侧边栏
      globalFilter_toolPanelComponent: AggridToolPanelGlobalFilterComponent,
      container_toolPanelComponent: AggridToolPanelContainerComponent
    };
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set columns(_tableColumns: TableColumnMetadata[]) {
    this._columnDefs = [];
    this.hasFloatFilter = false;
    if (_tableColumns && _tableColumns instanceof Array) {
      _tableColumns.forEach((item, index) => {
        const column: ColumnDefs = new ColumnDefs();
        column.headerName = item.label || '';
        if (item.headerValueGetter !== undefined) {
          if (this._service.isFunction(item.headerValueGetter)) {
            column.headerValueGetter = this._evalStatement(item.headerValueGetter);
          } else {
            column.headerValueGetter = this._evalStatement('(rowdata) => {\nreturn ' + item.headerValueGetter + '\n}');
          }
        }
        if (item.field !== undefined) {
          column.field = item.field;
        }
        if (item.value !== undefined) {
          if (this._service.isFunction(item.value)) {
            column.valueGetter = this._evalStatement(item.value);
          } else {
            column.valueGetter = this._evalStatement('(rowdata) => {\nreturn ' + item.value + '\n}');
          }
        }
        if (item.valueFormatter !== undefined) {
          if (this._service.isFunction(item.valueFormatter)) {
            column.valueFormatter = this._evalStatement(item.valueFormatter);
          } else {
            column.valueFormatter = this._evalStatement('(rowdata) => {\nreturn ' + item.valueFormatter + '\n}');
          }
        }

        if (item.style !== undefined) {
          if (this._service.isFunction(item.style)) {
            column.cellStyle = this._evalStatement(item.style);
          } else {
            column.cellStyle = this._evalStatement('(rowdata) => {\nreturn ' + item.style + '\n}');
          }
        }

        if (item.width !== undefined) {
          column.width = item.width;
        }
        if (item.minWidth !== undefined) {
          column.minWidth = item.minWidth;
        }
        if (item.viewComponent !== undefined) {
          column.cellRenderer = item.viewComponent + '_ViewComponent';
        }
        if (item.viewComponentParams !== undefined) {
          column.cellRendererParams = item.viewComponentParams;
        }
        if (item.viewComponentResultEvent !== undefined) {
          column.cellRendererResultEvent = item.viewComponentResultEvent;
        }

        if (item.editorComponent !== undefined) {
          column.cellEditor = item.editorComponent.type + '_EditorComponent';
        }
        // if (item.editorComponentParams !== undefined) {
        //   column.cellEditorParams = item.editorComponentParams;
        //   // 转化function
        //   // if (item.editorComponentParams.validFunction !== undefined) {
        //   //   if (this._service.isFunction(item.editorComponentParams.validFunction)) {
        //   //     column.cellEditorParams.validFunction = this._evalStatement(item.editorComponentParams.validFunction);
        //   //   } else {
        //   //     column.cellEditorParams.validFunction = this._evalStatement('(rowdata) => {\nreturn ' + item.editorComponentParams.validFunction + '\n}');
        //   //   }
        //   // }
        // }
        // if (item.editorComponentResultEvent !== undefined) {
        //   column.cellEditorResultEvent = item.editorComponentResultEvent;
        // }
        if (item.filter !== undefined) {
          switch (item.filter) {
            //  number|text|date
            case 'set': column.filter = 'agSetColumnFilter'; break;
            case 'text': column.filter = 'agTextColumnFilter'; break;
            case 'number': column.filter = 'agNumberColumnFilter'; break;
            case 'date': column.filter = 'agDateColumnFilter'; break;
            default: column.filter = item.filter + '_FilterComponent';
          }
        }

        if (item.filterParams !== undefined) {
          column.filterParams = item.filterParams;
        }

        if (item.doesFilterPass !== undefined) {
          if (this._service.isFunction(item.doesFilterPass)) {
            column.doesFilterPass = this._evalStatement(item.doesFilterPass);
          } else {
            column.doesFilterPass = this._evalStatement('(cellData,filterValue) => {\nreturn ' + item.doesFilterPass + '\n}');
          }
        }
        if (item.floatingFilterComponent !== undefined) {
          column.floatingFilterComponent = item.floatingFilterComponent + '_FloatFilterComponent';
          this.hasFloatFilter = true;
        }
        column.floatingFilterComponentParams = item.floatingFilterComponentParams || {};
        column.floatingFilterComponentParams['suppressFilterButton'] = true;
        column.menuTabs = ['filterMenuTab', 'generalMenuTab'];
        this._columnDefs.push(column);
      });

      // 处理拖拽和选择 其他功能待定
      if (this._hasSelectCheckbox && this._hasRowDrag) {
        this._columnDefs.unshift({
          headerCheckboxSelection: this.selectionModel === 'multiple',
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          rowDrag: true,
          width: 70,
          floatingFilterComponentParams: {
            suppressFilterButton: true
          },
          suppressMenu: true
        });
      } else {
        if (this._hasSelectCheckbox && this._hasSelection) {
          this._columnDefs.unshift({
            headerCheckboxSelection: this.selectionModel === 'multiple',
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            width: 40,
            floatingFilterComponentParams: {
              suppressFilterButton: true
            },
            suppressMenu: true
          });
        }
        if (this._hasRowDrag) {
          this._columnDefs.unshift({
            rowDrag: true,
            width: 30,
            floatingFilterComponentParams: {
              suppressFilterButton: true
            },
            suppressMenu: true
          });
        }
      }

    }
  }


  public set data(_data: any[]) {
    this.clearSelection();
    this._data = new TableData(_data, this);
    this.resetUpdateHistory();
    this.defaultColDef.resizable = true;
  }
  public get data(): any[] {
    return this._data || [];
  }
  // public set data(_data: any[]) {
  //   this.clearSelection();
  //   this._data = _data || [];
  // }
  // public get data(): any[] {
  //   return this._data || [];
  // }
  public set hasColumnResizable(_hasColumnResizable: boolean) {
    this._hasColumnResizable = !!_hasColumnResizable;
    this.defaultColDef.resizable = !!_hasColumnResizable;
  }
  public set hasColumnMovable(_hasColumnMovable: boolean) {
    this._hasColumnMovable = !!_hasColumnMovable;
    this.defaultColDef.suppressMovable = !_hasColumnMovable;
  }
  public set hasSortable(_hasSortable: boolean) {
    this._hasSortable = !!_hasSortable;
    this.defaultColDef.sortable = !!_hasSortable;
  }
  public set hasFilter(_hasFilter: boolean) {
    this._hasFilter = !!_hasFilter;
    this.defaultColDef.filter = !!_hasFilter;
  }
  public set hasFloatFilter(_hasFloatFilter: boolean) {
    this._hasFloatFilter = !!_hasFloatFilter;
  }
  public set hasRowDrag(_hasRowDrag: boolean) {
    this._hasRowDrag = !!_hasRowDrag;
  }
  public set hasPagination(_hasPagination: boolean) {
    this._hasPagination = !!_hasPagination;
  }
  public set paginationPageSize(_paginationPageSize: number) {
    this._paginationPageSize = _paginationPageSize;
  }
  public set selectionModel(_selectionModel: string) {
    this._selectionModel = _selectionModel || 'single';
    if (this._selectionModel === 'multiple') {
      this._rowMultiSelectWithClick = true;
    } else {
      this._rowMultiSelectWithClick = false;
    }
  }

  public set hasSelection(_hasSelection: boolean) {
    this._hasSelection = !!_hasSelection;
    this.suppressRowClickSelection = !_hasSelection; // 管理行点击功能
  }

  public set hasSelectCheckbox(_hasSelectCheckbox: boolean) {
    this._hasSelectCheckbox = !!_hasSelectCheckbox;
  }

  public get selection(): any[] {
    return this.gridApi.getSelectedRows();
  }
  public get selectionNodes(): any[] {
    return this.gridApi.getSelectedNodes();
  }
  public set suppressRowClickSelection(_suppressRowClickSelection: boolean) {
    this._suppressRowClickSelection = !!_suppressRowClickSelection;
  }
  public get columnWidth() {
    return this.gridColumnApi.getAllGridColumns().map(item => item.actualWidth);
  }
  public get getAllGridColumns() {
    return this.gridColumnApi.getAllGridColumns();
  }

  public set toolPanel(toolPanel: string[]) {
    const toolTab = ['columns', 'cloumnFilter', 'globalFilter', 'container'];
    const customToolPanel = [];
    if (!toolPanel) {
      toolPanel = toolTab;
    }
    const defaultToolPanel = {
      columns: {
        id: 'columns',
        labelDefault: '列功能',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel'
      },
      cloumnFilter: {
        id: 'cloumnFilter',
        labelDefault: '列过滤',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel'
      },
      globalFilter: {
        id: 'globalFilter',
        labelDefault: '全局过滤',
        labelKey: 'customStats',
        iconKey: 'globalFilter',
        toolPanel: 'globalFilter_toolPanelComponent',
        toolPanelParams: { parentComponent: this }
      }
    };
    if (this._metadata.containerToolPanel && this._metadata.containerToolPanel.length > 0) {
      const key = 'container';
      defaultToolPanel[key] = {
        id: 'containerToolPanel',
        labelDefault: '工具栏',
        labelKey: 'containerStats',
        iconKey: 'container',
        toolPanel: 'container_toolPanelComponent',
        toolPanelParams: {
          parentComponent: this,
          metadata: this._metadata.containerToolPanel
        }
      };
    }

    for (const i of toolPanel) {
      if (defaultToolPanel[i]) {
        customToolPanel.push(defaultToolPanel[i]);
      }
    }
    this.sideBar.toolPanels = customToolPanel;
  }

  public set defaultToolPanel(name: string) {
    if (name) {
      this.sideBar.defaultToolPanel = name;
    }
  }
  public set sideBarPosition(position: string) {
    if (position) {
      this.gridApi.setSideBarPosition(position);
    }
  }
  public set hasSideBar(hasSideBar: boolean) {
    this.gridApi.setSideBarVisible(!!hasSideBar);
  }

  public set filterValue(filterValue: string) {
    this._filterValue = filterValue;
    globalFilterValue = filterValue;
    this.gridApi.onFilterChanged();
  }
  public get filterValue(): string {
    return this._filterValue;
  }
  public get onClick(): string { return this._getCallback('onClick').toString(); }
  public set onClick(onClick: string) { this._setEvent('click', onClick); }
  public get onDblClick(): string { return this._getCallback('onDblClick').toString(); }
  public set onDblClick(onDblClick: string) { this._setEvent('dblClick', onDblClick); }
  public get onSelected(): string { return this._getCallback('onSelected').toString(); }
  public set onSelected(onSelected: string) {
    this._setEvent('selected', onSelected);
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  test() {
    this.data.push({ label: '第一次push' });
    this.data.splice(2, 1, { label: 'splic1' }, { label: 'splic2' });
    this.data.unshift({ label: 'unshift' });
    this.data.shift();
    // this.data.shift();
    // console.log(this.updateHistory);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this._metadata);
    const _metadata = this._metadata;
    this.resetUpdateHistory();
    this.hasSelection = _metadata.hasSelection;
    this.hasSelectCheckbox = _metadata.hasSelectCheckbox;
    this.hasRowDrag = _metadata.hasRowDrag;
    this.columns = _metadata.columns;
    this.selectionModel = _metadata.selectionModel;
    this.hasColumnMovable = _metadata.hasColumnMovable;
    this.hasColumnResizable = _metadata.hasColumnResizable;
    this.hasSortable = _metadata.hasSortable;
    this.hasFilter = _metadata.hasFilter;
    this.hasPagination = _metadata.hasPagination;
    this._paginationPageSize = _metadata.paginationPageSize;
    this._colResizeDefault = 'shift';
    this._columnFullSize = _metadata.columnFullSize;
    if (_metadata.hasSideBar) {
      this.defaultToolPanel = _metadata.defaultToolPanel;
      this.toolPanel = _metadata.toolPanel;
    }
    this.registerEvent();
    this.onClick = this._metadata.onClick;
    this.onDblClick = this._metadata.onDblClick;
    this.onSelected = _metadata.onSelected;
  }

  ngAfterViewInit(): void {
    this.getLayoutChange();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                            私有                                 */
  /***********************************************************************************/

  registerEvent() {
    const selectedEvent = new ContainerEvent('selected', this.onSelectedSubject, '(rowdata)');
    const clickEvent = new ContainerEvent('click', this.onClickSubject, '(rowdata)');
    const dblClickEvent = new ContainerEvent('dblClick', this.onDblClickSubject, '(rowdata)');
    this._setCallbackEvent(selectedEvent);
    this._setCallbackEvent(clickEvent);
    this._setCallbackEvent(dblClickEvent);
    this._setDoEventFunction(selectedEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(clickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(dblClickEvent, (func: Function, e: any) => {
      func(e);
    });

  }

  /***********************************************************************************/
  /*                            others                                 */
  /***********************************************************************************/

  onGridReady(params) {
    console.log('The grid is onReady...');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.data = this._metadata.data || [];
    if (this._columnFullSize) {
      this.columnFullSize();
    }

    if (this._metadata.hasSideBar) {
      this.sideBarPosition = this._metadata.siderBarPosition;
      this.hasSideBar = this._metadata.hasSideBar;
    }
  }

  columnFullSize() {
    const viewPortRight = this.gridColumnApi.columnController.viewportRight;
    this.gridColumnApi.sizeColumnsToFit(viewPortRight);
  }
  onViewComponentChange(name, rowdata, value?, component?) {
    // name:函数事件名
    // rowdata：本行数据
    // value：改变值
    // component：当前单元格组件 包含 get/set value nodeValue等方法
    this.call(name, rowdata, value, component);
  }

  onSelectionChanged(e) {
    this.onSelectedSubject.next(this.selection);
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }
  onRowClicked(e) {
    this.onClickSubject.next(e.data);
  }
  onRowDoubleClicked(e) {
    this.onDblClickSubject.next(e.data);
  }

  isGlobalFilterPresent() {
    return globalFilterValue !== '' && globalFilterValue !== null && globalFilterValue !== undefined;
  }

  doesGlobalFilterPass(node) {
    const filterValue = globalFilterValue;
    if (!filterValue) {
      return true;
    }
    if (typeof node.data !== 'object') {
      if (node.data.toString().includes(filterValue)) {
        return true;
      }
    }

    if (typeof node.data === 'object') {
      for (const property in node.data) {
        if (node.data[property] === null) {
          continue;
        }
        if (node.data[property].toString().toLowerCase().includes(filterValue.toString().toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
  resetUpdateHistory() {
    this.updateHistory = {
      add: [],
      remove: [],
      update: []
    };
  }
  columnResized(e) {
    console.log(this.columnWidth);
  }
  columnMoved(e) {
    console.log(this.columnWidth);
  }
  rowDragEnd(e) {
    console.log(e);
  }

  changeRowDate() {
    //   const beforeChangeRowData = this.data[index];
    //   if (this.updateHistory.add.indexOf(beforeChangeRowData) !== -1) {
    //     this.updateHistory.add[index] = rowdata;
    //   }
    //   if (this.updateHistory.update.indexOf(index) !== -1) {
    //     this.updateHistory.update.push(index);
    //   }

  }
}

let globalFilterValue;
