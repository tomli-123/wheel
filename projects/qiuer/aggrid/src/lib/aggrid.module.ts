import { NgModule, ModuleWithProviders } from '@angular/core';
import { Type } from '@angular/core';
import { DynamicComponentModule, ContainerComponent, MatSharedModule, CustomModule } from '@qiuer/core';
import { ComponentModule } from '@qiuer/component';
import { AgGridDatasetComponent } from './aggrid/aggrid.component';
import { AgGridModule } from '@ag-grid-community/angular';
// aggrid 子组件
// 预览
import { AggridViewButtonComponent } from './aggrid/childComponent/view/button/aggrid-view-button.component';
import { AggridViewIconComponent } from './aggrid/childComponent/view/icon/aggrid-view-icon.component';
import { AggridViewSwitchComponent } from './aggrid/childComponent/view/switch/aggrid-view-switch.component';
import { AggridViewInputComponent } from './aggrid/childComponent/view/input/aggrid-view-input.component';
import { AggridViewSliderComponent } from './aggrid/childComponent/view/slider/aggrid-view-slider.component';
import { AggridViewSelectComponent } from './aggrid/childComponent/view/select/aggrid-view-select.component';
import { AggridViewCheckboxComponent } from './aggrid/childComponent/view/checkbox/aggrid-view-checkbox.component';
// 编辑
import { AggridEditorSelectComponent } from './aggrid/childComponent/editor/select/aggrid-editor-select.component';
import { AggridEditorInputComponent } from './aggrid/childComponent/editor/input/aggrid-editor-input.component';
// 过滤
import { AggridFilterSelectComponent } from './aggrid/childComponent/filter/select/aggrid-filter-select.component';
import { AggridFilterSwitchComponent } from './aggrid/childComponent/filter/switch/aggrid-filter-switch.component';
import { AggridFilterInputComponent } from './aggrid/childComponent/filter/input/aggrid-filter-input.component';
import { AggridFilterDatepickerComponent } from './aggrid/childComponent/filter/datepicker/aggrid-filter-datepicker.component';
// 浮动过滤
import { AggridFloatFilterSelectComponent } from './aggrid/childComponent/floatFilter/select/aggrid-floatFilter-select.component';
import { AggridFloatFilterSwitchComponent } from './aggrid/childComponent/floatFilter/switch/aggrid-floatFilter-switch.component';
import { AggridFloatFilterDatepickerComponent } from './aggrid/childComponent/floatFilter/datepicker/aggrid-floatFilter-datepicker.component';
import { AggridFloatFilterInputComponent } from './aggrid/childComponent/floatFilter/input/aggrid-floatFilter-input.component';
import { AggridFloatFilterSliderComponent } from './aggrid/childComponent/floatFilter/slider/aggrid-floatFilter-slider.component';
// 自定义侧边栏
import { AggridToolPanelGlobalFilterComponent } from './aggrid/childComponent/toolPanel/globalFilter/aggrid-toolPanel-globalFilter';
import { AggridToolPanelContainerComponent } from './aggrid/childComponent/toolPanel/container/aggrid-toolPanel-container';
// 服务
import { FilterConditionService } from './aggrid/childComponent/filterCondition.service';
import { from } from 'rxjs';


export const AggridMapping: { [type: string]: Type<ContainerComponent> } = {
  'aggrid-dataset': AgGridDatasetComponent,
};

export const containers: Type<ContainerComponent>[] = [
  AgGridDatasetComponent
];

export const AggridInfo: any = {
  name: 'aggrid',
  version: '0.1.2',
  mapping: AggridMapping
};

@NgModule({
  imports: [
    MatSharedModule,
    DynamicComponentModule.withComponents([containers]),
    ComponentModule,
    CustomModule,
    AgGridModule
  ],
  declarations: [
    containers,
    // 预览
    AggridViewButtonComponent,
    AggridViewIconComponent,
    AggridViewSwitchComponent,
    AggridViewInputComponent,
    AggridViewSliderComponent,
    AggridViewSelectComponent,
    AggridViewCheckboxComponent,
    // 编辑
    AggridEditorSelectComponent,
    AggridEditorInputComponent,
    // 过滤
    AggridFilterSelectComponent,
    AggridFilterSwitchComponent,
    AggridFilterInputComponent,
    AggridFilterDatepickerComponent,
    // 浮动过滤
    AggridFloatFilterSelectComponent,
    AggridFloatFilterSwitchComponent,
    AggridFloatFilterDatepickerComponent,
    AggridFloatFilterSliderComponent,
    AggridFloatFilterInputComponent,
    // 侧边栏工具
    AggridToolPanelGlobalFilterComponent,
    AggridToolPanelContainerComponent
  ],
  exports: [
    containers,
    AgGridModule,
    // 预览
    AggridViewButtonComponent,
    AggridViewIconComponent,
    AggridViewSwitchComponent,
    AggridViewInputComponent,
    AggridViewSliderComponent,
    AggridViewSelectComponent,
    AggridViewCheckboxComponent,
    // 编辑
    AggridEditorSelectComponent,
    AggridEditorInputComponent,
    // 过滤
    AggridFilterSelectComponent,
    AggridFilterSwitchComponent,
    AggridFilterInputComponent,
    AggridFilterDatepickerComponent,
    // 浮动过滤
    AggridFloatFilterSelectComponent,
    AggridFloatFilterSwitchComponent,
    AggridFloatFilterDatepickerComponent,
    AggridFloatFilterSliderComponent,
    AggridFloatFilterInputComponent,
    // 侧边栏工具
    AggridToolPanelGlobalFilterComponent,
    AggridToolPanelContainerComponent

  ],
  entryComponents: [
    containers,
    // 预览
    AggridViewButtonComponent,
    AggridViewIconComponent,
    AggridViewSwitchComponent,
    AggridViewInputComponent,
    AggridViewSliderComponent,
    AggridViewSelectComponent,
    AggridViewCheckboxComponent,
    // 编辑
    AggridEditorSelectComponent,
    AggridEditorInputComponent,
    // 过滤
    AggridFilterSelectComponent,
    AggridFilterSwitchComponent,
    AggridFilterInputComponent,
    AggridFilterDatepickerComponent,
    // 浮动过滤
    AggridFloatFilterSelectComponent,
    AggridFloatFilterSwitchComponent,
    AggridFloatFilterDatepickerComponent,
    AggridFloatFilterSliderComponent,
    AggridFloatFilterInputComponent,
    // 侧边栏工具
    AggridToolPanelGlobalFilterComponent,
    AggridToolPanelContainerComponent
  ],
  providers: [
    FilterConditionService,

  ]
})

export class AggridModule {
  static forRoot(): ModuleWithProviders<AggridModule> {
    return {
      ngModule: AggridModule,
      providers: []
    };
  }

}
