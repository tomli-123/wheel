
import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';

@Component({
  templateUrl: './gantt.component.html'
})

export class GanttTestComponent implements OnInit {

  // public metadata: any = [];

  gantt = {
    id: 'ganttTest', type: 'gantt-dataset',
    // data: {
    //   data: [
    //     { id: 1, text: 'Project #1', start_date: '2020-02-27 00:00', duration: 5,
    //      progress: 0.6, open: true },
    //     { id: 2, text: 'Task #1', start_date: '2020-03-03 00:00', duration: 3,
    //      progress: 0.4, parent: 1 },
    //     { id: 3, text: 'Task #2', start_date: '2020-03-06 00:00', duration: 3,
    //      progress: 0.4, parent: 1 }
    //   ],
    //   links: [
    //     { id: 1, source: 1, target: 2, type: '1' },
    //     { id: 2, source: 2, target: 3, type: '0' }
    //   ],
    // },
    onInit: `()=>{console.log('ganttInit');this.data={
    data: [
      { id: 1, text: 'Project #1', start_date: '2020-02-27 00:00', duration: 5,
       progress: 0.6, open: true },
      { id: 2, text: 'Task #1', start_date: '2020-03-03 00:00', duration: 3,
       progress: 0.4, parent: 1 },
      { id: 3, text: 'Task #2', start_date: '2020-03-06 00:00', duration: 3,
       progress: 0.4, parent: 1 }
    ],
    links: [
      { id: 1, source: 1, target: 2, type: '1' },
      { id: 2, source: 2, target: 3, type: '0' }
    ],
  }}`,
    onTaskInsert: `(data)=>{console.log("insertTask示例", data);}`,
    onTaskUpdate: '(data)=>{console.log("updateTask示例", data)}',
    onTaskDelete: '(data)=>{console.log("deleteTask示例", data)}',
    onAttachTask: '(data)=>{console.log("onAttachTask示例", data)}',
    onLinkInsert: '(data)=>{console.log("insertLink示例", data)}',
    onLinkupdate: '(data)=>{console.log("updateLink示例", data)}',
    onLinkDelete: '(data)=>{console.log("deleteLink示例", data)}',
    onAttachLink: '(data)=>{console.log("onAttachLink示例", data)}'
  };


  view = [
    {
      "id": "query",
      "type": "query",
      "formChild": {
        "id": "form",
        "type": "div-form",
        "childs": [],
        "isSetUrl": true,
        "clsBg": null,
        "hidden": null,
        "local": {},
        "style": {}
      },
      "buttonChild": {
        "id": "buttonGroup",
        "type": "align",
        "frontChilds": [],
        "backChilds": [],
        "clsBoxing": null,
        "clsPadding": null,
        "clsMargin": null,
        "clsTopMargin": null,
        "hidden": null,
        "order": null,
        "direction": null,
        "local": {},
        "childStyle": {},
        "onInit": "",
        "style": {}
      },
      "dataChild": this.gantt,
      "bootstrap": null,
      "hidden": null,
      "queryId": null,
      "scope": {},
      "local": {},
      "onInit": "console.log(this.version);\r\nconsole.log(this._metadata);",
      "style": {},
      "version": "2.5.4"
    }
  ];

  content = {
    'id': 'content',
    'type': 'content',
    'bootstrap': true,
    'childs': [
    ]
  };


  ngOnInit() {
    // this.content['childs'].push(this.table);
    // this.testJson['metadata'].push(this.content);
  }



}

const reportRoutes: Routes = [{
  path: '',
  component: GanttTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    GanttTestComponent
  ],
  entryComponents: [
    GanttTestComponent
  ]
})
export class GanttTestModule {
}

