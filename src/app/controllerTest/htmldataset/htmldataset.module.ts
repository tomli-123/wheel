import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class HtmlDatasetTestComponent implements OnInit {

  metadata = [];

  htmlDataset = {
    type: 'html-dataset',
    id: 'html',
    template: `
      <div class="head">
        <div style="btn-wrap">
          <button id="query" class="button blue" onclick=<%( query(this) )%> >查询</button>
        </div>
      </div>
    `,
    css: `
    .head {
      height: 3rem;
      /* min-width: 800px; */
      margin-left: .5rem;
    }
    .button {
      display: inline-block;
      zoom: 1; /* zoom and *display = ie7 hack for display:inline-block */
      *display: inline;
      vertical-align: baseline;
      margin: 0 2px;
      outline: none;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font: 14px/100% Arial, Helvetica, sans-serif;
      padding: .5em 2em .55em;
      text-shadow: 0 1px 1px rgba(0,0,0,.3);
      -webkit-border-radius: .5em;
      -moz-border-radius: .5em;
      border-radius: .5em;
      -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
      -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
      box-shadow: 0 1px 2px rgba(0,0,0,.2);
    }
    .button:hover {
      text-decoration: none;
    }
    .button:active {
      position: relative;
      top: 1px;
    }
    .btn-wrap {
      position: relative;
    }
    #query {
      position: absolute;
      top: 50%;
      transform: translateY(-75%);
    }
    .blue {
      color: #d9eef7;
      border: solid 1px #0076a3;
      background: #0095cd;
      background: -webkit-gradient(linear, left top, left bottom, from(#00adee), to(#0078a5));
      background: -moz-linear-gradient(top,  #00adee,  #0078a5);
      filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#00adee', endColorstr='#0078a5');
    }
    .blue:hover {
      background: #007ead;
      background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));
      background: -moz-linear-gradient(top,  #0095cc,  #00678e);
      filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0095cc', endColorstr='#00678e');
    }
    .blue:active {
      color: #80bed6;
      background: -webkit-gradient(linear, left top, left bottom, from(#0078a5), to(#00adee));
      background: -moz-linear-gradient(top,  #0078a5,  #00adee);
      filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0078a5', endColorstr='#00adee');
    }
    `,
    script:
    {
      query: `function query(el, event) {
        const assetacc = this.cid('assetacc').value;
        if (!assetacc) {
          this.src.tipDialog('客户资产账号不能为空！');
          return;
        }
        console.log('-------------------------');
        // this.call('ufQueryData', assetacc);
        this.postData('/do/3031.11', { assetacc }, (res) => {
          // console.log('res=========================', res);
          // this.cid('baseicContent').call('ufInit', res.data);
          // this.call('ufQueryTag', assetacc);
          // this.call('ufQueryQualifications', assetacc);
          // this.call('ufQueryEcharts', assetacc);
          // console.log('queryBtn-ufQueryData end');
        });
      }`
    }

  };



  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.htmlDataset]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
  }



}

const reportRoutes: Routes = [{
  path: '',
  component: HtmlDatasetTestComponent
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
    HtmlDatasetTestComponent
  ],
  entryComponents: [
    HtmlDatasetTestComponent
  ]
})
export class HtmlDatasetTestModule {
}
