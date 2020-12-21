/***********************************************************************************/
/* author: 武俊
/* update logs:
/* 2019/6/10 武俊 创建
/***********************************************************************************/
import { OnInit, OnDestroy, Component } from '@angular/core';
import { ContainerService, ContainerMetadata } from '@qiuer/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';

export interface PanelLayoutMetadata extends LayoutMetadata {
  childs?: ContainerMetadata[];
}

@Component({ template: '' })
export abstract class PanelLayoutComponent extends LayoutComponent implements OnInit, OnDestroy {

  constructor(public _service: ContainerService) {
    super(_service);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public setHidden(metadata: any): boolean {
    if (metadata && metadata instanceof Object) {
      return this._isChildHidden(metadata['id']);
    }
  }

}
