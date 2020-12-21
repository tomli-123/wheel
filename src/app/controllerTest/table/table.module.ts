import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class TableTestComponent implements OnInit {

  metadata = [];

  table = {
    id: 'table',
    type: 'table-dataset',
    "isSelect": true,
    "isSort": true,
    "isMultiple": true,
    "isToolbar": true,
    "isMsg": true,
    "isFilter": true,
    "isFooter": null,
    "columnFilter": null,
    "isPaginator": true,
    "hidePageSize": null,
    "showFirstLastButtons": null,
    "isInfinite": null,
    "dragDrop": null,
    "canSelectText": null,
    "isPending": null,
    "clsBoxing": null,
    "clsPadding": null,
    "clsMargin": null,
    "clsTopMargin": null,
    "hidden": null,
    "openIntelligent": null,
    "local": {
      "enumStatus": [
        {
          "key": "A",
          "value": "活跃"
        },
        {
          "key": "P",
          "value": "暂停"
        },
        {
          "key": "C",
          "value": "注销"
        }
      ]
    },
    "columns": [
      {
        "name": "funcid",
        "type": "value",
        "value": "rowdata['funcid']",
        "label": "标识",
        "width": "5",
        "minWidth": "30",
        "sticky": true,
        "align": "right"
      },
      {
        "name": "code",
        "type": "value",
        "value": "rowdata['code']",
        "label": "编码",
        "width": "30",
        "minWidth": "160",
        "align": "left"
      },
      {
        "name": "name",
        "type": "value",
        "value": "rowdata['name']",
        "label": "名称",
        "width": "25",
        "minWidth": "160",
        "align": "left"
      },
      {
        "name": "modulename",
        "type": "value",
        "value": "rowdata['modulename']",
        "label": "所属模块",
        "width": "20",
        "minWidth": "160",
        "align": "left"
      },
      {
        "name": "status",
        "type": "value",
        "value": "(rowdata)=>{return this.call('ufTransform', this.local.enumStatus, rowdata.status);}",
        "label": "状态",
        "width": "5",
        "minWidth": "60"
      },
      {
        "name": "loadcnt",
        "type": "value",
        "value": "rowdata['loadcnt']",
        "label": "已加载",
        "width": "5",
        "minWidth": "60",
        "align": "right"
      },
      {
        "name": "activecnt",
        "type": "value",
        "value": "rowdata['activecnt']",
        "label": "活跃",
        "width": "5",
        "minWidth": "60",
        "align": "right"
      },
      {
        "name": "methcnt",
        "type": "value",
        "value": "rowdata['methcnt']",
        "label": "总数",
        "width": "5",
        "minWidth": "60",
        "align": "right"
      }
    ],
    "rowStyle": "",
    "header": [],
    "footer": [],
    "ufTransform": "(list,target)=>{\r\n    const result = list.find(item=>item.key===target);\r\n    return result ? result.value : target;\r\n}",
    "style": {
      "height": "100%"
    },
    "onInit": `this.postData("do/10.51", null, (res) => {
      this.data=res.data;
    })`,
    "onRowHover": `(row) => { return 'create:\\n人员: '+row.createid+'\\n时间: '+row.createtime+'\\n'+'update:\\n人员: '+row.updateid+'\\n时间: '+row.updatetime }`
  };
  // (row) => { return row.updatetime; }
  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.table]
  };

  constructor() {

  }

  ngOnInit() {
    this.metadata = [this.content];
  }

}

const reportRoutes: Routes = [{
  path: '',
  component: TableTestComponent
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
    TableTestComponent
  ],
  entryComponents: [
    TableTestComponent
  ]
})
export class TableTestModule {
}
