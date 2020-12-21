import { NgModule, ModuleWithProviders } from '@angular/core';
import { Type } from '@angular/core';
import { DynamicComponentModule, CustomModule, ContainerComponent } from '@qiuer/core';
import { ChartDatasetComponent } from './chart/chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DatasetService } from '@qiuer/component';
import * as echarts from 'echarts';

const ChartMapping: { [type: string]: Type<ContainerComponent> } = {
  'chart-dataset': ChartDatasetComponent
};

export const containers: Type<ContainerComponent>[] = [
  ChartDatasetComponent
];

export const ChartInfo: any = {
  name: '图表',
  version: '1.1.0-beta.3',
  mapping: ChartMapping
};

@NgModule({
  imports: [
    CustomModule,
    // NgxEchartsModule,
    NgxEchartsModule.forRoot({ echarts }),
    DynamicComponentModule.withComponents([containers]),
  ],
  declarations: [
    containers
  ],
  exports: [
    containers
  ],
  entryComponents: [
    containers
  ],
  providers: [
    DatasetService
  ]
})

export class ChartModule {
  static forRoot(): ModuleWithProviders<ChartModule> {
    return {
      ngModule: ChartModule,
      providers: []
    };
  }

}
