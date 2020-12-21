import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]='metadata'> </main>`
})

export class TreeDatasetTestComponent implements OnInit {

  treeData = [{
    article_id: null,
    nodes: [{
      article_id: null,
      nodes: [{
        article_id: 'S0uGzfU',
        weight: 100,
        pid: 31,
        id: 36,
        label: '业务简介',
        href: 'https://www.gtjaqh.com/pc/c/S0uGzfU.html',
        url: null,
        status: 'A'
      }],
      weight: 99,
      pid: 18,
      id: 31,
      label: '量化交易',
      href: null,
      url: null,
      status: 'A'
    }, {
      article_id: null,
      nodes: [{
        article_id: 'CgXj9O2',
        weight: 100,
        pid: 37,
        id: 38,
        label: '特定品种',
        href: 'https://www.gtjaqh.com/pc/c/CgXj9O2.html',
        url: null,
        status: 'A'
      }, {
        article_id: 'DVfsQDE',
        weight: 99,
        pid: 37,
        id: 170,
        label: '外商独资',
        href: 'https://www.gtjaqh.com/pc/c/DVfsQDE.html',
        url: null,
        status: 'A'
      }, {
        article_id: 'Bn6xuFH',
        weight: 98,
        pid: 37,
        id: 169,
        label: '合格境外机构',
        href: 'https://www.gtjaqh.com/pc/c/Bn6xuFH.html',
        url: null,
        status: 'A'
      }],
      weight: 98,
      pid: 18,
      id: 37,
      label: '国际业务',
      href: null,
      url: null,
      status: 'A'
    }, {
      article_id: null,
      nodes: [{
        article_id: 'S0pDN78',
        weight: 100,
        pid: 45,
        id: 46,
        label: '部门介绍',
        href: 'https://www.gtjaqh.com/pc/c/am-department_intro.html',
        url: null,
        status: 'A'
      }, {
        article_id: 'S0pEoI9',
        weight: 99,
        pid: 45,
        id: 171,
        label: '团队介绍',
        href: 'https://www.gtjaqh.com/pc/c/am-team_intro.html',
        url: null,
        status: 'A'
      }, {
        article_id: null,
        weight: 98,
        pid: 45,
        id: 162,
        label: '资管官网',
        href: 'https://am.gtjaqh.com',
        url: 'https://am.gtjaqh.com',
        status: 'A'
      }],
      weight: 97,
      pid: 18,
      id: 45,
      label: '资产管理',
      href: null,
      url: null,
      status: 'A'
    }, {
      article_id: null,
      weight: 96,
      pid: 18,
      id: 210,
      label: '业务中心',
      href: null,
      url: null,
      status: 'C'
    }],
    weight: 99,
    pid: null,
    id: 18,
    label: '机构金融',
    href: null,
    url: null,
    status: 'A'
  }];

  flatTree = [
    { cid: 1, cpid: null, aid: '001', label: '机构金融' },
    { cid: 10, cpid: 1, aid: '010', label: '业务简介' },
    { cid: 11, cpid: 1, aid: '011', label: '量化交易' },
    { cid: 2, cpid: null, aid: '002', label: '业务中心' },
    { cid: 20, cpid: 2, aid: '020', label: '部门介绍' },
    { cid: 21, cpid: 2, aid: '021', label: '资产管理' },
    { cid: 210, cpid: 21, aid: '210', label: '资管官网' },
    { cid: 211, cpid: 21, aid: '211', label: '团队介绍' },
    { cid: 2100, cpid: 210, aid: '2100', label: '特定品种' },
    { cid: 2101, cpid: 210, aid: '2101', label: '外商独资' },
    { cid: 3, cpid: null, aid: '001', label: '合格境外机构' }
  ];

  metadata = [];

  treedataset = {
    id: 'treedataset',
    type: 'tree-dataset',
    indent: null,
    verticalSpacing: 'verticalSpacing_def',
    filterFields: [
      'name'
    ],
    hidden: null,
    isCheck: true,
    isMultiple: true,
    isCheckStyle: true,
    isDrop: true,
    local: {},
    selected: [],
    // data: this.treeData,
    data: this.flatTree,
    // option: {
    //   name: 'label',
    //   value: 'id',
    //   children: 'nodes'
    // },
    option: {
      name: 'label',
      value: 'aid',
      id: 'cid',
      pid: 'cpid'
    },
    style: {},
    onInit: `
    `,
    onSelected: `
      console.log(this.data);
      console.log(this.selected);
    `,
    onDrop: `(a,b,c) => {
      console.log(a);
      console.log(b);
      console.log(c);
    }`,
    onSetCustomizeLabel: `
    (node) => {
      return '<span class="qf icon-account-multiple"></span>'+node.name
    }
    `
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.treedataset]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }



}

const reportRoutes: Routes = [{
  path: '',
  component: TreeDatasetTestComponent
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
    TreeDatasetTestComponent
  ],
  entryComponents: [
    TreeDatasetTestComponent
  ]
})
export class TreeDatasetTestModule {
}
