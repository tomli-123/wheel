import { Component, Input, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ComponentRef, Inject } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { ContainerConfig } from '../container/container.config';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dynamic-container',
  template: ``
})
export class DynamicContainerComponent implements OnDestroy {

  private currentComponent: ComponentRef<any>;

  constructor(private vcr: ViewContainerRef, private cfr: ComponentFactoryResolver, @Inject('appConfig') public appConfig) {
    // console.log('dynamic-container constructor');
  }

  // TODO @input 有用？
  @Input() set metadata(data: any) {
    if (data && JSON.stringify(data) !== '{}') {
      const compFactory = this.cfr.resolveComponentFactory(ContainerConfig.getContainerClass(data.type, this.appConfig.plugInfo));
      const component: any = this.vcr.createComponent(compFactory);
      const container: ContainerComponent = component.instance;
      component.instance.id = data.id;
      const index = data._index;
      if (index !== null && index !== undefined) { component.instance.index = index; }
      component.instance._metadata = data;
      delete data._parent;
      // container.create();
      // console.log('创建容器,id=' + container.id  , container);
      this.destroy();
      this.currentComponent = component;
    }
  }
  @Input() set parent(data: any) {
    if (this.currentComponent) {
      this.currentComponent.instance._parent = data;
    }
  }

  @Input() set data(data: any) {
    if (this.currentComponent) {
      this.currentComponent.instance._metadata.scope = data;
    }
  }

  getContainer() {
    // console.log(this.currentComponent.instance);
    return this.currentComponent.instance;
  }

  destroy() {
    if (this.currentComponent) {
      this.currentComponent.destroy();
      this.currentComponent = null;
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

}
