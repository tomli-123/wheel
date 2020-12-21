import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]='metadata'> </main>`
})

export class PreviewTestComponent implements OnInit {

  metadata = [];

  preview = {
    id: 'preview',
    type: 'preview-dataset',
    fileType: 'mp4',
    url: 'https://background.cowtransfer.com/assets/1219life.mp4',
    style: {
      height: '200px'
    }
  };

  previewAudio = {
    id: 'previewAudio',
    type: 'preview-dataset',
    fileType: 'mp3',
    url: 'https://dev-frame.gtjaqh.net/do/99.36?plant=mp3',
    style: {
      height: '200px'
    }
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.preview, this.previewAudio]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }

}

const reportRoutes: Routes = [{
  path: '',
  component: PreviewTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    MatSharedModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    PreviewTestComponent
  ],
  entryComponents: [
    PreviewTestComponent
  ]
})
export class PreviewTestModule {
}
