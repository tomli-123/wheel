import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';
// import { MonacoEditorModule } from 'ngx-monaco-editor';

@Component({
  template: `<main [metadata]='metadata'> </main>`
  // template: `<ngx-monaco-editor [options]="editorOptions" [(ngModel)]="code"></ngx-monaco-editor>`
})

export class MonacoTestComponent implements OnInit {

  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  metadata = [];

  monaco = {
    id: 'monaco',
    type: 'monaco-ctrl',
    name: 'main',
    label: '主程序',
    hidden: null,
    disabled: null,
    passive: null,
    required: true,
    minimap: true,
    requiredErrorMsg: null,
    pattern: null,
    patternErrorMsg: null,
    language: 'qscript',
    height: 100,
    isMaxHeight: true,
    tabSize: null,
    defaultValue: '',
    local: {},
    keyboardAction: [],
    onCreate: 'if (this.root.dialogHeight) {\r\n    this.height = this.root.dialogHeight - 219;\r\n}\r\n',
    style: {
      flex: '50',
      xs: {
        flex: '100'
      }
    }
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.monaco]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
    /*
    this.metadata = [{
      "id": "content", "type": "content", "childs":
        [
          {
            "id": "helpTabs",
            "type": "monaco-ctrl",
            "name": null,
            "label": "帮助弹框",
            "hidden": null,
            "disabled": null,
            "passive": null,
            "required": null,
            "requiredErrorMsg": null,
            "pattern": null,
            "patternErrorMsg": null,
            "language": null,
            "height": null,
            "isMaxHeight": null,
            "tabSize": null,
            "defaultValue": "",
            "local": {},
            "keyboardAction": []
          },

          {
            "id": "form", "type": "div-form", "childs":
              [{
                "id": "hidden", "type": "checkbox-ctrl", "name": null, "label": "隐藏", "position": null, "hidden": null, "disabled": null, "passive": null, "required": null, "requiredErrorMsg": null, "pattern": null, "patternErrorMsg": null, "defaultValue": "", "local": {}, "tip": "", "style": {}
              },
              {
                "id": "helpTabs",
                "type": "monaco-ctrl",
                "name": null,
                "label": "帮助弹框",
                "hidden": null,
                "disabled": null,
                "passive": null,
                "required": null,
                "requiredErrorMsg": null,
                "pattern": null,
                "patternErrorMsg": null,
                "language": null,
                "height": null,
                "isMaxHeight": null,
                "tabSize": null,
                "defaultValue": "",
                "local": {},
                "keyboardAction": [],
                "style": { flex: '100', height: '300px' }
              }
              ],
            "isSetUrl": null, "clsBg": null, "hidden": null, "local": {}, "fullHeight": null,
            "style": {
            }
          }
        ], "hidden": null, "bootstrap": null, "scope": {}, "local": {}, "style": {}, "version": "2.5.8"
    }]
    */
  }

}

const reportRoutes: Routes = [{
  path: '',
  component: MonacoTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    MatSharedModule,
    // MonacoEditorModule.forRoot(),
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    MonacoTestComponent
  ],
  entryComponents: [
    MonacoTestComponent
  ]
})
export class MonacoTestModule {
}
