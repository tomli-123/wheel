import { NgModule, ModuleWithProviders, Type, Compiler, Injector } from '@angular/core';

import { DynamicComponentModule, ContainerComponent, CustomModule } from '@qiuer/core';
import { FileUploadModule } from 'ng2-file-upload';
import { QRCodeModule } from 'angular2-qrcode';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { monacoConfig } from './controller/monaco/monaco.config';
import { ControllerService } from './controller/controller.service';
import { FormService } from './layout/form/form.service';
import { DatasetService } from './dataset/dataset.service';

import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UEditorModule } from 'ngx-ueditor';

import { DefaultIntl, CUSTOM_DATE_TIME_FORMATS } from './controller/timepicker/timepicker.component';

// root
import { QueryRootComponent } from './root/query/query.component';

// layout
import { TabPanelLayoutComponent } from './layout/panel/tabPanel/tabPanel.component';
import { ExpansionPanelLayoutComponent } from './layout/panel/expansionPanel/expansionPanel.component';
import { DivLayoutComponent } from './layout/div/div.component';
import { Div2LayoutComponent } from './layout/div2/div2.component';
import { DivFormLayoutComponent } from './layout/form/divForm/divForm.component';
import { LoopLayoutComponent } from './layout/loop/loop.component';
import { CarouselPanelLayoutComponent } from './layout/panel/carouselPanel/carouselPanel.component';
import { AlignLayoutComponent } from './layout/align/align.component';
import { AnchorLayoutComponent } from './layout/anchor/anchor.component';
import { SidenavLayoutComponent } from './layout/sidenav/sidenav.component';
import { GridlistLayoutComponent } from './layout/gridlist/gridlist.component';

// dataset 数据展现容器
import { HtmlDatasetComponent } from './dataset/html/html.component';
import { QrcodeDatasetComponent } from './dataset/qrcode/qrcode.component';
import { TableDatasetComponent } from './dataset/table/table.component';
import { ComplexTableDatasetComponent } from './dataset/complextable/complextable.component';
import { SingleTreeDatasetComponent } from './dataset/tree/singleTree/singleTree.component';
import { AuthorizeTreeComponent } from './dataset/tree/authorizeTree/authorizetree.component';
import { ListDatasetComponent } from './dataset/list/list.component';
import { IframeDatasetComponent } from './dataset/iframe/iframe.component';
import { PreviewDatasetComponent } from './dataset/preview/preview.component';
import { UploadDatasetComponent } from './dataset/upload/upload.component';
import { ProgressBarDatasetComponent } from './dataset/progressBar/progressBar.component';
import { JsonToTableComponent } from './dataset/jsonToTable/jsonToTable.component';
import { DropTableDatasetComponent } from './dataset/dropTable/dropTable.component';
import { GanttComponent } from './dataset/gantt/gantt.component';
import { TemplateDatasetComponent } from './dataset/template/template.component';

// button 按钮容器和放按钮的容器
import { IconButtonComponent } from './button/icon/icon.component';
import { DrawerButtonComponent } from './button/drawer/drawer.component';
import { RaisedButtonComponent } from './button/raised/raised.component';
import { MenuButtonComponent } from './button/menu/menu.component';

// controller 控件容器
import { DatepickerControllerComponent } from './controller/datepicker/datepicker.component';
import { MonthpickerControllerComponent } from './controller/monthpicker/monthpicker.component';
import { SelectControllerComponent } from './controller/select/select.component';
import { GroupSelectControllerComponent } from './controller/groupSelect/groupSelect.component';
import { MultiSelectControllerComponent } from './controller/multiSelect/multiSelect.component';
import { InputControllerComponent } from './controller/input/input.component';
import { TimepickerControllerComponent } from './controller/timepicker/timepicker.component';
import { DaterangepickerControllerComponent } from './controller/daterangepicker/daterangepicker.component';
import { AutocompleteControllerComponent } from './controller/autocomplete/autocomplete.component';
import { TreeControllerComponent } from './controller/tree/tree.component';
import { TableSelectControllerComponent } from './controller/tableSelect/tableSelect.component';
import { RadioControllerComponent } from './controller/radio/radioButton.component';
import { CheckboxControllerComponent } from './controller/checkbox/checkbox.component';
import { SwitchControllerComponent } from './controller/switch/switch.component';
import { TreeoverlayControllerComponent } from './controller/treeoverlay/treeoverlay.component';
import { ButtonToggleControllerComponent } from './controller/buttontoggle/buttonToggle.component';
import { TextareaControllerComponent } from './controller/textarea/textarea.component';
import { ChipsControllerComponent } from './controller/chips/chips.component';
import { UeditorControllerComponent } from './controller/ueditor/ueditor.component';
import { MonacoControllerComponent } from './controller/monaco/monaco.component';
import { DateComparisonPickerControllerComponent } from './controller/datecomparisonpicker/datecomparisonpicker.component';
// 占位
import { DividerControllerComponent } from './controller/divider/divider.component';
import { PartitionControllerComponent } from './controller/partition/partition.component';
import { BlankControllerComponent } from './controller/blank/blank.component';
import { HtmlControllerComponent } from './controller/html/html.component';

const ComponentMapping: { [type: string]: Type<ContainerComponent> } = {
  // 根
  query: QueryRootComponent, // 标准查询 query
  // 布局类
  div: DivLayoutComponent,
  div2: Div2LayoutComponent,
  'div-form': DivFormLayoutComponent,
  align: AlignLayoutComponent,
  'tab-panel': TabPanelLayoutComponent,
  'expansion-panel': ExpansionPanelLayoutComponent,
  'carousel-panel': CarouselPanelLayoutComponent,
  loop: LoopLayoutComponent,
  anchor: AnchorLayoutComponent,
  sidenav: SidenavLayoutComponent,
  gridlist: GridlistLayoutComponent,
  // 数据类
  'table-dataset': TableDatasetComponent,
  'complextable-dataset': ComplexTableDatasetComponent,
  'html-dataset': HtmlDatasetComponent,
  'qrcode-dataset': QrcodeDatasetComponent,
  'tree-dataset': SingleTreeDatasetComponent,
  'list-dataset': ListDatasetComponent,
  'iframe-dataset': IframeDatasetComponent,
  'preview-dataset': PreviewDatasetComponent,
  'upload-dataset': UploadDatasetComponent,
  'progressbar-dataset': ProgressBarDatasetComponent,
  'jsonToTable-dataset': JsonToTableComponent,
  'authorizetree-dataset': AuthorizeTreeComponent,
  'dropTable-dataset': DropTableDatasetComponent,
  'gantt-dataset': GanttComponent,
  'template-dataset': TemplateDatasetComponent,

  // 控件类
  'datepicker-ctrl': DatepickerControllerComponent,
  'monthpicker-ctrl': MonthpickerControllerComponent,
  'datetimepicker-ctrl': TimepickerControllerComponent,
  // 'daterangepicker-ctrl': DaterangepickerControllerComponent,
  'daterangepicker-ctrl': DateComparisonPickerControllerComponent,
  'input-ctrl': InputControllerComponent,
  'select-ctrl': SelectControllerComponent,
  'groupselect-ctrl': GroupSelectControllerComponent,
  'multiselect-ctrl': MultiSelectControllerComponent,
  'autocomplete-ctrl': AutocompleteControllerComponent,
  'treeselect-ctrl': TreeControllerComponent,
  'tableselect-ctrl': TableSelectControllerComponent,
  'radio-ctrl': RadioControllerComponent,
  'checkbox-ctrl': CheckboxControllerComponent,
  'switch-ctrl': SwitchControllerComponent,
  'textarea-ctrl': TextareaControllerComponent,
  'blank-ctrl': BlankControllerComponent,
  'html-ctrl': HtmlControllerComponent,
  'toggle-ctrl': ButtonToggleControllerComponent,
  'chips-ctrl': ChipsControllerComponent,
  'overlay-ctrl': TreeoverlayControllerComponent,
  'divider-ctrl': DividerControllerComponent,
  'partition-ctrl': PartitionControllerComponent,
  'ueditor-ctrl': UeditorControllerComponent,
  'monaco-ctrl': MonacoControllerComponent,
  // 按钮类
  'raised-button': RaisedButtonComponent,
  'icon-button': IconButtonComponent,
  'drawer-button': DrawerButtonComponent,
  'menu-button': MenuButtonComponent
};

import { ButtonComponent } from './button/button.component';
import { DatasetComponent } from './dataset/dataset.component';
import { LayoutComponent } from './layout/layout.component';
import { ControllerComponent } from './controller/controller.component';
import { FormLayoutComponent } from './layout/form/form.component';
import { TableComponent } from './controller/tableSelect/table/table.component';
import { TableDialogComponent } from './controller/tableSelect/table-dialog/table-dialog.component';
import { TreeSelectComponent } from './controller/tree/tree-select/tree.select';
import { TreeDialogComponent } from './controller/tree/tree-dialog/tree-dialog.component';
import { HaveSelectControllerComponent } from './controller/haveSelect.component';
import { BaseSelectControllerComponent } from './controller/baseSelect.component';
import { BaseInputControllerComponent } from './controller/baseInput.component';
import { PanelLayoutComponent } from './layout/panel/panel.component';
import { TreeDatasetComponent } from './dataset/tree/tree.component';
const ABSTRACT_COMPONENT = [
  ButtonComponent,
  DatasetComponent,
  LayoutComponent,
  ControllerComponent,
  FormLayoutComponent,
  TableComponent,
  TableDialogComponent,
  TreeSelectComponent,
  TreeDialogComponent,
  HaveSelectControllerComponent,
  BaseSelectControllerComponent,
  BaseInputControllerComponent,
  PanelLayoutComponent,
  TreeDatasetComponent
];

const Containers: Type<ContainerComponent>[] = [
  // root
  QueryRootComponent,

  // data
  QrcodeDatasetComponent,
  HtmlDatasetComponent,
  TableDatasetComponent,
  ComplexTableDatasetComponent,
  SingleTreeDatasetComponent,
  AuthorizeTreeComponent,
  ListDatasetComponent,
  IframeDatasetComponent,
  PreviewDatasetComponent,
  UploadDatasetComponent,
  ProgressBarDatasetComponent,
  JsonToTableComponent,
  DropTableDatasetComponent,
  GanttComponent,
  TemplateDatasetComponent,

  // controller
  AutocompleteControllerComponent,
  DatepickerControllerComponent,
  MonthpickerControllerComponent,
  TimepickerControllerComponent,
  DaterangepickerControllerComponent,
  SelectControllerComponent,
  GroupSelectControllerComponent,
  MultiSelectControllerComponent,
  InputControllerComponent,
  TreeControllerComponent,
  TableSelectControllerComponent,
  RadioControllerComponent,
  CheckboxControllerComponent,
  SwitchControllerComponent,
  TreeoverlayControllerComponent,
  ButtonToggleControllerComponent,
  TextareaControllerComponent,
  UeditorControllerComponent,
  MonacoControllerComponent,
  ChipsControllerComponent,
  DateComparisonPickerControllerComponent,

  // button
  IconButtonComponent,
  DrawerButtonComponent,
  RaisedButtonComponent,
  MenuButtonComponent,

  // layout
  TabPanelLayoutComponent,
  Div2LayoutComponent,
  DivLayoutComponent,
  DivFormLayoutComponent,
  LoopLayoutComponent,
  CarouselPanelLayoutComponent,
  ExpansionPanelLayoutComponent,
  AlignLayoutComponent,
  AnchorLayoutComponent,
  SidenavLayoutComponent,
  GridlistLayoutComponent,

  // 占位
  BlankControllerComponent,
  HtmlControllerComponent,
  DividerControllerComponent,
  PartitionControllerComponent
];

export const ComponentInfo: any = {
  name: 'qiuer',
  version: '3.1.1-beta.13',
  mapping: ComponentMapping
};

@NgModule({
  imports: [
    CustomModule,
    DynamicComponentModule.withComponents([Containers]),
    FileUploadModule,
    QRCodeModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MonacoEditorModule.forRoot(monacoConfig),
    UEditorModule.forRoot({
      js: [
        `./assets/ueditor/ueditor.all.min.js`,
        `./assets/ueditor/ueditor.config.js`
      ],
      options: {
        UEDITOR_HOME_URL: './assets/ueditor/'
      }
    }),
    PortalModule,
    OverlayModule,
    // NgxDaterangepickerMd.forRoot(),
    DragDropModule
  ],
  declarations: [
    Containers,
    ABSTRACT_COMPONENT
  ],
  exports: [
    Containers,
    MonacoEditorModule,
    QRCodeModule,
    PortalModule,
    OverlayModule,
    DragDropModule
  ],
  entryComponents: [
    Containers,
    ABSTRACT_COMPONENT
  ],
  providers: [
    ControllerService,
    FormService,
    DatasetService,

    {
      provide: OWL_DATE_TIME_LOCALE,
      useValue: 'zh'
    },
    { provide: OWL_DATE_TIME_FORMATS, useValue: CUSTOM_DATE_TIME_FORMATS },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }
  ]
})
export class ComponentModule {

  static forRoot(): ModuleWithProviders<ComponentModule> {
    return {
      ngModule: ComponentModule,
      providers: []
    };
  }

}
