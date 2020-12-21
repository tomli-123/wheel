import { NgModule, ModuleWithProviders } from '@angular/core';
import { Type } from '@angular/core';
import { DynamicComponentModule, ContainerComponent, MatSharedModule, CustomModule } from '@qiuer/core';

import { MarkdownModule } from 'ngx-markdown';
import { markdownConf } from './markdown/markdown.config';
import { MarkdownDatasetComponent } from './markdown/markdown.component';


const MarkdownMapping: { [type: string]: Type<ContainerComponent> } = {
  'markdown-dataset': MarkdownDatasetComponent,
};

const containers: Type<ContainerComponent>[] = [
  MarkdownDatasetComponent
];

export const MarkdownInfo: any = {
  name: '文档编辑器',
  version: '1.1.0-beta.3',
  mapping: MarkdownMapping
};


@NgModule({
  imports: [
    CustomModule,
    MatSharedModule,
    MarkdownModule.forRoot(markdownConf),
    DynamicComponentModule.withComponents([containers]),
  ],
  declarations: [
    containers
  ],
  exports: [
    containers,
    MarkdownModule
  ],
  entryComponents: [
    containers
  ],
  providers: [
  ]
})

export class MarkDownModule {
  static forRoot(): ModuleWithProviders<MarkDownModule> {
    return {
      ngModule: MarkDownModule,
      providers: []
    };
  }

}
