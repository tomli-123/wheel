
import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '@qiuer/core';
import { MainContainerComponent } from '../../../projects/qiuer/core/src/lib/main/main.component';
// import { ContainerModule } from '../../../projects/qiuer/core/src/lib/container/container.module';
// import { MatSharedModule } from '../../../projects/qiuer/core/src/lib/custom/share/mat.share.module';

@Component({
  templateUrl: './agGrid.component.html'
})

export class AgGridTestComponent implements OnInit {

  public scoreList: any[] = [];

  table = {
    id: 'tableChild',
    type: 'aggrid-dataset',
    hasSelection: true,
    hasSelectCheckbox: true,
    // selectionModel: 'multiple',
    hasColumnResizable: true,
    hasColumnMovable: true,
    hasSortable: true,
    hasFilter: true,
    hasRowDrag: false,
    hasPagination: true,
    columnFullSize: true,
    hasSideBar: true,
    paginationPageSize: 10,
    columns: [
      {
        label: '功能点',
        field: 'methid',
        width: 150,
        valueFormatter: `(params)=>{
          return params.data.funcid + '.' + params.data.methid;
        }`,
        filter: 'input',
        filterParams: {
          valueType: 'number'
        }
      },
      {
        label: '编码',
        field: 'code',
        width: 200,
        minWidth: 50,
        editable: true,
        editorComponent: 'input',
        editorComponentParams: {
          tip: '不允许出现中文',
          required: true,
          requiredMsg: '必填',
          pattern: '^[^\u4e00-\u9fa5]{0,}$',
          patternMsg: '不允许出现中文'
        },
        filter: 'switch',
        filterParams: { label: '只看frame' },
        doesFilterPass: `(cellData,filterValue)=>{
         if(filterValue){
            return cellData.indexOf('frame')!==-1;
         }
          return true;
        }`,
        floatingFilterComponent: 'switch',
        floatingFilterComponentParams: {
          label: '只看frame',
        },
        valueFormatter: `(params)=>{
          return params.value;
        }`
      },
      {
        label: '名称',
        field: 'name',
        width: 200,
        filter: 'input',
        editable: true,
        editorComponent: 'input',
        editorComponentParams: {
          tip: '不允许为空',
          required: true,
          requiredMsg: '必填'
        }
      },
      {
        label: '权限',
        field: 'access',
        width: 90,
        valueFormatter: `(params)=>{
          switch(params.value) {
            case 'I':
               return '内部';
            case 'S':
              return '会话';
            case 'O':
              return '开放';
            case 'T':
              return '令牌';
              default:
                return '授权';
          }
        }`,
        editable: true,
        editorComponent: 'select',
        editorComponentParams: {
          required: true,
          options: [{ value: 'I', label: '内部' }, { value: 'S', label: '会话' }, { value: 'O', label: '开放' }, { value: 'T', label: '令牌' }, { value: 'A', label: '授权' }],
          tip: '开放的功能点不需要登录就可以访问'
        }
      },
      {
        label: '请求',
        field: 'request',
        width: 110,
        editable: true,
        editorComponent: 'select',
        editorComponentParams: {
          required: true,
          options: [{ value: 'GP', label: 'get&post' }, { value: 'G', label: 'get' }, { value: 'P', label: 'post' }]
        }
      },
      {
        label: '模式',
        field: 'mode',
        width: 210,
        viewComponent: 'select',
        viewComponentResultEvent: 'ufSelect',
        // valueFormatter: `(params)=>{
        //   // console.log('formatter')
        //   if (params.value === 'L') {
        //       return true;
        //   } else {
        //       return false;
        //   }`,
        viewComponentParams: {
          option: { label: 'value', value: 'key' },
          options: [{ key: 'R', value: '发行' }, { key: 'D', value: '调试' }],
          tip: 'test',
          hasClear: true
        },

        // editable: true,
        // editorComponent: 'select',
        // editorComponentParams: {
        //   option: { label: 'value', value: 'key' },
        //   options: [{ key: 'R', value: '发行' }, { key: 'D', value: '调试' }]
        // },
        // valueFormatter: `(params)=>{
        //   if (params.value === 'R') {
        //       return '发行';
        //   } else if(params.value ==='D'){
        //       return '调试';
        //   }else{
        //     return '';
        //   }
        // }`,
      },
      {
        label: '状态',
        field: 'status',
        width: 100,
        editable: true,
        editorComponent: 'select',
        editorComponentParams: {
          required: true,
          options: [{ value: 'A', label: '活跃' }, { value: 'P', label: '暂停' }]
        },
        valueFormatter: `(params)=>{
          if (params.value === 'A') {
              return '活跃';
          } else {
              return '暂停';
          }
        }`,
        style: ` (params)=>{
          if (params.value === 'A') {
              return { backgroundColor: '#ffeef0' };
          } else {
              return { backgroundColor: '#ffeef0' };
          }
        }`
      },
      {
        label: '加载',
        field: 'loadstatus',
        width: 100,
        filter: 'select',
        filterParams: {
          label: 'label',
          value: 'value',
          options: [{ value: 'L', label: '加载1' }, { value: 'U', label: '注销' }]
        },
        doesFilterPass: `(cellData,filterValue)=>{
          return cellData === filterValue;
        }`,
        floatingFilterComponent: 'select',
        floatingFilterComponentParams: {
          label: 'label',
          value: 'value',
          options: [{ value: 'L', label: '加载' }, { value: 'U', label: '注销' }],
          tip: '参数其实可以和select filter通用'
        },
        viewComponent: 'switch',
        viewComponentResultEvent: 'ufLoadChange',
        valueFormatter: `(params)=>{
          // console.log('formatter')
          if (params.value === 'L') {
              return true;
          } else {
              return false;
          }
        }`
      },
      {
        label: 'mycheckbox',
        field: 'showbox',
        width: 210,
        viewComponent: 'checkbox',
        viewComponentResultEvent: 'ufcheckbox',
        viewComponentParams: {
          label: 'showbox',
          // position: 'before',
          tip: 'checkbox'
        },
      }
      // {
      //   label: '预览',
      //   field: 'show',
      //   width: 100,
      //   viewComponentParams: { label: '预览', icon: 'icon-delete', tip: '点击',  shape: 'rectangle', disabled: 'true' },
      //   viewComponent:'button',
      //   viewComponentResultEvent:'ufClickBtn',
      //   valueFormatter: `(params)=>{
      //     // console.log('formatter', params)
      //     if (params.value === 'true') {
      //         return true;
      //     } else if (params.value === 'false') {
      //         return false;
      //     }
      //   }`
      // },
      // {
      //   label: '图标',
      //   field: 'icon',
      //   width: 100,
      //   viewComponentParams: { icon: 'icon-magnify', tip: '查询' },
      //   viewComponent:'icon',
      //   viewComponentResultEvent:'ufClickBtn'
      // },
      // {
      //   label: '输入框',
      //   field: 'input',
      //   width: 150,
      //   filter: 'datepicker',
      //   filterParams: {
      //     hasClear: true
      //   },
      //   doesFilterPass: `(cellData,filterValue,range)=>{
      //     console.log(cellData);
      //     console.log('范围',range);
      //     let date = new Date(filterValue);
      //     date = date.getFullYear() + '' + ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1)) + '' + (date.getDate()<10?'0'+date.getDate():date.getDate());
      //     console.log('过滤',date);
      //     let condition = (cellData == date);
      //     switch(range){
      //       case '=' : condition = (cellData == date);break;
      //       case '<' : condition = (cellData < date);break;
      //       case '<=' : condition = (cellData <= date);break;
      //       case '>' : condition = (cellData > date);break;
      //       case '>=' : condition = (cellData >= date);break;
      //       case '!=' : condition = (cellData != date);break;
      //     }
      //     if (condition) {
      //       return true;
      //     }
      //   }`,
      //   floatingFilterComponent: 'datepicker',
      //   floatingFilterComponentParams: {
      //     hasClear: true
      //   },
      //   viewComponentParams: { label: '标题', type:'string',  required: true, pattern: '^[0-9]*$', },
      //   viewComponent:'input',
      //   viewComponentResultEvent:'ufInputChange',
      //     valueFormatter: `(params)=>{
      //       // console.log('formatter', params)
      //       if (params.value  === undefined) {
      //           return 20200105;
      //       }
      //     }`
      // },
      // {
      //   label: '进度条',
      //   field: 'progress',
      //   width: 100,
      //   viewComponentParams: { color: 'accent' },
      //   viewComponent:'progress',
      //   valueFormatter: `(params)=>{
      //     console.log('formatter',params.value)
      //     if (params.value !== undefined) {
      //         return 80;
      //     } else {
      //         return 40;
      //     }
      //   }`
      // }
    ],
    data: [{ 'mode': null, 'request': 'GP', 'methid': 10, 'code': 'core.fnpoint.load', 'access': 'A', 'appid': 'frame', 'name': '核心.装载功能点', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A', 'input': '20200106' }, { 'mode': null, 'request': 'GP', 'methid': 11, 'code': 'core.fnpoint.multiload', 'access': 'A', 'appid': 'frame', 'name': '核心.批量装载功能点', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 15, 'code': 'fnpoint.autoload', 'access': 'A', 'appid': 'frame', 'name': '自动装载', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 16, 'code': 'fnpoint.autorun', 'access': 'A', 'appid': 'frame', 'name': '自动运行', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 20, 'code': 'fnpoint.load', 'access': 'A', 'appid': 'frame', 'name': '装载方法', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 25, 'code': 'fnpoint.method.multiload', 'access': 'A', 'appid': 'frame', 'name': '批量装载方法', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 51, 'code': 'fnpoint.function.list', 'access': 'A', 'appid': 'frame', 'name': '查询功能列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 55, 'code': 'fnpoint.function.add', 'access': 'A', 'appid': 'frame', 'name': '功能新增', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 56, 'code': 'fnpoint.function.delete', 'access': 'A', 'appid': 'frame', 'name': '删除功能', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'P', 'methid': 57, 'code': 'fnpoint.function.update', 'access': 'A', 'appid': 'frame', 'name': '修改功能', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 61, 'code': 'fnpoint.method.list', 'access': 'A', 'appid': 'frame', 'name': '查询方法列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 62, 'code': 'fnpoint.method.funclist', 'access': 'A', 'appid': 'frame', 'name': '查询方法的功能列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'P', 'methid': 65, 'code': 'fnpoint.method.add', 'access': 'A', 'appid': 'frame', 'name': '新增方法', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 66, 'code': 'fnpoint.method.delete', 'access': 'A', 'appid': 'frame', 'name': '删除方法', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'P', 'methid': 67, 'code': 'fnpoint.method.update', 'access': 'A', 'appid': 'frame', 'name': '修改方法', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 68, 'code': 'fnpoint.method.detail', 'access': 'A', 'appid': 'frame', 'name': '查询方法详情', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 69, 'code': 'fnpoint.immeload', 'access': 'A', 'appid': 'frame', 'name': '立即加载', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 70, 'code': 'fnpoint.app.list', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.应用.列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 71, 'code': 'fnpoint.app.add', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.应用.新增', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 72, 'code': 'fnpoint.app.delete', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.应用.删除', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 73, 'code': 'fnpoint.app.update', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.应用.更新', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 80, 'code': 'fnpoint.module.list', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.模块.列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 86, 'code': 'fnpoint.module.autoload.list', 'access': 'A', 'appid': 'frame', 'name': '查询自动加载列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'U', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 87, 'code': 'fnpoint.module.autorun.list', 'access': 'A', 'appid': 'frame', 'name': '查询自动运行列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'U', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 88, 'code': 'frame.module.autoload.tree', 'access': 'A', 'appid': 'frame', 'name': '模块.自动加载.树', 'funcid': 10, 'userid': 50, 'loadstatus': 'U', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 89, 'code': 'frame.module.autoload.save', 'access': 'A', 'appid': 'frame', 'name': '模块.自动加载保存', 'funcid': 10, 'userid': 50, 'loadstatus': 'U', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 100, 'code': 'system.info', 'access': 'S', 'appid': 'frame', 'name': '系统信息', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 101, 'code': 'thread.info', 'access': 'S', 'appid': 'frame', 'name': '线程信息', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 102, 'code': 'system.launch.msg', 'access': 'A', 'appid': 'frame', 'name': '系统启动消息', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 110, 'code': 'fnpoint.loadscript', 'access': 'A', 'appid': 'frame', 'name': '功能点.装载脚本', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 130, 'code': 'fnpoint.bug.list', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 131, 'code': 'fnpoint.bug.update.status', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.更新状态', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 132, 'code': 'fnpoint.bug.insert', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.新增bug', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 133, 'code': 'fnpoint.bug.update', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.修改bug', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 134, 'code': 'fnpoint.bug.user.list', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.用户.列表', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 135, 'code': 'fnpoint.bug.delete', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.bug.删除bug', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 200, 'code': 'fnpoint.application.desk', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.应用.desk', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 201, 'code': 'fnpoint.module.desk', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.模块.desk', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 203, 'code': 'fnpoint.function.desk', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.功能.desk', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 204, 'code': 'fnpoint.method.desk', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.方法.desk', 'funcid': 10, 'userid': 50, 'loadstatus': 'L', 'showbox': true, 'status': 'A' }, { 'mode': null, 'request': 'GP', 'methid': 206, 'code': 'fnpoint.bug.desk', 'access': 'A', 'appid': 'frame', 'name': 'fnpoint.BUG.desk', 'funcid': 10, 'userid': 50, 'loadstatus': 'U', 'showbox': false, 'status': 'A' }],
    onInit: ``,
    onSelected: "(res)=>{console.log('onSelected',res)}",
    ufQuery: `
      const param = this.cid('form').value;
      this.postData('/do/10.61', param, (res) => {
          this.data = res.data;
      });
    `,
    ufLoadChange: `(params,value,node)=>{
      node.setDataValue('loadstatus', 'L');
      setTimeout(()=>{
        node.setDataValue('loadstatus', 'U');
      },1000)
    }`,
    ufClickBtn: `(params) => {
      console.log(1,this)
      console.log(this)
      console.log(params)
    }`,
    ufClick: `(params)=>{
      console.log('2',params)
    }`,
    ufInputChange: `(params,value,node) => {
      node.setDataValue('input', value);
    }`,
    ufAdd: `(params)=>{
      console.log('ufAdd',params);
      console.log(this.data);
      console.log(this.data.indexOf(params));
      const data =  this.data
      data.unshift({});
      this.data = data;
    }`,
    ufSelect: `
      (data, row) => {
        console.log(data);
        console.log(row);
      }
    `,
    ufcheckbox: `
      (data, row) => {
        console.log(data, row);
      }
    `
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
    {
      "id": "dialog",
      "type": "common-dialog",
      "contentChild": {
        "id": "dialogForm",
        "type": "div-form",
        "childs": [
          {
            "id": "dialogTabs",
            "type": "tab-panel",
            "childs": [
              {
                "id": "attributeTab",
                "type": "div",
                "childs": [
                  {
                    "id": "funcid",
                    "type": "input-ctrl",
                    "name": "funcid",
                    "label": "功能标识",
                    "valueType": "string",
                    "useEmptyAsString": null,
                    "prefixHtml": null,
                    "suffixHtml": null,
                    "hidden": null,
                    "disabled": true,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "defaultValue": "",
                    "tip": null,
                    "local": "",
                    "onInit": "if (this.scope.defaultFuncid) {\r\n    // this.value = this.scope.defaultFuncid;\r\n    // this.scope.isFormChange = false;\r\n    this.setValue(this.scope.defaultFuncid, {emitEvent: false, onlySelf: true});\r\n} else {\r\n    this.disabled = false;\r\n}",
                    "onValueChange": "(e) => {\r\n    // console.log('=======funcid', e);\r\n}",
                    "style": {}
                  },
                  {
                    "id": "methid",
                    "type": "input-ctrl",
                    "name": "methid",
                    "label": "方法标识",
                    "valueType": "string",
                    "useEmptyAsString": null,
                    "prefixHtml": null,
                    "suffixHtml": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "defaultValue": null,
                    "tip": null,
                    "local": "",
                    "onInit": "this.disabled = this.scope.type === 'edit';",
                    "style": {}
                  },
                  {
                    "id": "code",
                    "type": "input-ctrl",
                    "name": "code",
                    "label": "编码",
                    "valueType": null,
                    "useEmptyAsString": null,
                    "prefixHtml": null,
                    "suffixHtml": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "defaultValue": null,
                    "tip": null,
                    "local": "",
                    "style": {}
                  },
                  {
                    "id": "name",
                    "type": "input-ctrl",
                    "name": "name",
                    "label": "名称",
                    "valueType": "string",
                    "useEmptyAsString": null,
                    "prefixHtml": null,
                    "suffixHtml": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "defaultValue": null,
                    "tip": null,
                    "local": "",
                    "style": {}
                  },
                  {
                    "id": "access",
                    "type": "select-ctrl",
                    "name": "access",
                    "label": "访问权限",
                    "valueType": null,
                    "isFilter": false,
                    "filterField": null,
                    "filterPlaceholder": null,
                    "options": [
                      {
                        "key": "I",
                        "value": "内部"
                      },
                      {
                        "key": "S",
                        "value": "会话"
                      },
                      {
                        "key": "A",
                        "value": "授权"
                      },
                      {
                        "key": "O",
                        "value": "开放"
                      },
                      {
                        "key": "T",
                        "value": "令牌"
                      }
                    ],
                    "hasClear": null,
                    "emptyLabel": null,
                    "isHtmlLabel": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "local": "",
                    "tip": null,
                    "defaultValue": "A",
                    "option": {
                      "label": "value",
                      "value": "key",
                      "primary": null
                    },
                    "style": {}
                  },
                  {
                    "id": "status",
                    "type": "select-ctrl",
                    "name": "status",
                    "label": "状态",
                    "valueType": null,
                    "isFilter": false,
                    "filterField": null,
                    "filterPlaceholder": null,
                    "options": [
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
                    ],
                    "hasClear": null,
                    "emptyLabel": null,
                    "isHtmlLabel": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "local": "",
                    "tip": null,
                    "defaultValue": "A",
                    "option": {
                      "label": "value",
                      "value": "key",
                      "primary": null
                    },
                    "style": {}
                  },
                  {
                    "id": "request",
                    "type": "multiselect-ctrl",
                    "name": "request",
                    "label": "请求",
                    "valueType": "string",
                    "isFilter": false,
                    "filterField": null,
                    "filterPlaceholder": null,
                    "canSelectAll": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "showType": "string",
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "options": [
                      {
                        "name": "GET",
                        "value": "G"
                      },
                      {
                        "name": "POST",
                        "value": "P"
                      },
                      {
                        "name": "HEAD",
                        "value": "H",
                        "disabled": true
                      },
                      {
                        "name": "OPTIONS",
                        "value": "O",
                        "disabled": true
                      },
                      {
                        "name": "PUT",
                        "value": "U",
                        "disabled": true
                      },
                      {
                        "name": "DELETE",
                        "value": "D",
                        "disabled": true
                      },
                      {
                        "name": "TRACE",
                        "value": "T",
                        "disabled": true
                      },
                      {
                        "name": "CONNECT",
                        "value": "C",
                        "disabled": true
                      }
                    ],
                    "defaultValue": [
                      "P"
                    ],
                    "local": "",
                    "tip": null,
                    "onClose": null,
                    "option": {
                      "label": "name",
                      "value": "value"
                    },
                    "style": {}
                  },
                  {
                    "id": "mode",
                    "type": "select-ctrl",
                    "name": "mode",
                    "label": "模式",
                    "valueType": null,
                    "isFilter": false,
                    "filterField": null,
                    "filterPlaceholder": null,
                    "options": [
                      {
                        "key": "R",
                        "value": "发行"
                      },
                      {
                        "key": "D",
                        "value": "调试"
                      }
                    ],
                    "hasClear": true,
                    "emptyLabel": null,
                    "isHtmlLabel": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": null,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "local": "",
                    "tip": null,
                    "defaultValue": null,
                    "option": {
                      "label": "value",
                      "value": "key",
                      "primary": null
                    },
                    "style": {}
                  },
                  {
                    "id": "getconv",
                    "type": "textarea-ctrl",
                    "name": "getconv",
                    "label": "GET映射",
                    "minrows": null,
                    "maxrows": null,
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": null,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "defaultValue": null,
                    "local": "",
                    "style": {
                      "flex": "100"
                    }
                  }
                ],
                "clsBoxing": null,
                "clsPadding": true,
                "clsMargin": null,
                "clsTopMargin": null,
                "hidden": null,
                "fullHeight": null,
                "name": "属性",
                "fxLayout": null,
                "local": {},
                "childStyle": {
                  "flex": "25"
                },
                "onCreate": "this.defaultChildStyle = {flex:\"25\"};",
                "style": {
                  "flex": "100"
                }
              },
              {
                "id": "procedureTab",
                "type": "div",
                "childs": [
                  {
                    "id": "main",
                    "type": "monaco-ctrl",
                    "name": "main",
                    "label": "主程序",
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": true,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "language": "qscript",
                    "height": null,
                    "isMaxHeight": true,
                    "tabSize": null,
                    "defaultValue": "",
                    "local": {},
                    "keyboardAction": [],
                    "style": {
                      "flex": "60",
                      "xs": {
                        "flex": "100"
                      }
                    }
                  },
                  {
                    "id": "comment",
                    "type": "monaco-ctrl",
                    "name": "comment",
                    "label": "备注",
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": null,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "language": "qscript",
                    "height": null,
                    "isMaxHeight": true,
                    "defaultValue": null,
                    "local": "",
                    "style": {
                      "flex": "40",
                      "xs": {
                        "flex": "100"
                      }
                    }
                  }
                ],
                "clsBoxing": null,
                "clsPadding": null,
                "clsMargin": null,
                "clsTopMargin": null,
                "hidden": null,
                "fullHeight": null,
                "name": "程序",
                "fxLayout": null,
                "local": {},
                "childStyle": "{\"flex\":\"50\",\"xs\":{\"flex\":\"100\"}}",
                "style": {
                  "flex": "100"
                }
              },
              {
                "id": "testTab",
                "type": "div",
                "childs": [
                  {
                    "id": "testFroup",
                    "type": "div",
                    "childs": [
                      {
                        "id": "testFormTitle",
                        "type": "html-ctrl",
                        "label": "请求",
                        "hidden": null,
                        "isOneLine": null,
                        "local": "",
                        "style": {
                          "flex": "100"
                        }
                      },
                      {
                        "id": "requestMethod",
                        "type": "select-ctrl",
                        "name": "requestMethod",
                        "label": "方式",
                        "valueType": "string",
                        "isFilter": false,
                        "filterField": null,
                        "filterPlaceholder": null,
                        "options": [
                          {
                            "key": "_get",
                            "name": "get"
                          },
                          {
                            "key": "_post",
                            "name": "post"
                          },
                          {
                            "key": "_file",
                            "name": "file"
                          },
                          {
                            "key": "_html",
                            "name": "html"
                          }
                        ],
                        "hasClear": null,
                        "emptyLabel": null,
                        "isHtmlLabel": null,
                        "hidden": null,
                        "disabled": null,
                        "passive": null,
                        "required": true,
                        "requiredErrorMsg": null,
                        "pattern": null,
                        "patternErrorMsg": null,
                        "local": "",
                        "tip": null,
                        "defaultValue": "_post",
                        "option": {
                          "label": "name",
                          "value": "key",
                          "primary": null
                        },
                        "style": {
                          "flex": "100"
                        }
                      },
                      {
                        "id": "requestAttr",
                        "type": "input-ctrl",
                        "name": "requestAttr",
                        "label": "属性",
                        "valueType": "string",
                        "useEmptyAsString": null,
                        "prefixHtml": null,
                        "suffixHtml": null,
                        "hidden": null,
                        "disabled": null,
                        "passive": null,
                        "required": null,
                        "requiredMsg": null,
                        "pattern": null,
                        "patternMsg": null,
                        "defaultValue": null,
                        "tip": null,
                        "local": "",
                        "style": {
                          "flex": "100"
                        }
                      },
                      {
                        "id": "requestParams",
                        "type": "monaco-ctrl",
                        "name": "requestParams",
                        "label": "参数",
                        "hidden": null,
                        "disabled": null,
                        "passive": null,
                        "required": null,
                        "requiredErrorMsg": null,
                        "pattern": null,
                        "patternErrorMsg": null,
                        "language": "json",
                        "height": null,
                        "isMaxHeight": true,
                        "tabSize": null,
                        "defaultValue": null,
                        "local": "",
                        "style": {
                          "flex": "100"
                        }
                      }
                    ],
                    "clsBoxing": null,
                    "clsPadding": null,
                    "clsMargin": null,
                    "clsTopMargin": null,
                    "hidden": null,
                    "local": "",
                    "childStyle": "",
                    "style": {
                      "flex": "35",
                      "xs": {
                        "flex": "100"
                      }
                    }
                  },
                  {
                    "id": "resultTabs",
                    "type": "tab-panel",
                    "childs": [
                      {
                        "id": "response",
                        "type": "div",
                        "childs": [
                          {
                            "id": "responseCode",
                            "type": "input-ctrl",
                            "name": "responseCode",
                            "label": "编码",
                            "valueType": null,
                            "useEmptyAsString": null,
                            "prefixHtml": null,
                            "suffixHtml": null,
                            "hidden": null,
                            "disabled": false,
                            "passive": null,
                            "required": null,
                            "requiredMsg": null,
                            "pattern": null,
                            "patternMsg": null,
                            "defaultValue": null,
                            "tip": null,
                            "local": "",
                            "style": {
                              "flex": "30",
                              "xs": {
                                "padding": "0"
                              },
                              "sm": {
                                "padding": "0 5px 0 0"
                              },
                              "md": {
                                "padding": "0 5px 0 0"
                              },
                              "gt_md": {
                                "padding": "0 5px 0 0"
                              }
                            }
                          },
                          {
                            "id": "responseMsg",
                            "type": "input-ctrl",
                            "name": "responseMsg",
                            "label": "信息",
                            "valueType": null,
                            "useEmptyAsString": null,
                            "prefixHtml": null,
                            "suffixHtml": null,
                            "hidden": null,
                            "disabled": false,
                            "passive": null,
                            "required": null,
                            "requiredMsg": null,
                            "pattern": null,
                            "patternMsg": null,
                            "defaultValue": null,
                            "tip": null,
                            "local": "",
                            "style": {
                              "flex": "70"
                            }
                          },
                          {
                            "id": "responseData",
                            "type": "monaco-ctrl",
                            "name": "responseData",
                            "label": "运行结果:",
                            "hidden": null,
                            "disabled": false,
                            "passive": null,
                            "required": null,
                            "requiredErrorMsg": null,
                            "pattern": null,
                            "patternErrorMsg": null,
                            "language": "json",
                            "height": null,
                            "isMaxHeight": true,
                            "tabSize": null,
                            "defaultValue": null,
                            "local": "",
                            "keyboardAction": [],
                            "style": {
                              "flex": "100"
                            }
                          }
                        ],
                        "clsBoxing": null,
                        "clsPadding": null,
                        "clsMargin": null,
                        "clsTopMargin": null,
                        "hidden": null,
                        "fullHeight": null,
                        "name": "应答",
                        "fxLayout": null,
                        "local": {},
                        "childStyle": {},
                        "style": {}
                      },
                      {
                        "id": "trace",
                        "type": "div",
                        "childs": [
                          {
                            "id": "traceReport",
                            "type": "html-dataset",
                            "clsBg": null,
                            "clsBoxing": null,
                            "clsPadding": null,
                            "clsMargin": null,
                            "clsTopMargin": null,
                            "hidden": null,
                            "local": {},
                            "template": "<textarea class=\"mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize cdk-text-field-autofill-monitored ng-pristine ng-valid ng-touched specil\" readonly><%{msg}%></textarea>",
                            "css": ".specil {\r\n  resize: none;\r\n  height: 500px;\r\n  font-family: Consolas;\r\n}",
                            "defaultData": {},
                            "script": "",
                            "data": {},
                            "style": {
                              "flex": "100",
                              "height": "500px"
                            }
                          }
                        ],
                        "clsBoxing": null,
                        "clsPadding": null,
                        "clsMargin": null,
                        "clsTopMargin": null,
                        "hidden": null,
                        "fullHeight": null,
                        "name": "trace",
                        "fxLayout": null,
                        "local": {},
                        "childStyle": "{\"flex\":\"100\"}",
                        "style": {}
                      },
                      {
                        "id": "htmlDiv",
                        "type": "div",
                        "childs": [
                          {
                            "id": "html",
                            "type": "html-dataset",
                            "clsBg": true,
                            "clsBoxing": true,
                            "clsPadding": null,
                            "clsMargin": null,
                            "clsTopMargin": null,
                            "hidden": null,
                            "hiddenLoading": null,
                            "local": {},
                            "template": "",
                            "css": "",
                            "defaultData": {},
                            "script": "",
                            "data": {},
                            "style": {
                              "height": "70vh"
                            }
                          }
                        ],
                        "clsBoxing": null,
                        "clsPadding": null,
                        "clsMargin": null,
                        "clsTopMargin": null,
                        "hidden": null,
                        "fullHeight": null,
                        "name": "页面",
                        "fxLayout": null,
                        "local": {},
                        "childStyle": {},
                        "style": {}
                      }
                    ],
                    "clsBoxing": null,
                    "clsPadding": null,
                    "clsMargin": null,
                    "clsTopMargin": null,
                    "hidden": null,
                    "titles": [
                      "应答",
                      "trace",
                      "页面"
                    ],
                    "tabsHidden": [
                      false,
                      true,
                      true
                    ],
                    "local": "",
                    "childStyle": {
                      "flex": "100"
                    },
                    "ufResetResult": "this.cid('responseCode').value = null;\r\nthis.cid('responseMsg').value = null;\r\nthis.cid('responseData').value = null;",
                    "onSelectedIndexChange": "(e) => {\r\n    this.root.layoutChange();\r\n}",
                    "style": {
                      "flex": "65"
                    }
                  }
                ],
                "clsBoxing": null,
                "clsPadding": null,
                "clsMargin": null,
                "clsTopMargin": null,
                "hidden": null,
                "fullHeight": null,
                "name": "测试",
                "fxLayout": null,
                "local": {},
                "childStyle": {},
                "style": {
                  "flex": "100"
                }
              },
              {
                "id": "jsonToTableTab",
                "type": "div",
                "childs": [
                  {
                    "id": "jsonToTableData",
                    "type": "monaco-ctrl",
                    "name": null,
                    "label": "data",
                    "hidden": null,
                    "disabled": null,
                    "passive": null,
                    "required": null,
                    "requiredErrorMsg": null,
                    "pattern": null,
                    "patternErrorMsg": null,
                    "language": "json",
                    "height": null,
                    "isMaxHeight": true,
                    "tabSize": null,
                    "defaultValue": null,
                    "local": "",
                    "style": {
                      "flex": "30"
                    }
                  },
                  {
                    "id": "jsonToTableDiv",
                    "type": "div",
                    "childs": [
                      {
                        "id": "jsonToTableDataSet",
                        "type": "jsonToTable-dataset",
                        "clsBoxing": null,
                        "clsPadding": null,
                        "clsMargin": null,
                        "clsTopMargin": null,
                        "isMaxHeight": false,
                        "hidden": null,
                        "data": "",
                        "local": "",
                        "style": {}
                      }
                    ],
                    "clsBoxing": null,
                    "clsPadding": null,
                    "clsMargin": null,
                    "clsTopMargin": null,
                    "hidden": null,
                    "fullHeight": true,
                    "fxLayout": null,
                    "local": "",
                    "childStyle": "",
                    "style": {
                      "flex": "70",
                      "width": "100%",
                      "height": "100%"
                    }
                  }
                ],
                "clsBoxing": null,
                "clsPadding": null,
                "clsMargin": null,
                "clsTopMargin": null,
                "hidden": null,
                "fullHeight": true,
                "name": "Json转表格",
                "fxLayout": null,
                "local": {},
                "childStyle": {},
                "style": {
                  "flex": "100"
                }
              },
              {
                "id": "helpTab",
                "type": "div",
                "childs": [
                  {
                    "id": "helpFrame",
                    "type": "iframe-dataset",
                    "clsBoxing": null,
                    "clsPadding": null,
                    "clsMargin": null,
                    "clsTopMargin": null,
                    "hidden": null,
                    "iframeSrc": "https://cdn.gtjaqh.cn/qscript/index.html",
                    "local": {},
                    "style": {}
                  }
                ],
                "clsBoxing": null,
                "clsPadding": null,
                "clsMargin": null,
                "clsTopMargin": null,
                "hidden": null,
                "fullHeight": true,
                "name": "帮助",
                "fxLayout": null,
                "local": {},
                "childStyle": {},
                "style": {
                  "flex": "100"
                }
              }
            ],
            "clsBoxing": null,
            "clsPadding": null,
            "clsMargin": null,
            "clsTopMargin": null,
            "hidden": null,
            "isLazy": false,
            "titles": [
              "属性",
              "功能点",
              "测试",
              "json",
              "帮助"
            ],
            "tabsHidden": [],
            "local": {},
            "childStyle": {
              "flex": "100"
            },
            "onInit": "this.tabsHidden = this.scope.type === 'add' ? [false, false, true, false]: [];\r\nif(this.scope.type === 'add'){\r\n    this.deleteTab(2);\r\n}",
            "onSelectedIndexChange": "(e) => {\r\n    this.root.layoutChange();\r\n}",
            "style": {
              "flex": "100"
            }
          }
        ],
        "isSetUrl": null,
        "clsBg": null,
        "hidden": null,
        "local": {},
        "fullHeight": null,
        "onStatusChange": "(status) => {\r\n    // console.log(status)\r\n    // console.log(this.dirty)\r\n    if (status === 'VALID' && this.dirty) {\r\n        this.cid('sureBtn') ? this.cid('sureBtn').disabled = false : null;\r\n    } else {\r\n        this.cid('sureBtn') ? this.cid('sureBtn').disabled = true : null;\r\n    }\r\n    // console.log('============statusChange');\r\n}\r\n",
        "ufBeforeRequest": "() => {\r\n    const data = {\r\n        'funcid': this.cid('funcid').value,\r\n        'methid': this.cid('methid').value,\r\n        'code': this.cid('code').value,\r\n        'name': this.cid('name').value,\r\n        'access': this.cid('access').value,\r\n        'status': this.cid('status').value,\r\n        'request': this.cid('request').value,\r\n        'mode': this.cid('mode').value,\r\n        'getconv': this.cid('getconv').value,\r\n        'main': this.cid('main').value,\r\n        'comment': this.cid('comment').value\r\n    };\r\n    if (data.main.trim().length === 0) {\r\n        this.src.tipDialog('主程序不能为空');\r\n        return false;\r\n    }\r\n    if (data.mode === undefined) {\r\n        data.mode = null;\r\n    }\r\n    data.request = data.request.join(\"\");\r\n    return data;\r\n}",
        "onValueChange": "(e) => {\r\n    // console.log('============valueChange', e);\r\n}",
        "onAllLoaded": "() => {\r\n    // console.log('============allLoaded');\r\n}",
        "style": {
          "flex": "100"
        }
      },
      "buttonChild": {
        "id": "dialogButtonChild",
        "type": "align",
        "frontChilds": [
          {
            "id": "saveLoadBtn",
            "type": "raised-button",
            "label": "加载并保存",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onClick": "const data = this.cid(\"dialogForm\").call('ufBeforeRequest');\r\nif (this.scope.type === 'add') {\r\n    this.postData('/do/10.65', data, (res) => {\r\n        this.local.isSave = true;\r\n        const param = {\r\n            fpid: data.funcid + '.' + data.methid\r\n        };\r\n        this.postData('/do/10.20', param, (res) => {\r\n            this.src.tipDialog(res.msg);\r\n        });\r\n    });\r\n} else {\r\n    data.fpid = data.funcid + '.' + data.methid;\r\n    this.postData('/do/10.69', data, (res) => {\r\n        // console.log('10.69 response', res);\r\n        this.src.tipDialog(res.msg);\r\n    });\r\n}",
            "style": {}
          },
          {
            "id": "jsonToTableButton",
            "type": "raised-button",
            "label": "转化成Table",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onClick": "()=>{\r\n    const data =this.cid('jsonToTableData').value;\r\n    this.cid('jsonToTableDataSet').data=data;\r\n}",
            "style": {}
          },
          {
            "id": "testBtn",
            "type": "raised-button",
            "label": "测试",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onClick": "() => {\r\n    this.cid('resultTabs').call('ufResetResult');\r\n    const resultTabStatus = [false, true, true];\r\n    const testFormData = {\r\n        'type': this.cid('requestMethod').value,\r\n        'attr': this.cid('requestAttr').value,\r\n        'params': this.cid('requestParams').value\r\n    };\r\n    let type = testFormData.type;\r\n    this.scope.testType = type;\r\n    const attr = testFormData.attr;\r\n    let params = {};\r\n    const fpid = this.cid('funcid').value + '.' + this.cid('methid').value;\r\n    const html = this.cid('html');\r\n    if (html) {\r\n        html.template = '';\r\n    }\r\n    let url = '/do/' + fpid;\r\n    if (attr) {\r\n        url += '/' + attr;\r\n        resultTabStatus[1] = false;\r\n    }\r\n    if (type === '_html') {\r\n        resultTabStatus[2] = false;\r\n        type = '_post';\r\n    }\r\n    try {\r\n        if (testFormData.params && testFormData.params !== '') {\r\n            params = eval(\"(\" + testFormData.params + \")\");\r\n        }\r\n    } catch {\r\n        this._service.tipDialog('输入查询参数有误，格式示例为标准的json对象');\r\n        return;\r\n    }\r\n\r\n    // console.log('testBtn click', url, testFormData);\r\n    switch (type) {\r\n        case '_get':\r\n            // console.log('GET data', testFormData);\r\n            this.getData(url, params, (res) => {\r\n                this.src.tipDialog('请求成功');\r\n                this.call('ufSetResponseForm', res);\r\n            }, (res) => {\r\n                this.call('ufSetResponseForm', res);\r\n            });\r\n            break;\r\n        case '_post':\r\n            // console.log('POST data', testFormData, params);\r\n            this.postData(url, params, (res) => {\r\n                this.src.tipDialog('请求成功');\r\n                this.call('ufSetResponseForm', res);\r\n            }, (res) => {\r\n                this.call('ufSetResponseForm', res);\r\n            });\r\n            break;\r\n        case '_file':\r\n            // console.log('File data', testFormData, params);\r\n            this.download(url, params, (res) => {\r\n                this.call('ufSetResponseForm', res);\r\n            }, (res) => {\r\n                this.call('ufSetResponseForm', res);\r\n            }, (res) => {\r\n                this.call('ufSetResponseForm', res);\r\n            });\r\n            break;\r\n    }\r\n    this.cid('resultTabs').tabsHidden = resultTabStatus;\r\n}",
            "ufSetResponseForm": "(data) => {\r\n    // 转化成Table\r\n    this.cid('jsonToTableData').value = JSON.stringify(data.data, undefined, 2);\r\n    this.cid('jsonToTableDataSet').data = data.data;\r\n\r\n    this.cid('responseCode').value = data.code + '';\r\n    this.cid('responseMsg').value = data.msg;\r\n    const html = this.cid('html');\r\n\r\n    if (typeof data.trace !== 'undefined') {\r\n        const traceMsg = data.trace;\r\n        delete data.trace;\r\n        const htmlData = {\r\n            msg: traceMsg ? this.call('ufFormatText', traceMsg) : ''\r\n        };\r\n        this.cid('traceReport').data = htmlData;\r\n    }\r\n    if (this.scope.testType === '_html') {\r\n        html.template = data.data;\r\n        html.style = data.style || '';\r\n    }\r\n    const responseData = data.code === 0 ? (typeof data.metadata === 'undefined' ? data.data : data) : data.where;\r\n    delete data.code;\r\n    delete data.msg;\r\n    console.log('测试返回数据', responseData, data);\r\n    this.cid('responseData').value = JSON.stringify(responseData, undefined, 2);\r\n\r\n\r\n}",
            "ufFormatText": "(string) => {\r\n    if (!string || string === '' || string === null) {\r\n        return;\r\n    }\r\n    string = string.replace(/\"/g, '\\n');\r\n    return string.replace(/\\\\n/g, '\\n');\r\n}",
            "style": {}
          }
        ],
        "middleChilds": [
          {
            "id": "sqlidcode",
            "type": "input-ctrl",
            "name": null,
            "label": "SQL",
            "valueType": null,
            "useEmptyAsString": null,
            "prefixHtml": null,
            "suffixHtml": null,
            "hidden": true,
            "disabled": null,
            "passive": null,
            "required": null,
            "requiredMsg": null,
            "pattern": null,
            "patternMsg": null,
            "defaultValue": "",
            "tip": "",
            "local": {},
            "style": {
              "height": "50px"
            }
          },
          {
            "id": "sqlBtn",
            "type": "raised-button",
            "label": "跳转",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": true,
            "disabled": null,
            "local": {},
            "onClick": "const sqlidcode=this.cid('sqlidcode').value;\r\nwindow.open('/#/fnpoint/desk/15.200?sqlidcode='+sqlidcode, '_blank');",
            "style": {}
          }
        ],
        "backChilds": [
          {
            "id": "sureBtn",
            "type": "raised-button",
            "label": "确认",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": null,
            "disabled": true,
            "local": {},
            "ufAddRequest": "(data) => {\r\n    this.postData('/do/10.65', data, (res) => {\r\n        this.root.close(0, res);\r\n        const param = {\r\n            fpid: data.funcid + '.' + data.methid\r\n        };\r\n        // this.postData('/do/10.20', param, (res) => {\r\n        //     this.src.tipDialog(res.msg);\r\n        // });\r\n    });\r\n}",
            "ufUpdateRequest": "(data) => {\r\n    this.postData('/do/10.67', data, (res) => {\r\n        this.root.close(0, res);\r\n    });\r\n    // data.fpid = data.funcid + '.' + data.methid;\r\n    // this.postData('/do/10.69', data, (res) => {\r\n    //     // console.log('10.69 response', res);\r\n    //     this.src.tipDialog(res.msg);\r\n    //     this.root.close(0, res);\r\n    // });\r\n}",
            "onClick": "() => {\r\n    const saveLoadBtn = this.cid('saveLoadBtn');\r\n    if (saveLoadBtn.local.isSave) {\r\n        this.root.close(1);\r\n        return;\r\n    }\r\n    const dialog = this.root;\r\n    const data = this.cid(\"dialogForm\").call('ufBeforeRequest');\r\n    if (!data) { return false; }\r\n    switch (this.scope.type) {\r\n        case 'add':\r\n            this.call('ufAddRequest', data);\r\n            break;\r\n        case 'edit':\r\n            this.call('ufUpdateRequest', data);\r\n            break;\r\n    }\r\n}",
            "style": {}
          },
          {
            "id": "cancelBtn",
            "type": "raised-button",
            "label": "取消",
            "icon": null,
            "tip": null,
            "tipPosition": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": null,
            "disabled": null,
            "local": {},
            "onClick": "const dialog = this.root;\r\nconst form = this.cid(\"dialogContent\");\r\nconst saveLoadBtn = this.cid('saveLoadBtn');\r\nif (saveLoadBtn.local.isSave) {\r\n    this.root.close(1);\r\n} else {\r\n    dialog.close(2, null);\r\n}",
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
        "onInit": "if (this.scope.type === 'edit') {\r\n    this.subs('dialogTabs', 'selectedIndexChange', (e) => {\r\n        console.log(e);\r\n        console.log(this.cid('dialogTabs'));\r\n        this.cid('saveLoadBtn').hidden = e === 0 || e === 1 ? false : true;\r\n        this.cid('testBtn').hidden = e !== 2;\r\n        this.cid('sureBtn').hidden = e === 2 ? true : false;\r\n        this.cid('sqlidcode').hidden = e !==1;\r\n        this.cid('sqlBtn').hidden = e !==1;\r\n         this.cid('jsonToTableButton').hidden = e !==3;\r\n    });\r\n}\r\nthis.cid('saveLoadBtn').hidden = this.scope.type === 'add';\r\n",
        "style": {
          "flex": "100"
        }
      },
      "title": null,
      "size": "full",
      "height": "height-def",
      "isClosedByESC": false,
      "hidden": null,
      "scope": {},
      "local": {},
      "onCreate": "this.title = this.scope.title;",
      "onBeforeClose": "(callback) => {\r\n    if (this.scope.isFormChange) {\r\n        this.openDialog('shared.operationDialog', { content: '有更改数据未保存，确认离开吗？' }, (e) => {\r\n            if (e === 0) {\r\n                this.dialogRef.close(callback);\r\n            }\r\n        })\r\n    } else {\r\n        this.dialogRef.close(callback);\r\n    }\r\n}",
      "onInit": "if (this.scope.data.funcid && this.scope.data.methid) {\r\n    const data = { funcid: this.scope.data.funcid, methid: this.scope.data.methid };\r\n    this.call('ufQuery', data);\r\n};",
      "ufQuery": "(data) => {\r\n    // console.log('==========dialog ufQuery', data);\r\n    this.postData('/do/10.68', data, (res) => {\r\n        if (res.code === 0) {\r\n            this.cid('dialogForm').value = res.data;\r\n            this.scope.isFormChange = false;\r\n            // this.cid('dialogForm').setValue(res.data, {emitEvent: false});\r\n        } else {\r\n            console.warn(res);\r\n        }\r\n    });\r\n}",
      "style": {
        "flex": "100"
      },
      "version": "2.5.4"
    },
    {
      "id": "shared.operationDialog",
      "type": "common-dialog",
      "contentChild": {
        "id": "content",
        "type": "html-ctrl",
        "label": null,
        "hidden": null,
        "isOneLine": null,
        "local": "",
        "onInit": "()=>{\r\n   const label= this.scope.content;\r\n    this.label='<span>'+label+'<span>';\r\n}",
        "style": {}
      },
      "buttonChild": {
        "id": "buttonGroup",
        "type": "align",
        "backChilds": [
          {
            "id": "sure",
            "type": "raised-button",
            "label": "确认",
            "icon": null,
            "tip": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": null,
            "disabled": null,
            "local": "",
            "onClick": "()=>{\r\n    this.cid('shared.operationDialog').close(0)\r\n}",
            "style": {}
          },
          {
            "id": "cancel",
            "type": "raised-button",
            "label": "取消",
            "icon": null,
            "tip": null,
            "top": null,
            "right": null,
            "bottom": null,
            "left": null,
            "color": null,
            "backgroundColor": null,
            "shape": "rectangle",
            "hidden": null,
            "disabled": null,
            "local": "",
            "onClick": "()=>{\r\n    this.cid('shared.operationDialog').close(1);\r\n}",
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
        "local": "",
        "childStyle": "",
        "style": {}
      },
      "title": null,
      "size": "small",
      "height": "height-tiny",
      "isClosedByESC": null,
      "hidden": null,
      "scope": null,
      "local": "",
      "onInit": "()=>{\r\n    console.log(this.scope)\r\n    const data= this.scope;\r\n    this.title=this.scope.title;\r\n}",
      "style": {}
    }
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
  component: AgGridTestComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes),
    ContainerModule,
    ReactiveFormsModule,
    DynamicComponentModule
  ],
  declarations: [
    AgGridTestComponent
  ],
  entryComponents: [
    AgGridTestComponent
  ]
})
export class AgGridTestModule {
}

