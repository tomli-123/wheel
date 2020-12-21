import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class ReportTestComponent implements OnInit {

  metadata = [];


  content = {
    id: 'query',
    type: 'query',
    bootstrap: true,
    "helpTabs": [
      {
        "name": "简介",
        "docid": "101"
      },
      {
        "name": "查询",
        "docid": "102"
      },
      {
        "name": "字段",
        "docid": "102"
      }
    ],
    "scope": {},
    "local": {},
    "style": {},
    childs: {
      formChild: [
        {
          id: 'form',
          type: 'div-form'
        }
      ]
    }
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}

const reportRoutes: Routes = [{
  path: '',
  component: ReportTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    ReportTestComponent
  ],
  entryComponents: [
    ReportTestComponent
  ]
})
export class ReportTestModule {
}
