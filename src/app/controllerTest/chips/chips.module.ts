import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class ChipsTestComponent implements OnInit {

  metadata = [];

  chips = {
    type: 'chips-ctrl',
    id: 'chips',
    options: [
      { name: '123', value: 'hhh' },
      { name: '456', value: 'xcv' },
      { name: '789', data: 'zxc' },
      { name: '0', value: 'ert' }
    ],
    // label: 'hhh',
    option: { label: 'name' },
    isWithInput: true,
    isCanDelete: true,
    isCanAdd: true
  };

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
    childs: [this.chips, this.input, this.button]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}
const reportRoutes: Routes = [{
  path: '',
  component: ChipsTestComponent
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
    ChipsTestComponent
  ],
  entryComponents: [
    ChipsTestComponent
  ]
})
export class ChipsTestModule {
}
