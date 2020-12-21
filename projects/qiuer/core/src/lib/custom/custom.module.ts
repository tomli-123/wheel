import { NgModule, ModuleWithProviders } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

// import { MatPaginatorIntl } from '@angular/material';
// import { DateAdapter } from '@angular/material';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';

import { MatSharedModule } from './share/mat.share.module';

import { MatPaginatorCro } from './directive/MatPaginatorCro';
import { MyDateAdapter, MyLocal } from './directive/myDateAdapter';
import { FilterPipe } from './directive/filter.pipe';
import { SafeHtmlPipe } from './directive/safeHtml.pipe';
import { DialogMaxheightDirective } from './directive/dialogMaxheight.directive';
import { MaxHeightDirective } from './directive/maxHeight.directive';
import { ClazzDirective } from './directive/clazz.directive';
import { DynLayoutDirective } from './directive/layout.directive';
import { NgxAnchorModule } from './ngx-anchor/anchor.module';

@NgModule({
  imports: [
    MatSharedModule,
    LayoutModule,
    NgxAnchorModule.forRoot(),
  ],
  declarations: [
    DialogMaxheightDirective,
    FilterPipe,
    MaxHeightDirective,
    DynLayoutDirective,
    ClazzDirective,
    SafeHtmlPipe
  ],
  exports: [
    MatSharedModule,
    NgxAnchorModule,
    DialogMaxheightDirective,
    FilterPipe,
    MaxHeightDirective,
    DynLayoutDirective,
    ClazzDirective,
    SafeHtmlPipe,
  ],
  entryComponents: [
  ],
  providers: [
    MyLocal,
    {
      provide: DateAdapter,
      useClass: MyDateAdapter
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorCro
    }
  ]
})

export class CustomModule {
  static forRoot(): ModuleWithProviders<CustomModule> {
    return {
      ngModule: CustomModule,
      providers: []
    };
  }

}
