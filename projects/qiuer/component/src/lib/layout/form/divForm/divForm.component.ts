import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormLayoutComponent, FormLayoutMetadata } from '../form.component';
import { FormService } from '../form.service';
import { ContainerMetadata, ContainerService } from '@qiuer/core';

export interface DivFormLayoutMetadata extends FormLayoutMetadata {
  childs: ContainerMetadata[];
  fullHeight?: boolean; // 是否撑满页面高度
}
@Component({
  selector: 'divform-layout',
  styleUrls: ['./divForm.component.scss'],
  templateUrl: './divForm.component.html'
})

export class DivFormLayoutComponent extends FormLayoutComponent implements OnInit, OnDestroy {

  protected _metadata: DivFormLayoutMetadata;
  public _isActive = false;
  public _isDialogActive = false;
  public _defaultChildStyle = {
    xs: { flex: '100' }, sm: { flex: '50' }, md: { flex: '50' }, gt_md: { flex: '25' },
  };
  public _specialChildStyle: any = {
    'blank-ctrl': { flex: '100' },
    'textarea-ctrl': { flex: '100' },
    'ueditor-ctrl': { flex: '100' },
    'monaco-ctrl': { flex: '100' },
    'markdown-dataset': { flex: '100' },
    'splitline-ctrl': { flex: '100' }
  };

  constructor(public _service: ContainerService, public _formService: FormService, public renderer2: Renderer2) {
    super(_service, _formService, renderer2);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.fullHeight = !!this._metadata.fullHeight;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public set fullHeight(fullHeight: boolean) {
    if (this.root['dialogData'] && this.root['dialogData'] instanceof Object) {
      this._isDialogActive = fullHeight;
    } else {
      this._isActive = fullHeight;
    }
  }
  public get fullHeight(): boolean {
    return this._isActive || this._isDialogActive;
  }
}
