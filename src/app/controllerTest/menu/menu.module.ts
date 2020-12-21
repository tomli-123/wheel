import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class MenuTestComponent implements OnInit {

  metadata = [];

  menu = {
    id: 'menu',
    type: 'menu-button',
    label: '测试看看',
    icon: 'icon-calculator',
    shape: 'flat',
    onClick: `
    (e) => {
      console.log(e);
    }
    `,
    data: [
      {
        icon: 'icon-google-chrome',
        label: '1',
        child: [
          {
            label: '1-1'
          },
          {
            label: '1-2'
          },
          {
            label: '1-3',
            child: [
              { label: '1-3-1' }
            ]
          }
        ]
      }, {
        label: '2',
        child: [
          {
            label: '2-1',
          }
        ]
      }, {
        label: '3'
      }
    ]
  }

  input = {
    type: 'input-ctrl',
    id: 'input'
  }

  button = {
    type: 'raised-button',
    id: 'button',
    label: '复制',
    onClick: `() => {
      console.log(this.cid('input').value);
      this.src.copyText(this.cid('input').value);
    }`
  }

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.menu]
    // childs: [this.button]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}
const reportRoutes: Routes = [{
  path: '',
  component: MenuTestComponent
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
    MenuTestComponent
  ],
  entryComponents: [
    MenuTestComponent
  ]
})
export class MenuTestModule {
}
