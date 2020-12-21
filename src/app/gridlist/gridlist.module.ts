
import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';

@Component({
  templateUrl: './gridlist.component.html'
})

export class GridlistTestComponent implements OnInit {

  public scoreList: any[] = [];

  table = {
    id: 'gridlistTest',
    type: 'gridlist',
    cols: 4,
    rowHeight: '50px',
    list: [
      {
        col: 3, row: 2, bgColor: 'lightblue',
        'childElement': {
          'id': 'raised-button',
          'type': 'raised-button',
          "label": null,
          "icon": "icon-calendar",
          "tip": 'this is tip',
          "tipPosition": null,
          "top": null,
          "right": null,
          "bottom": null,
          "left": null,
          "shape": "mini-circle",
          "disabled": null,
          "hidden": null,
          "local": {},
          "onClick": "this.disabled = true",
          "style": {}
        }
      },
      {
        col: 2, row: 1, bgColor: 'lightgreen',
        'childElement': {
          'id': 'raised-button',
          'type': 'raised-button',
          "label": null,
          "icon": "icon-pencil",
          "tip": "修改",
          "tipPosition": null,
          "top": null,
          "right": null,
          "bottom": null,
          "left": null,
          "shape": "circle",
          "disabled": null,
          "hidden": true,
          "local": {},
          "onInit": "this.subs('tableChild', 'selected', (e) => {\r\n    // console.log('tableChild selected', e);\r\n    const selectLength = e.length;\r\n    if (!this.scope.editBtnFlage) {\r\n        if (selectLength > 1) {\r\n            this.disabled = true;\r\n            this.hidden = false;\r\n        } else if (selectLength === 1) {\r\n            this.hidden = false;\r\n            this.disabled = false;\r\n        } else {\r\n            this.hidden = true;\r\n        }\r\n    }\r\n\r\n});",
          "ufDialogReturn": "(code, data) => {\r\n    if (code === 0) {\r\n        this.cid('tableChild').call('ufQuery');\r\n        this.src.tipDialog(data.msg);\r\n    } else if (code === 1) {\r\n        this.cid('tableChild').call('ufQuery');\r\n    }\r\n}",
          "onClick": "(data) => {\r\n    console.log('edit click');\r\n    const tableChild = this.cid('tableChild');\r\n    data = data || tableChild.selection[0];\r\n    const defaultFuncid = this.cid('funcid').value || data.funcid;\r\n    const editRow = data || tableChild.selection[0] || {};\r\n    this.openDialog('dialog', { title: '修改', type: 'edit', data: editRow, defaultFuncid }, 'ufDialogReturn');\r\n}\r\n\r\n",
          "style": {}
        }
      },
      { col: 2, row: 1, bgColor: 'lightpink' },
      { col: 3, row: 1, bgColor: 'lightyellow' },
      { col: 1, row: 1, bgColor: 'lightblue' },

    ],

  };


  view = [
    {
      "id": "query",
      "type": "query",
      "formChild": {
        "id": "form",
        "type": "div-form",
        "childs": [
          {
            "id": "funcid",
            "type": "select-ctrl",
            "name": null,
            "label": "功能号",
            "valueType": "number",
            "hasFilter": null,
            "filterField": null,
            "filterPlaceholder": null,
            "options": [],
            "hasClear": true,
            "emptyLabel": null,
            "isHtmlLabel": null,
            "hidden": null,
            "disabled": null,
            "passive": null,
            "required": false,
            "requiredErrorMsg": null,
            "pattern": null,
            "patternErrorMsg": null,
            "local": {},
            "tip": "",
            "defaultValue": "",
            "option": {
              "label": "name",
              "value": "funcid",
              "primary": null
            },
            "onInit": "let value = this.value;\r\nthis.getData('/do/10.62', {}, (res) => {\r\n    this.options = res.data.map(item => { item.name = item.funcid.toString() + ' - ' + item.name; return item });\r\n    this.value = value || this.options[0].funcid;\r\n});",
            "onValueChange": "() => {\r\n    const fuzzy = this.cid('fuzzy');\r\n    if (fuzzy.value && this.value) {\r\n        fuzzy.value = null;\r\n    }\r\n}",
            "style": {
              "flex": "25",
              "xs": {
                "flex": "100"
              },
              "sm": {
                "flex": "50"
              }
            }
          },
          {
            "id": "fuzzy",
            "type": "input-ctrl",
            "name": null,
            "label": "模糊搜索",
            "valueType": null,
            "useEmptyAsString": null,
            "prefixHtml": null,
            "suffixHtml": null,
            "hidden": null,
            "disabled": null,
            "passive": null,
            "required": null,
            "requiredErrorMsg": null,
            "pattern": null,
            "patternErrorMsg": null,
            "defaultValue": "",
            "tip": "",
            "local": {},
            "onValueChange": "() => {\r\n    const funcid = this.cid('funcid');\r\n    if (funcid.value && this.value) {\r\n        funcid.value = null;\r\n    }\r\n}",
            "style": {
              "flex": "25",
              "xs": {
                "flex": "100"
              },
              "sm": {
                "flex": "50"
              }
            }
          }
        ],
        "isSetUrl": true,
        "clsBg": null,
        "hidden": null,
        "local": {},
        "style": {}
      },
      "buttonChild": {
        "id": "buttonGroup",
        "type": "align",
        "frontChilds": [
          {
            "id": "plusBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-plus",
            "tip": "新增",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": null,
            "disabled": null,
            "local": {},
            "onInit": `
            this.subs('tableChild', 'selected', (e) => {\r\n    const selectLength = e.length;console.log('eeeee1');\r\n    if (!this.scope.plusBtnFlage) {\r\n        this.disabled = selectLength > 1 ? true : false;\r\n    }\r\n\r\n});`,
            "onClick": `
            const tableChild = this.cid('tableChild');
            const defaultFuncid = this.cid('funcid').value;
            const data = tableChild.gridApi.getSelectedRows()[0] || {};
            console.log(data)
            this.openDialog('dialog',{ title: '新增', type: 'add', data, defaultFuncid },'ufDialogReturn');`,
            "ufDialogReturn": "(code, data) => {\r\n    // console.log(code, data);\r\n    if (code === 0) {\r\n        this.cid('tableChild').call('ufQuery');\r\n        this.src.tipDialog('新增成功');\r\n    } else if (code === 1) {\r\n        this.cid('tableChild').call('ufQuery');\r\n    }\r\n}",
            "style": {}
          },
          {
            "id": "editBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-pencil",
            "tip": "修改",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onInit": "this.subs('tableChild', 'selected', (e) => {\r\n    // console.log('tableChild selected', e);\r\n    const selectLength = e.length;console.log('eeeee2');\r\n    if (!this.scope.editBtnFlage) {\r\n        if (selectLength > 1) {\r\n            this.disabled = true;\r\n            this.hidden = false;\r\n        } else if (selectLength === 1) {\r\n            this.hidden = false;\r\n            this.disabled = false;\r\n        } else {\r\n            this.hidden = true;\r\n        }\r\n    }\r\n\r\n});",
            "ufDialogReturn": "(code, data) => {\r\n    if (code === 0) {\r\n        this.cid('tableChild').call('ufQuery');\r\n        this.src.tipDialog(data.msg);\r\n    } else if (code === 1) {\r\n        this.cid('tableChild').call('ufQuery');\r\n    }\r\n}",
            "onClick": "(data) => {\r\n    console.log('edit click');\r\n    const tableChild = this.cid('tableChild');\r\n    data = data || tableChild.selectedRow[0];\r\n    const defaultFuncid = this.cid('funcid').value || data.funcid;\r\n    const editRow = data || tableChild.selectedRow[0] || {};\r\n    this.openDialog('dialog', { title: '修改', type: 'edit', data: editRow, defaultFuncid }, 'ufDialogReturn');\r\n}",
            "style": {}
          },
          {
            "id": "delBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-delete",
            "tip": "删除",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onInit": "this.subs('tableChild','selected',(e)=>{\r\n  const selectLength = e.length;console.log('eeeee3');\r\n  console.log('------jinrunbuuton----------',this.scope.delBtnFlage);\r\n      if (!this.scope.delBtnFlage) {\r\n        if (selectLength > 1) {\r\n            this.disabled = true;\r\n            this.hidden = false;\r\n        } else if (selectLength === 1) {\r\n            this.hidden = false;\r\n            this.disabled = false;\r\n        } else {\r\n            this.hidden = true;\r\n        }\r\n    }\r\n});",
            "onClick": "const selectRow = this.cid('tableChild').selectedRow[0] || {};\r\nthis.openDialog(\"shared.operationDialog\",\r\n    { title: \"删除\", content: \"是否删除方法号: \" + selectRow.methid + \" ,编码: \" + selectRow.code + \"?\" },\r\n    \"ufSure\");",
            "ufSure": "(code) => {\r\n    if (code == 0) {\r\n        const selectedRow = this.cid('tableChild').selectedRow[0];\r\n        const data = {funcid: selectedRow.funcid, methid: selectedRow.methid};\r\n        this.postData('/do/10.66', data, (res) => {\r\n            this.cid('tableChild').call('ufQuery');\r\n            this.src.tipDialog('删除成功');\r\n        });\r\n    }\r\n}",
            "style": {}
          },
          {
            "id": "loadBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-play",
            "tip": "加载",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onInit": "this.subs('tableChild','selected',(e)=>{\r\n  const selectLength = e.length;console.log('eeeee4');\r\n      if (!this.scope.loadBtnFlage) {\r\n        this.hidden = selectLength > 0 ? false : true;\r\n    }\r\n \r\n});",
            "onClick": "let url;\r\nlet param;\r\nconst data = this.cid('tableChild').selectedRow || [];\r\n// const funcid = this.cid('funcid').value + '';\r\nif (data.length > 1) {\r\n    const methodList = [];\r\n    for (let i = 0; i < data.length; i++) {\r\n        methodList.push( data[i].funcid + '.' + data[i].methid);\r\n    }\r\n    url = '/do/10.25';\r\n    param = {\r\n        fpidlist: methodList\r\n    };\r\n} else {\r\n    url = '/do/10.20';\r\n    param = {\r\n        fpid: data[0].funcid + '.' + data[0].methid\r\n    };\r\n}\r\nthis.postData(url, param, (res) => {\r\n    this.cid('tableChild').call('ufQuery');\r\n    this.src.tipDialog(res.msg);\r\n});",
            "style": {}
          },
          {
            "id": "removeBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-stop",
            "tip": "卸载",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onInit": "this.subs('tableChild', 'selected', (e) => {\r\n    const selectLength = e.length;console.log('eeeee5');\r\n    if (!this.scope.removeBtnFlage) {\r\n        this.hidden = selectLength > 0 ? false : true;\r\n    }\r\n\r\n});",
            "onClick": "let url;\r\nlet param;\r\nconst data = this.cid('tableChild').selectedRow || [];\r\nif (data.length > 1) {\r\n    const methodList = [];\r\n    for (let i = 0; i < data.length; i++) {\r\n        methodList.push( data[i].funcid + '.' + data[i].methid);\r\n    }\r\n    url = '/do/10.26';\r\n    param = {\r\n        fpidlist: methodList\r\n    };\r\n} else {\r\n    url = '/do/10.21';\r\n    param = {\r\n        fpid: data[0].funcid + '.' + data[0].methid\r\n    };\r\n}\r\nthis.postData(url, param, (res) => {\r\n    this.cid('tableChild').call('ufQuery');\r\n    this.src.tipDialog(res.msg);\r\n});",
            "style": {}
          }
        ],
        "backChilds": [
          {
            "id": "searchBtn",
            "type": "raised-button",
            "label": null,
            "icon": "icon-magnify",
            "tip": "搜索",
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": "accent",
            "shape": "circle",
            "hidden": null,
            "disabled": null,
            "local": {},
            "onClick": `
            const table = this.cid('tableChild');
            table.call('ufQuery');
            `,
            "style": {}
          }
        ],
        "clsBoxing": null,
        "clsPadding": null,
        "clsMargin": null,
        "clsTopMargin": null,
        "hidden": null,
        "order": null,
        "direction": null,
        "local": {},
        "childStyle": {},
        "onInit": "() => {\r\n    const data = {\r\n        \"data\": [\r\n            [10, 20],//加载一个功能点\r\n            [10, 25],//加载多个功能点\r\n            [10, 61],//查询\r\n            [10, 65],//增加\r\n            [10, 66],//删除\r\n            [10, 67],//修改\r\n            [10, 21],//卸载\r\n            [10, 26]//卸载\r\n        ]\r\n    };\r\n    const map = [\r\n        { \"name\": \"loadBtn\", \"flage\": \"loadBtnFlage\" },\r\n        { \"name\": \"loadBtn\", \"flage\": \"loadBtnFlage\" },\r\n        { \"name\": \"searchBtn\", \"flage\": \"searchBtnFlage\" },\r\n        { \"name\": \"plusBtn\", \"flage\": \"plusBtnFlage\" },\r\n        { \"name\": \"delBtn\", \"flage\": \"delBtnFlage\" },\r\n        { \"name\": \"editBtn\", \"flage\": \"editBtnFlage\" },\r\n        { \"name\": \"removeBtn\", \"flage\": \"removeBtnFlage\" },\r\n        { \"name\": \"removeBtn\", \"flage\": \"removeBtnFlage\" }\r\n    ];\r\n    this.postData('/do/10.40', data, (res) => {\r\n        const resultArr = res.data;\r\n        for (let i = 0; i < resultArr.length; i++) {\r\n            const name = map[i].name;\r\n            const flage = map[i].flage;\r\n            if (!resultArr[i]) {\r\n                this.cid(name).hidden = !resultArr[i];\r\n                this.scope[flage] = !resultArr[i];\r\n            }\r\n        }\r\n    });\r\n}",
        "style": {}
      },
      "dataChild": this.table,
      "bootstrap": null,
      "hidden": null,
      "queryId": null,
      "scope": {},
      "local": {},
      "onInit": "console.log(this.version);\r\nconsole.log(this._metadata);",
      "style": {},
      "version": "2.5.4"
    },
  ]





  content = {
    'id': 'content',
    'type': 'content',
    'bootstrap': true,
    'childs': [
    ]
  };






  // tslint:disable-next-line:member-ordering
  // testJson = {
  //   'metadata': [
  //   ]
  // };

  ngOnInit() {
    // this.content['childs'].push(this.table);
    // this.testJson['metadata'].push(this.content);
  }



}

const reportRoutes: Routes = [{
  path: '',
  component: GridlistTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    GridlistTestComponent
  ],
  entryComponents: [
    GridlistTestComponent
  ]
})
export class GridlistTestModule {
}

