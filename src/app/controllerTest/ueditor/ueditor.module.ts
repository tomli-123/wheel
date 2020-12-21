import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
// import { DynamicComponentModule } from '@qiuer/core';
// import { MainContainerComponent } from '../../projects/qiuer/core/src/lib/main/main.component';
// import { ContainerModule } from '../../../../projects/qiuer/core/src/lib/container/container.module';
// import { MatSharedModule } from '../../../../projects/qiuer/core/src/lib/custom/share/mat.share.module';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]='metadata'> </main>`
})

export class UEditorTestComponent implements OnInit {

  metadata = [];

  htmlStr = `
  <!DOCTYPE html>
<html lang=en>

<head>
  <meta charset=UTF-8>
  <meta name=viewport content=width=device-width, initial-scale=1.0>
  <meta http-equiv=X-UA-Compatible content=IE=Edge, chrome=1>
  <title>公司公告</title>
</head>

<body>
  <div class=local>
    <a href=javascript:;>首页</a> / <em style=font-style: normal;>公司概况</em>
  </div>
  <div class=content clearFloat>

    <!-- 内容部分 -->
    <div class=article fl>
      <div class=article-info>
        <div class=i_title section clearFloat>
          <span class=p-tit fl></span>
          <h2 class=p-title fl>公司简介</h2>
        </div>
        <div class=article-txt>
          <span>
            一些内容
          </span>
        </div>
      </div>
    </div>

    <!-- 导航栏部分 -->
    <div class=nav fl>
      <div class=nav-info>
        <ul class=menuk>
          <li>
            <h3>
              <a href=javascript:;>
                <i class=nav-icon></i>
                公司概况
              </a>
            </h3>
            <ul>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=profiles>公司简介</a>
              </li>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=culture>公司文化</a>
              </li>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=history>公司历程</a>
              </li>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=structure>组织架构</a>
              </li>
            </ul>
          </li>
          <li>
            <h3>
              <a href=javascript:;>
                <i class=nav-icon></i>
                公司治理
              </a>
            </h3>
            <ul>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=rule>公司章程</a>
              </li>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=nominate>股东提名候选懂事的程序</a>
              </li>
            </ul>
          </li>
          <li>
            <h3>
              <a href=javascript:;>
                <i class=nav-icon></i>
                定期报告
              </a>
            </h3>
            <ul>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=finance_reports>财务报告</a>
              </li>
              <li>
                <div class=nav-dot>▪ </div>
                <a href=javascript:; data-name=csr_reports>社会责任报告/环境、社会及管治报告</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</body>

</html>`;

  btn = {
    id: 'uEditor',
    type: 'raised-button',
    label: null,
    icon: 'icon-magnify',
    tip: '测试',
    tipPosition: 'above',
    top: null,
    right: null,
    bottom: null,
    left: null,
    shape: 'circle',
    disabled: null,
    hidden: null,
    local: {},
    style: {},
    onClick: `
      console.log(this.cid('uEditor'));
      console.log(this.cid('uEditor').allHtml);
      console.log(this.cid('uEditor').value);
    `
  };

  uEditor = {
    id: 'uEditor',
    type: 'ueditor-ctrl',
    name: 'content',
    label: '周报内容',
    height: 200,
    hidden: null,
    disabled: null,
    passive: null,
    required: null,
    requiredErrorMsg: null,
    pattern: null,
    patternErrorMsg: null,
    defaultValue: '',
    local: {},
    isMaxHeight: null,
    style: {},
    hasImgUpload: true,
    imageActionName: 'ipc.ueditor.upload.do',
    videoActionName: 'www.admin.resource.upload',
    serverUrl: '/upload/3500.24',
    imageRemoteServerPath: 'https://cdn2.gtjaqh.cn/vis/images/R_YX_VIS/'
    , onUEReady: `
    console.log(this.ueditor);
    // window['UE'].execCommand('insertHtml', '<div>123123123</div>');
    this.ueditor.Instance.execCommand('insertHtml', \`${this.htmlStr}\`);
    `,
    funTypeMenu: {
      base: ['*'],
      paragraph: ['*'],
      font: ['subscript'],
      table: ['subscript'],
      file: ['*']
    },
    rowMenuLength: [
      10, 5, 20
    ]
  };

  multiSelect = {
    id: 'multiSelect',
    type: 'multiselect-ctrl',
    name: null,
    label: '展示的功能图标',
    valueType: null,
    showType: 'string',
    hidden: null,
    disabled: null,
    passive: null,
    hasFilter: null,
    filterField: null,
    filterPlaceholder: null,
    filterValue: null,
    canSelectAll: true,
    canHoverData: null,
    hoverLength: null,
    options: [
      {
        label: '基础',
        value: 'base'
      },
      {
        label: '段落',
        value: 'paragraph'
      },
      {
        label: '字体',
        value: 'font'
      },
      {
        label: '表格',
        value: 'table'
      },
      {
        label: '文件',
        value: 'file'
      },
      {
        label: '其他',
        value: 'other'
      }
    ],
    required: null,
    requiredErrorMsg: null,
    pattern: null,
    patternErrorMsg: null,
    defaultValue: '',
    tip: '',
    onClose: '',
    local: {},
    option: {
      label: 'label',
      value: 'value'
    },
    onValueChange: `(val) => {
      const _loopData = [];
      for (const item of val) {
        loopData.push({
           type: this.options.find(_item => _item.value === item),
           data: this.scope[item]
        });
      }
      console.log(_loopData);
      // this.cid('funTypeLoop').data = _loopData;
    }`,
    style: {}
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.btn, this.uEditor]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }



}

const reportRoutes: Routes = [{
  path: '',
  component: UEditorTestComponent
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
    UEditorTestComponent
  ],
  entryComponents: [
    UEditorTestComponent
  ]
})
export class UEditorTestModule {
}
