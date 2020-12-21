import { Component, OnInit, Renderer2, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

class Option {
  nodes?: string; // 节点名；
  value?: string; // 选中的value字段;
  label?: string; // 展示的label;
}

export interface TreeoverlayControllerMetadata extends ControllerMetadata {
  options?: object[];
  multiSelect?: boolean;
  option?: Option;
  canHoverData?: boolean; // 是否可以hover显示数据 默认不显示
  hoverLength?: number; // hover显示数据长度 默认显示前十条
}

@Component({
  selector: 'treeoverlay-ctrl',
  templateUrl: './treeoverlay.component.html',
  styleUrls: ['./treeoverlay.component.scss'],
})
export class TreeoverlayControllerComponent extends ControllerComponent implements OnInit {
  protected _metadata: TreeoverlayControllerMetadata;
  public _options: object[];
  public multiSelect = false;
  public _option: Option = {
    nodes: 'nodes',
    label: 'label',
    value: 'value'
  };
  public _value: Array<any> = [];
  public displayName = '';
  public showSelect = false; // 是否显示已选择的数据，默认不显示
  public _canHoverData = false;
  public _hoverLength: number;
  public selectTip: string; // 显示已选择数据

  @ViewChild(CdkOverlayOrigin, { static: true }) _overlayOrigin: CdkOverlayOrigin;
  @ViewChild('overlay', { static: true }) overlayTemplate: TemplateRef<any>;
  public overlayRef: any;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, public renderer2: Renderer2, public overlay: Overlay,
    public viewContainerRef: ViewContainerRef) {
    super(_service, _ctrlService);
  }

  showOverlay(): void {
    if (this.overlayRef && !this.overlayRef.hasAttached() && !this._formControl.disabled) {
      this.overlayRef.attach(new TemplatePortal(this.overlayTemplate, this.viewContainerRef));
    }
  }

  overlayInit(): void {
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this._overlayOrigin.elementRef)
      .withPositions([{ offsetX: 5, offsetY: -20, originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }]);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this._overlayOrigin.elementRef.nativeElement.offsetWidth - 10,
      hasBackdrop: true,
      backdropClass: '_overlay_container_'
    });
    this.overlayRef.backdropClick().subscribe(res => { this.overlayRef.detach(); });
  }

  checkEvent(e, type?: string): void {
    let valid_obj = [];
    let valid_value = [];
    if (e && e instanceof Array) {
      valid_obj = e.filter(item => !item[this._option.nodes]);
      valid_value = valid_obj.map(item => item[this._option.value]);
    }
    if (!this.multiSelect && valid_obj.length > 0) {
      this.displayName = valid_obj[0][this._option.label];
    }
    if (JSON.stringify(this._value) !== JSON.stringify(valid_value) && !type) {
      this._formControl.setValue(valid_value);
      this._value = valid_value;
    }
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set options(options: Array<object>) {
    this._options = options;
    if (!this.multiSelect) {
      const selected = this._ctrlService.getTreeValue(options, this._value, this._option);
      if (selected.length > 0) { this.displayName = selected[0][this._option.label]; }
    }
  }
  public get options(): Array<object> { return this._options; }

  public set option(option: Option) {
    const fakeOption: Option = this._service.copy(this._option);
    if (option && option instanceof Object) {
      for (const i of Object.keys(option)) {
        fakeOption[i] = option[i];
      }
    }
    this._option = fakeOption;
  }
  public get option(): Option {
    return this._option;
  }
  public set value(value) {
    this._value = this.formatValueAsArray(value);
    this._formControl.setValue(value);
  }

  public get value(): any {
    return this._formControl.value;
  }

  private formatValueAsArray(value: any): any {
    if (value instanceof Array === false) {
      return [value];
    } else { return value; }
  }
  public get urlParam(): string {
    if (this.multiSelect === true) {
      return null;
    } else {
      return this.value;
    }
  }
  public set urlParam(urlParam: string) {
    const param = this.transFromParam(urlParam);
    this.value = param;
  }

  public set canHoverData(canHoverData: boolean) {
    this._canHoverData = !!canHoverData;
  }

  public get canHoverData(): boolean {
    return this._canHoverData;
  }

  public set hoverLength(hoverLength: number) {
    this._hoverLength = hoverLength;
  }

  public get hoverLength(): number {
    return this._hoverLength;
  }

  _setSelectTip(val: any[]): void {
    let htmlStr = '';
    let newHtml = '';
    this.options.forEach(element => {
      const option = this.option;
      htmlStr += val.indexOf(element[option.value]) > -1 ? element[option.label] + '\n' : '';
    });
    // console.log('**************' + htmlStr);
    if (htmlStr.split('\n').length > (this.hoverLength + 1)) {
      let select = [];
      select = htmlStr.split('\n').slice(0, this.hoverLength);
      for (const item of select) {
        newHtml += item + '\n';
      }
      newHtml += '......';
      this.selectTip = newHtml;
    } else {
      this.selectTip = htmlStr;
    }
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this._value = this._formControl.value || [];
    const metadata = this._metadata;
    this.multiSelect = !!metadata.multiSelect;
    this.canHoverData = this._metadata.canHoverData;
    this.hoverLength = this._metadata.hoverLength || 10;
    this.option = metadata.option || {};
    this.options = metadata.options || [];
    if (this.canHoverData) {
      this.subs(this.id, 'valueChange', (e) => { this._setSelectTip(e); });
    }
    setTimeout(() => { this.overlayInit(); }, 500);
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

}
