import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../../dist/qiuer/core';
import { HttpClient } from '@angular/common/http';

@Component({
  template: `<main [metadata]="metadata"> </main>`
})

export class DropTableTestComponent implements OnInit {

  metadata = [];

  dropTable = {
    type: 'dropTable-dataset',
    // 行数据
    rows: [
      { title: '张江', contentLength: 8, id: '1' },
      { title: '数码通', contentLength: 8, id: '2' },
      { title: '学习', contentLength: 3, id: '3' },
    ],
    // 列数据
    columns: [
      { title: '周一', contentLength: 5, id: '1' },
      { title: '周二', id: '2' },
      { title: '周三', id: '3' },
      { title: '周四', id: '4' },
      { title: '周五', id: '5' }
    ],
    contentLength: 3, // 默认可容纳数量 ？


    // 默认可用数量
    items: [
      { name: '张倩', availableLength: 2, id: '1' }, { name: '钮本严', id: '2' },
      { name: '朱巍', id: '3' },
      { name: '王里', id: '4' }, { name: '狄运', id: '5' }, { name: '贾磊', id: '6' },
      { name: '林清将', id: '7' }, { name: '陆淑芳', id: '8' }, { name: '潘露露', id: '9' },
      { name: '沈超', id: '10' }, { name: '宋倩倩', id: '11' }, { name: '王慧芳', id: '12' },
      { name: '谢祥', id: '13' },
      { name: '杨强伟', id: '14' }, { name: '姚琦', id: '15' }, { name: '殷亮亮', id: '16' },
      { name: '曾晓文', id: '17' }, { name: '邹术杰', id: '18' }, { name: '莫银银', id: '19' },
      { name: '武俊', id: '20' }
    ],

    item: {
      label: 'name', key: 'id', availableLength: 3,  // 可用数量 ？
    },

    // 展示数据
    data: {
      direction: 'RC', // direction: RC(行包列)/CR(列包行)
      data: [
        {
          id: '1', // 第一行
          data: [
            {
              id: '1', // 第一列
              data: ['1', '2', '3']
            }, {
              id: '2',
              data: ['1', '2', '3']
            }
          ]
        }
      ]
    }
  };

  content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.dropTable]
  };

  constructor() {

  }

  ngOnInit() {
    this.metadata = [this.content];
  }

}

const reportRoutes: Routes = [{
  path: '',
  component: DropTableTestComponent
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
    DropTableTestComponent
  ],
  entryComponents: [
    DropTableTestComponent
  ]
})
export class DropTableTestModule {
}
