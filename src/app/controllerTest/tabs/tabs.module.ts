import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class TabsTestComponent implements OnInit {

  metadata = [];

  button = {
    type: 'raised-button',
    id: 'button',
    label: '复制',
    onClick: `() => {
      console.log(this.cid('input').value);
      this.src.copyText(this.cid('input').value);
    }`
  }

  tabs = {
    id: 'tabs',
    type: 'tab-panel',
    // isLazy: true,
    childs: [
      {
        type: 'div',
        id: 'div1',
        name: 'tab1',
        childs: [
          {
            id: 'input1',
            type: 'input-ctrl'
          }
        ]
      }, {
        type: 'div',
        id: 'div2',
        name: 'tab2',
        childs: [
          {
            type: 'raised-button',
            id: 'button2',
            label: '复制',
            onClick: `() => {
              console.log(this.cid('input1').value);
            }`
          }
        ]
      }
    ]
  }

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.button, this.tabs]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}
const reportRoutes: Routes = [{
  path: '',
  component: TabsTestComponent
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
    TabsTestComponent
  ],
  entryComponents: [
    TabsTestComponent
  ]
})
export class TabsTestModule {
}
