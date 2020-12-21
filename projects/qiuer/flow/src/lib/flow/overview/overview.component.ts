import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { FlowService } from '../flow.service';
import { DivFormLayoutMetadata, ControllerMetadata } from '@qiuer/component';
import { trigger, state, style, animate, transition } from '@angular/animations';
export interface FlowOverviewMetadata extends ContainerMetadata {
  controls?: ControllerMetadata[];
}
@Component({
  selector: 'overview-container',
  templateUrl: './overview.component.html',
  animations: [
    trigger('btnActive', [
      state('bottom', style({ transform: 'rotate(0deg)' })),
      state('top', style({ transform: 'rotate(180deg)' })),
      transition('bottom => top', [animate('0.2s')]),
      transition('top => bottom', [animate('0.2s')]),
    ]),
  ],
  styleUrls: ['./overview.component.scss']
})
export class FlowOverviewComponent extends ContainerComponent implements OnInit, AfterViewInit {

  public _metadata: FlowOverviewMetadata;
  public shareUrl = window.location.href; // 分享二维码
  @ViewChild('overview', { static: true }) overviewEle: ElementRef;
  public _formMetadata: DivFormLayoutMetadata; // overview From metadata数据
  public _printFormMetadata: DivFormLayoutMetadata; // overview 打印时表单数据

  private _controls: ControllerMetadata[];

  constructor(public _service: ContainerService, public _fs: FlowService, public renderer2: Renderer2) {
    super(_service);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                 */
  /***********************************************************************************/
  public set controls(controls: ControllerMetadata[]) {
    if (controls && controls instanceof Array) {
      this._formMetadata = {
        id: 'overview',
        type: 'div-form',
        childStyle: { flex: '50', xs: { flex: '50' }, sm: { flex: '50' }, md: { flex: '50' }, gt_md: { flex: '50' } },
        onInit: `
          () => {
            const _userInfo = this.parent._fs.userInfo;
            const _overview = this.scope['overview'] || {};
            _overview['initiator'] = _overview['initiator'] || _userInfo['name'] || '';
            _overview['department'] = _overview['department'] || _userInfo['deptname'] || '';
            _overview['contact'] = _overview['contact'] || _userInfo['cellphone'] || '';
            if (!_overview.title) { _overview.title = _overview.initiator + '的' + this.parent._fs.name + '申请'; }
            this.setValue(_overview, {emitEvent: false});
            // console.log('====overview=onInit===', _userInfo, _overview, this.parent._fs.name);
            // console.log('====overview=onInit===', Object.assign({}, _overview));
            this.parent.setHtmlStr(this.getValue(true,true,true));
          }
        `,
        onValueChange: `
          () => {
            this.parent.setHtmlStr(this.getValue(true, true ,true));
          }
        `,
        childs: controls
      };
      // console.log(this._formMetadata);
      this._controls = controls;
      const _controls = JSON.parse(JSON.stringify(controls));
      const _htmlChild = _controls.filter(control => control.type === 'html-dataset');
      _htmlChild.map(child => { child.id = child.id.replace('_readOnly_', '_print_'); child.hidden = false; });
      this._printFormMetadata = {
        id: 'print_overview',
        type: 'div-form',
        childStyle: { flex: '50', xs: { flex: '50' }, sm: { flex: '50' }, md: { flex: '50' }, gt_md: { flex: '50' } },
        childs: _htmlChild
      };
    }
  }
  public get controls() {
    return this._controls;
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  // 切换总览显示状态
  _packSwitch() {
    const overviewEle = this.overviewEle.nativeElement.querySelector('.overCard');
    this.packSwitch(overviewEle);
  }
  packSwitch(el) {
    this._fs.pack = !this._fs.pack;
    if (this._fs.pack) {
      this.renderer2.setStyle(el, 'height', '9px');
      this.renderer2.setStyle(el, 'overflow-y', 'hidden');
    } else {
      this.renderer2.removeStyle(el, 'height');
      this.renderer2.setStyle(el, 'overflow-y', 'auto');
    }
  }
  openShareDialog() {
    this.openDialog('shared.qrcodeDialog', { url: window.location.href });
  }

  private getPrintControls(controls: any[]) { // 添加打印和只读状态的html-dataset控件
    const printControls = [];
    controls.forEach(control => {
      printControls.push(control);
      const readOnly = {
        id: '_readOnly_' + control.id,
        type: 'html-dataset',
        template: `<div class="item"><span class="label flow-theme-disabled-color">${control.label}：<%{value}%></span></div>`,
        hidden: control.hidden || !control.disabled,
        local: {}
      };
      const _style = `.label{font-size: 12px;color: #777;}.txt{font-size: 14px;}.item{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
        height: 25px;margin-bottom: 10px;padding: 0px 5px;}`;
      readOnly['css'] = _style;
      if (control['style']) { readOnly['style'] = control['style']; }
      if (control['options']) { readOnly.local['options'] = control['options']; }
      printControls.push(readOnly);
    });
    return printControls;
  }

  setHtmlStr(value) {
    // console.log(value);
    if (value && value instanceof Object) {
      const loopData = ['initiator', 'inittime', 'department', 'contact', 'priority', 'security', 'title'];
      loopData.forEach(key => {
        let str = value[key] || value[key] === 0 ? value[key] : '';
        if (this.cid('_readOnly_' + key) && this.cid('_readOnly_' + key).local['options']) {
          const _arr = this.cid('_readOnly_' + key).local['options'].filter(option => option.value === str);
          _arr.length > 0 ? str = _arr[0].key : str = '';
        }
        if (this.cid('_readOnly_' + key)) { this.cid('_readOnly_' + key)['data'] = { value: str }; }
        // console.log(this.cid('_readOnly_' + key));
        if (this.cid('_print_' + key)) { this.cid('_print_' + key)['data'] = { value: str }; }
        if (this.cid(key) && this.cid(key)['disabled']) {
          this.cid(key).hidden = true;
        }
      });
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    if (this._metadata.controls && this._metadata.controls instanceof Array) {
      this.controls = this.getPrintControls(this._metadata.controls);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
}
