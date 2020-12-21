import { NgModule, ModuleWithProviders } from '@angular/core';
import { Type } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { DynamicComponentModule, ContainerComponent, MatSharedModule, CustomModule } from '@qiuer/core';

// flow
import { FlowService } from './flow/flow.service';
import { FlowComponent } from './flow/flow.component';
import { FlowOverviewComponent } from './flow/overview/overview.component';
import { FlowApprovalListComponent } from './flow/approvalList/approvalList.component';
import { FlowButtonComponent } from './flow/button/button.component';
import { FlowUserinfoComponent } from './flow/approvalList/userinfoDialog/userinfo-dialog.component';

const FlowMapping: { [type: string]: Type<ContainerComponent> } = {
  flow: FlowComponent,
  overview: FlowOverviewComponent,
  flowButton: FlowButtonComponent
};

const containers: Type<ContainerComponent>[] = [
  FlowComponent,
  FlowOverviewComponent,
  FlowButtonComponent
];

export const FlowInfo: any = {
  name: '流程',
  version: '1.1.1-beta.1',
  mapping: FlowMapping
};


@NgModule({
  imports: [
    MatSharedModule,
    QRCodeModule,
    CustomModule,
    DynamicComponentModule.withComponents([containers]),
  ],
  declarations: [
    FlowComponent,
    FlowOverviewComponent,
    FlowApprovalListComponent,
    FlowButtonComponent,
    FlowUserinfoComponent
  ],
  exports: [
    FlowComponent,
    FlowOverviewComponent,
    FlowApprovalListComponent,
    FlowButtonComponent,
    FlowUserinfoComponent
  ],
  entryComponents: [
    FlowComponent,
    FlowOverviewComponent,
    FlowApprovalListComponent,
    FlowButtonComponent,
    FlowUserinfoComponent
  ],
  providers: [
    FlowService
  ]
})

export class FlowModule {
  static forRoot(): ModuleWithProviders<FlowModule> {
    return {
      ngModule: FlowModule,
      providers: []
    };
  }

}
