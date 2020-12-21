import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule, MatRangeDateSelectionModel } from '@angular/material/datepicker';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class DatepickerTestComponent implements OnInit {

  metadata = [];

  picker = {
    id: 'datecomparisonpicker',
    type: 'daterangepicker-ctrl',
    label: 'test label',
    // defaultValue: new Date('2020-10-14'),
    // comparisonDateStart: '2020-10-07',
    // comparisonDateEnd: '2020-10-13',
    maxDate: '20201014',
    minDate: '20201007',
    // disabled: false,
    // required: true,
    separator: '-',
    // defInterval: 'week',
    onValueChange: `(val) => {console.log('come hha', val)}`
  }

  dateRangePicker = {
    id: 'dateRangePicker',
    type: 'daterangepicker-ctrl'
  }

  button = {
    type: 'raised-button',
    id: 'button',
    label: '查看',
    onClick: `() => {
      // this.cid('datecomparisonpicker').value = ['20200101','20200520'];
      console.log(this.cid('datecomparisonpicker')._formControl.value);
      console.log(this.cid('datecomparisonpicker').value);
    }`
  }


  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.picker, this.button]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}
const reportRoutes: Routes = [{
  path: '',
  component: DatepickerTestComponent
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
    DatepickerTestComponent
  ],
  entryComponents: [
    DatepickerTestComponent
  ],
  providers: [MatRangeDateSelectionModel]
})
export class DatepickerTestModule {
}
