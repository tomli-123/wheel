import {
  Component, OnInit, ViewContainerRef, ComponentRef, ViewChild,
  Compiler, Injector, NgModuleRef, NgModule, OnDestroy, CompilerFactory
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerService, MatSharedModule } from '@qiuer/core';
import { ButtonComponent, ButtonMetadata } from '../button.component';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export class MenuData {
  child?: Array<MenuData>;
  label?: string;
  icon?: string;
  disabled?: string;
}

export class MenuOption {
  child?: string;
  label?: string;
  icon?: string;
}

export interface MenuDatasetMetadata extends ButtonMetadata {
  label?: string; // 按钮展示
  shape?: string; // 按钮形状 rectangle: 方形   circle: 大圆  mini-circle: 小圆  basic:基本按钮  stroked:轻触按钮  flat:扁平化按钮
  option?: MenuOption; // 配置字段

  // onCheck?: string; // 点击事件
  // onOpen?: string; // 有子节点button点击时事件
}

@Component({
  selector: 'menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuButtonComponent extends ButtonComponent implements OnInit, OnDestroy {

  @ViewChild('hostMenu', { read: ViewContainerRef }) hostMenu: ViewContainerRef;
  private cmpRef: ComponentRef<any>;

  public _label: string;
  public _shape: string;
  public _option: MenuOption = {
    child: 'child', label: 'label', icon: 'icon'
  };
  public flatData: Array<any> = [];
  public _data: any; // 可视化数据

  private menu_id = 0;

  private compiler: Compiler;

  // private compiler: Compiler,
  constructor(public _service: ContainerService,
    private injector: Injector, private moduleRef: NgModuleRef<any>) {
    super(_service);

    const compilerFactory: CompilerFactory = platformBrowserDynamic().injector.get(CompilerFactory);
    this.compiler = compilerFactory.createCompiler([{ useJit: true }]);

  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set label(label: string) {
    this._label = label;
  }
  public get label(): string {
    return this._label;
  }

  public set option(option: MenuOption) {
    if (option instanceof Object) {
      this._option['child'] = option['child'] || 'child';
      this._option['icon'] = option['icon'] || 'icon';
      this._option['label'] = option['label'] || 'label';
    }
  }
  public get option(): MenuOption {
    return this._option;
  }

  public set shape(shape: string) {
    switch (shape) {
      case 'rectangle': this._shape = 'mat-raised-button'; break;
      case 'circle': this._shape = 'mat-fab'; break;
      case 'mini-circle': this._shape = 'mat-mini-fab'; break;
      case 'basic': this._shape = 'mat-button'; break;
      case 'stroked': this._shape = 'mat-stroked-button'; break;
      case 'flat': this._shape = 'mat-flat-button'; break;
    }
  }
  public get shape(): string {
    return this._shape;
  }

  public set data(data: any) {
    this._data = data;
    if (this.cmpRef) { this.cmpRef.destroy(); }
    const tmp = this.parsingTemplate([{ child: data }]);
    this.createComponent(tmp);
  }
  public get data(): any { return this._data; }

  /***********************************************************************************/
  /*                              内部方法                                           */
  /***********************************************************************************/
  _BtnClick(id): void {
    const _data = this.flatData.filter(item => item.menu_id === id);
    if (_data.length !== 0) {
      this.onClickChangeSubject.next(_data[0]);
    }
  }

  parsingTemplate(tree): string {
    const stack = tree; const templateData = [];
    const data = []; const pidList = []; const that = this; const tmpArr = [];
    while (stack.length !== 0) {
      const shift = stack.shift(); const children = shift[this.option.child];
      shift['menu_id'] = `menu_id_${that.menu_id}`;
      data.push(shift);
      if (children) {
        pidList.push(`menu_id_${that.menu_id}`);
        for (let i = 0; i < children.length; i++) {
          stack.push(children[i]);
        }
      }
      that.menu_id += 1;
    }
    for (const item of pidList) {
      const _obj = data.filter(_item => _item.menu_id === item)[0];
      templateData.push({
        tel: '',
        child: _obj[this.option.child],
        id: _obj.menu_id
      });
    }
    for (let i = 0; i < templateData.length; i++) {
      const item = templateData[i];
      let tmp = '';
      for (const _item of item.child) {
        const hasClick = _item[this.option.child] instanceof Array && _item[this.option.child].length > 0;
        tmp += `
        <button mat-menu-item ${_item['disabled'] ? '[disabled]="getDisabled(' + _item['disabled'] + ')"' : ''}
            ${hasClick ? '[matMenuTriggerFor]="' + _item.menu_id + '"' : ''}
            ${hasClick ? '' : '(click)="parent._BtnClick(\'' + _item.menu_id + '\')"'}>
          <mat-icon class="qf ${_item[this.option.icon] || ''}"></mat-icon>
          <span>${_item[this.option.label] || ''}</span>
        </button>`;
      }
      tmp = `<mat-menu #${i === 0 ? 'singleMenu' : item.id}="matMenu">${tmp}</mat-menu>`;
      tmpArr.push(tmp);
    }
    this.flatData = data;
    return `
    <button mat-button color="primary" class="buttonContent {{parent.shape}} mat-primary"
      [disabled]='parent.disabled || parent._pending' [matTooltip]="parent.tip"
      [matTooltipClass]="{'pre-line':true}" [ngStyle]="parent._ngStyle"
      [matTooltipPosition]="parent.tipPosition" [matMenuTriggerFor]="singleMenu">
      <mat-icon *ngIf="parent._icon" class="qf {{parent.icon}}"></mat-icon>
      <span>{{parent.label}}</span>
    </button>
    ${tmpArr.join('\n')}
    `;
  }

  createComponent(template: string): void {
    const styles = []; const that = this;
    const TmpCmpConstructor = function() {
      this.parent = that;
    };
    const tmpCmp = Component({ template, styles })(new TmpCmpConstructor().constructor);
    // 初始化模块
    const tmpModule = NgModule({
      imports: [CommonModule, MatSharedModule],
      declarations: [tmpCmp],
      // declarations: [tmpCmp],
      providers: [
        // { provide: Compiler, useFactory: xie_createJitCompiler }
      ]
    })(class { });

    // 组件和模块编译，并注入到当前组件模板hostMenu内
    this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        this.cmpRef = f.create(this.injector, [], null, this.moduleRef);
        this.cmpRef.instance.name = 'menu-dynamic-component';
        this.hostMenu.insert(this.cmpRef.hostView);
      });
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata: MenuDatasetMetadata = this._metadata;
    this.label = metadata['label'];
    this.shape = metadata['shape'] || 'mat-raised-button';
    this.data = metadata['data'] || [];
    this.option = metadata['option'];
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.cmpRef) { this.cmpRef.destroy(); }
  }

}
