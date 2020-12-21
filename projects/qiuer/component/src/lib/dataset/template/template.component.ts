import {
  Component, OnInit, ViewContainerRef, ComponentRef, ViewChild, Renderer2,
  ElementRef, Compiler, Injector, NgModuleRef, NgModule, OnDestroy, CompilerFactory, AfterViewInit
} from '@angular/core';
import { ContainerService, MatSharedModule, ContainerModule } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export interface TemplateDatasetMetadata extends DatasetMetadata {
  template?: any;
  css?: string; // css字符串
  component?: string; // component字符串
}

@Component({
  selector: 'template-dataset',
  styleUrls: ['./template.component.scss'],
  templateUrl: './template.component.html'
})
export class TemplateDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  public _metadata: TemplateDatasetMetadata;
  private _css: string;
  private _template: any;
  private _component: string;
  private _isInit = true;

  @ViewChild('hostTemplate', { read: ViewContainerRef }) hostTemplate: ViewContainerRef;
  private cmpRef: ComponentRef<any>;

  private compiler: Compiler;
  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef,
    public renderer2: Renderer2, private injector: Injector,
    private moduleRef: NgModuleRef<any>, public sanitizer: DomSanitizer) {
    super(_service, _ds, el, renderer2);

    const compilerFactory: CompilerFactory = platformBrowserDynamic().injector.get(CompilerFactory);
    this.compiler = compilerFactory.createCompiler([{ useJit: true }]);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set css(css: string) { this._css = css || ''; if (!this._isInit) { this.createComponent(); } }
  public get css(): string { return this._css; }

  public set template(template: any) { this._template = template || ''; if (!this._isInit) { this.createComponent(); } }
  public get template(): any { return this.cmpRef?.instance; }

  public set component(component: string) {
    component = component ? component.substring(0, component.lastIndexOf('}') - 1).replace('export class DynClass {', '') : '';
    this._component = `
      const _class = class {
        ${component || ''}
      }
      return _class;
    `;
    if (!this._isInit) { this.createComponent(); }
  }
  public get component(): string { return this._component; }

  /***********************************************************************************/
  /*                              内部方法                                           */
  /***********************************************************************************/
  createComponent(): void {

    if (this.cmpRef) { this.cmpRef.destroy(); }

    const template: string = this._template;
    const styles = [this.css];
    const _fn = new Function(this.component)();
    const TmpCmpConstructor_ = _fn;

    const tmpCmp = Component({ template, styles })(TmpCmpConstructor_);
    // 初始化模块
    const tmpModule = NgModule({
      imports: [CommonModule, MatSharedModule, ContainerModule],
      // , ComponentModule, ChartModule, MarkDownModule
      declarations: [tmpCmp],
      // declarations: [tmpCmp],
      // providers: []
    })(class { });

    // 组件和模块编译，并注入到当前组件模板hostMenu内
    this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        this.cmpRef = f.create(this.injector, [], null, this.moduleRef);
        this.cmpRef.instance['parent'] = this;
        this.cmpRef.instance.name = 'template-dynamic-component';
        this.hostTemplate.insert(this.cmpRef.hostView);
      });
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.css = this._metadata.css || '';
    this.template = this._metadata.template || '';
    this.component = this._metadata.component || '';
    this._isInit = false;
    this.createComponent();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.cmpRef) { this.cmpRef.destroy(); }
  }

}
