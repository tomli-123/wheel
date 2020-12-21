import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { DatePipe } from '@angular/common';

import { ContainerService } from './container.service';
import { containers } from './container.config';
import { ContainerComponent } from './container.component';

import { CustomModule } from '../custom/custom.module';

import { MainContainerComponent } from '../main/main.component';
import { DialogContainerComponent } from '../main/dialog.component';
import { BsDialogContainerComponent } from '../main/bsDialog.component';

import { DynamicComponentModule } from '../dynamic/dynamic.module';

import { RootComponent } from '../root/root.container';
import { ContentRootComponent } from '../root/content/content.component';
import { CommonDialogRootComponent } from '../root/dialog/dialog.component';
import { BottomSheetDialogComponent } from '../root/dialog/bottomSheetDialog/bottomSheetDialog.component';
import { CommonDialogComponent } from '../root/dialog/commonDialog/commonDialog.component';
import { NotFoundContainerComponent } from '../root/notFound/notFound.component';

const QIUER_CORE_COMPONENT = [
  MainContainerComponent,
  DialogContainerComponent,
  BsDialogContainerComponent,
  RootComponent,
  ContentRootComponent,
  CommonDialogRootComponent,
  BottomSheetDialogComponent,
  CommonDialogComponent,
  NotFoundContainerComponent,
  ContainerComponent
];

@NgModule({
  imports: [
    CustomModule,
    MatSnackBarModule,
    ClipboardModule,
    DynamicComponentModule.withComponents([containers])
  ],
  declarations: [
    containers,
    QIUER_CORE_COMPONENT
  ],
  exports: [
    containers,
    CustomModule,
    QIUER_CORE_COMPONENT
  ],
  entryComponents: [
    containers,
    QIUER_CORE_COMPONENT
  ],
  providers: [
    ContainerService, DatePipe
  ]
})

export class ContainerModule {
  static forRoot(): ModuleWithProviders<ContainerModule> {
    return {
      ngModule: ContainerModule,
      providers: []
    };
  }
}
