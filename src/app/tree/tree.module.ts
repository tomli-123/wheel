import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class TreeTestComponent implements OnInit {

  metadata = [];

  chips = {
    type: 'treeselect-ctrl',
    id: 'treeselect',
    "name": null,
    "label": "上级目录树",
    "isMultiSelect": false,
    "hidden": null,
    "disabled": null,
    "passive": null,
    "hasClear": null,
    "required": null,
    "requiredErrorMsg": null,
    "pattern": null,
    "patternErrorMsg": null,
    "canHoverData": null,
    "hoverLength": null,
    "defaultValue": "",
    "local": {},
    "options": [{ "chain": ",R_YX_VIS", "rootcategory": "R_YX_VIS", "level": 1, "refid": "R_YX_VIS", "title": "品牌视觉识别VIS", "type": "R", "refpid": null }, { "chain": ",R_YX_V", "rootcategory": "R_YX_V", "level": 1, "refid": "R_YX_V", "title": "品牌视频资源", "type": "R", "refpid": null }, { "chain": ",R_YX_PP", "rootcategory": "R_YX_PP", "level": 1, "refid": "R_YX_PP", "title": "品牌周边产品", "type": "R", "refpid": null }, { "chain": ",R_YX_PIC", "rootcategory": "R_YX_PIC", "level": 1, "refid": "R_YX_PIC", "title": "品牌图片资源", "type": "R", "refpid": null }, { "chain": ",R_YX_BPIE", "rootcategory": "R_YX_BPIE", "level": 1, "refid": "R_YX_BPIE", "title": "业务品牌推广及投教", "type": "R", "refpid": null }, { "chain": ",R_YX_AF", "rootcategory": "R_YX_AF", "level": 1, "refid": "R_YX_AF", "title": "授权字体库", "type": "R", "refpid": null }],
    "option": {
      "label": "title",
      "value": "refid",
      "nodes": "nodes"
    },
    "onInit": "",
    "onValueChange": "(e)=>{console.log(this.selectionNodes)}",
    "style": {}
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.chips]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }


}

const reportRoutes: Routes = [{
  path: '',
  component: TreeTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    TreeTestComponent
  ],
  entryComponents: [
    TreeTestComponent
  ]
})
export class TreeTestModule {
}
