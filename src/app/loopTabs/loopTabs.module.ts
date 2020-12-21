import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, } from '@angular/forms';
import { DynamicComponentModule, ContainerModule, MatSharedModule } from '../../../dist/qiuer/core';
import { FormControl, Validators } from '@angular/forms';



class BeeKeeper {
  hasMask: boolean;
}

class ZooKeeper {
  nametag: string;
}

class Animal {
  numLegs: number;
}

class Bee extends Animal {
  keeper: BeeKeeper;
}

class Lion extends Animal {
  keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

@Component({
  templateUrl: './loopTabs.component.html'
})

export class LoopTabsTestComponent implements OnInit {

  public black = {
    id: 'div2',
    type: 'div',
    childs: [
      {
        id: 'black1',
        type: 'html-dataset',
        template: `<div style="background-color: blue; width: 200px;height: 600px"></div>`
      }
    ]
  };

  public black2 = {
    id: 'div1',
    type: 'div',
    childs: [
      {
        id: 'black2',
        type: 'html-dataset',
        template: `<div style="background-color: blue; width: 200px;height: 600px"></div>`
      }
    ]
  };

  public form = {
    id: 'form',
    type: 'div-form',
    clsBoxing: true,
    clsPadding: true,
    style: {
      backgroundColor: '#ffffff'
    },
    name: 'xixixi',
    childs: [
      {
        type: 'html-dataset',
        id: 'formHeader',
        template: `
        <div class="person_header">
          <div class="person_header_left">
            <span class="proc_border_bgcolor" style="width:5px;height:25px;margin: 0px;"></span>
            <span class="qf icon-receipt proc_border_color proc_title_icon"></span>
            <span style="font-size:16px;" onclick=<%( test() )%> >表单</span>
          </div>
        </div>
        `,
        css: `
          .person_header {
            width: 100%;
            height: 40px;
            position: relative;
            display: flex;
          }
          .person_header_left {
            display: flex;
            flex: 1;
            align-items: center;
          }
          .person_header_left span {
            display: inline-block;
            margin: 0px 5px;
          }
          .proc_title_icon {
            font-size: 24px;
          }
        `,
        script: `
          {
            test: function test() {
              console.log('触发触发');
            }
          }
        `
      },
      {
        type: 'radio-ctrl',
        id: 'biztype',
        required: true,
        options: [
          { value: '1', name: '数据查询' },
          { value: '2', name: '后台设置' },
          { value: '3', name: '网络相关' },
          { value: '4', name: '服务器维护相关' },
          { value: '5', name: '其他' }
        ],
        option: { label: 'name' },
        style: { flex: '100' }
      },
      {
        id: '_blank1',
        type: 'blank-ctrl'
      },
      {
        type: 'datepicker-ctrl',
        id: 'deadtime',
        required: true,
        label: '期望最晚完成时间'
      },
      {
        id: 'reason',
        type: 'textarea-ctrl',
        required: true,
        label: '申请内容或理由'
      },
      {
        id: 'monacoForJavascript', type: 'monaco-ctrl', label: 'javascript', language: 'javaScript', height: '300px'
      },
      {
        id: 'button1',
        type: 'raised-button',
        label: '测试1',
        shape: 'rectangle',
        onClick: `
          console.log(this.cid('form'));
          console.log(this.cid('form').value);
        `
      },
      this.black2
    ],
    onSetElement: `(data) => {
      console.log('onSetElement', data, this);
    }`,
    onGetElement: `() => {
      console.log('onGetElement', this.cid('form').value);
      return this.cid('form').value;
    }`
  };

  public tab = {
    id: 'tab',
    type: 'loopTab-panel',
    child: this.form,
    style: {},
    onSelectedIndexChange: `
      console.log(this.cid('form'));
    `,
    onInit: `this.data = [
      { label: '标题1', data: {} },
      { label: '标题2', data: {} }
    ]`
  };

  public testTab = {
    id: 'testTab',
    type: 'tab-panel',
    childs: [this.form],
    style: {},
    isLoop: true,
    onSelectedIndexChange: `
      // console.log(this['data']);
    `,
    onInit: `this.data = [
      { label: '<span style="color: red">标题1</span>', data: {} },
      { label: '标题2', data: {} }
    ]`
  };

  button = {
    id: 'button',
    type: 'raised-button',
    label: '测试',
    shape: 'rectangle',
    onClick: `
      console.log(this.cid('testTab'));
      console.log(this.cid('testTab').data);
    `
  };

  public content = {
    id: 'content',
    type: 'content',
    bootstrap: true,
    childs: [this.black, this.testTab, this.button]
  };

  testJson = {
    metadata: [
      this.content
    ]
  };

  public _formControl: FormControl;

  // 弱密码校验 数字字母组成， 7到32位
  lowRegExp = new RegExp(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{8,32}$/);
  patternMsg = 'xxxxxxxxxxxxxxxxx';
  name: 'xx';

  // 默认密码校验 数字字母组成， 长度密码管理中所设置长度到32位   不含账户名 不得包含连续5个相同或连续字符


  constructor() { }

  ngOnInit() {
    const _validators = [
      // Validators.pattern(this.lowRegExp)
    ];
    this._formControl = new FormControl({
      value: ''
    }, _validators); // 缺少Validators
    this._formControl.setValue(null);
  }

  test() {
    // console.log(this._formControl.value);
    // const val = this._formControl.value;
    // const bool = this.lowRegExp.test(val);
    // console.log(bool);
    const a = createInstance(Lion);
    const b = createInstance(Bee);
    console.log('a', a.keeper);
    console.log('b', b.keeper);
  }

  identity<T>(arg: T) {
    console.log(arg);
    // console.log(T);
  }

  // createInstance<A extends Animal>(c: new () => A): A {
  //   return new c();
  // }

  /**
  var reg = /([0-9a-zA-Z])\1{2}/;
  //注意此处不要添加边界符号(^和$)
  var str = "!@$#12aaa3444da33dddd@#$%%$#";
  var tmp = reg.test(str); // tmp = true;
  // 探究reg中\1的作用
  // 设reg =  /([0-9a-zA-Z])\n{2}/;
  n=1, 匹配str中的aaa;
  n=2, 匹配str中的444;
  n=3, 匹配str中的ddd(前一个);
  n=4, 匹配str中的ddd(后一个);
  */
}

const reportRoutes: Routes = [{
  path: '',
  component: LoopTabsTestComponent
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
    LoopTabsTestComponent
  ],
  entryComponents: [
    LoopTabsTestComponent
  ]
})
export class LoopTabsTestModule {
}

