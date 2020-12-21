import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './flowTest.component.html'
})

export class FlowTestComponent implements OnInit {

  metadata = [];


  constructor(private hs: HttpClient) { }



  ngOnInit() {
    this.getMetadata();
  }

  getMetadata() {
    const msa = '/do/3021.41';
    const ita = '/do/2852.99';
    this.hs.post(msa, null).subscribe(res => {
      console.log(res);
      this.metadata = res['metadata'];
    });
  }


}

const reportRoutes: Routes = [{
  path: '',
  component: FlowTestComponent
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
    FlowTestComponent
  ],
  entryComponents: [
    FlowTestComponent
  ]
})
export class FlowTestModule {
}
