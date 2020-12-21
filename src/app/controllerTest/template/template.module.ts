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
  template: `
  <main [metadata]="metadata"> </main>
  `
})

// <main [metadata]='metadata'> </main>
export class TemplateTestComponent implements OnInit {

  metadata = [];

  template = {
    id: 'template',
    type: 'template-dataset',
    css: `
    /* :host {
      background: #0081cc;
    }
    .testClass {
      color: red;
    } */
    
    .example-box.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .example-chip .cdk-drop-list-dragging {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .example-card {
      max-width: 400px;
    }
    
    .example-header-image {
      background-image: url('https://material.angular.io/assets/img/examples/shiba1.jpg');
      background-size: cover;
    }
    
    .example-margin {
      margin: 0 10px;
    }
    `,
    template: `
      <span class="testClass">123</span>
      <span>456</span>
      <span class="testClass">123</span>
<span>456</span>

{{testLabel}}

<!-- <main [metadata]="metadata"> </main> -->

<mat-checkbox class="example-margin">Checked</mat-checkbox>

<mat-icon class="qf icon-calculator"></mat-icon>


<mat-chip-list class="example-chip" >
  <mat-chip class="example-box" >
    123
  </mat-chip>
</mat-chip-list>
    `,
    component: `
    export class DynClass {
      /**
       * 内容写在此内，注意类名不可改
       */
    metadata = [];
    preview = {
      id: 'preview',
      type: 'preview-dataset',
      fileType: 'mp4',
      url: 'https://background.cowtransfer.com/assets/1219life.mp4',
      style: {
        height: '200px'
      }
    };
    
    
    vegetables = [
        {name: 'apple'},
        {name: 'banana'},
        {name: 'strawberry'},
        {name: 'orange'},
        {name: 'kiwi'},
        {name: 'cherry'},
      ];
    
    content = {
      id: 'content',
      type: 'content',
      bootstrap: true,
      childs: [this.preview]
    };
    testLabel = '模板值测试';
    constructor() { console.log('===constructor==='); }
    ngOnInit() {
      this.metadata = [this.content];
    }
  }
    `
  };

  button = {
    type: 'raised-button',
    id: 'button',
    label: '查看模板',
    onClick: `() => {
      console.log(this.cid('template').template);
    }`
  }
  // template
  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.button, this.template]
  };

  constructor() { }

  ngOnInit() {
    this.metadata = [this.content];
    const text = `
    export class DynClass {
      /**
       * 内容写在此内，注意类名不可改
       */
      metadata = [];
    preview = {
      id: 'preview',
      type: 'preview-dataset',
      fileType: 'mp4',
      url: 'https://background.cowtransfer.com/assets/1219life.mp4',
      style: {
        height: '200px'
      }
    };
    
    
    vegetables = [
        {name: 'apple'},
        {name: 'banana'},
        {name: 'strawberry'},
        {name: 'orange'},
        {name: 'kiwi'},
        {name: 'cherry'},
      ];
    
    content = {
      id: 'content',
      type: 'content',
      bootstrap: true,
      childs: [this.preview]
    };
    testLabel = '模板值测试';
    constructor() { console.log('===constructor==='); }
    ngOnInit() {
      this.metadata = [this.content];
    }
    }
    `;


    // const _test = text.substring(0, text.lastIndexOf('}') - 1).replace('export class DynClass {', '')
    // console.log(_test);

  }

}

const reportRoutes: Routes = [{
  path: '',
  component: TemplateTestComponent
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
    TemplateTestComponent
  ],
  entryComponents: [
    TemplateTestComponent
  ]
})
export class TemplateTestModule {
}
