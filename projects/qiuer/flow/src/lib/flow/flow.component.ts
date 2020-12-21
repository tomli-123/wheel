import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

import { RootComponent, ContainerService, ContainerMetadata } from '@qiuer/core';

import { FlowService } from './flow.service';
import { FlowApprovalListMetadata } from './approvalList/approvalList.component';
import { FlowOverviewMetadata } from './overview/overview.component';
import { FlowButtonMetadata } from './button/button.component';

import { DivFormLayoutMetadata, RaisedButtonMetadata } from '@qiuer/component';

export class State {
  name: string;
  state: string;
}
export class FormData {
  data: any;
  status: string;
}
export interface FlowMetadata extends ContainerMetadata {
  name: string; // 流程名称
  states: Array<State>; // 流程状态列表
  formChild: DivFormLayoutMetadata;
  isFake: boolean; // 是否开启测试
  prockey: string; // 流程id 如 workSheet
  action: Array<any>; // 流程功能列表
  formIdList: Array<string>; // 流程表单内需要disabled的容器id列表
  statesConfig: Array<any>; // 对应流程节点的配置数据

  // event
  onSave: string;
  onSubmit: string;
  onCirculate: string;
  onPrint: string;
  onShift: string;
  onClose: string;
  onFake: string;
}

@Component({
  selector: 'flow-container',
  animations: [
    trigger('leftMask', [
      state('hidden', style({ left: '-450px', opacity: 0 })),
      state('show', style({ left: '0px', opacity: 1 })),
      transition('hidden => show', [animate('0.2s')]),
      transition('show => hidden', [animate('0.2s')])
    ])
  ],
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent extends RootComponent implements OnInit, AfterViewInit, OnDestroy {

  public _metadata: FlowMetadata;
  public _formChild: DivFormLayoutMetadata;
  public states: State[];
  public _prockey: string;
  public action: Array<any>; // 按钮打开对应sheetId 和postId
  public formIdList: Array<string>; // 需要disabled的表单元素id数组
  public statesConfig: Array<any>; // 节点配置数据
  public sheetInitData: any = {}; // bottomSheet初始化options等数据
  public sheetData: any = {}; // bottomSheet填充数据
  public currentConfig: any = {}; // 当前节点配置数据

  readonly baseData: any = Object.assign({}, this.scope);

  public metadata: any = {
    initiator: { id: 'initiator', type: 'input-ctrl', disabled: false, hidden: false, required: true, label: '发起人' },
    inittime: { id: 'inittime', type: 'datepicker-ctrl', disabled: false, hidden: false, required: true, label: '日　期', defaultValue: new Date() },
    department: { id: 'department', type: 'input-ctrl', disabled: false, hidden: false, required: true, label: '部　门' },
    contact: { id: 'contact', type: 'input-ctrl', disabled: false, hidden: false, required: true, label: '联　系' },
    priority: { id: 'priority', type: 'select-ctrl', disabled: false, hidden: false, required: true, label: '缓　急', options: [{ key: '一般', value: 0 }, { key: '加急', value: 1 }, { key: '特急', value: 2 }], valueType: 'number', option: { label: 'key', value: 'value' }, defaultValue: 0 },
    security: { id: 'security', type: 'select-ctrl', disabled: false, hidden: false, required: true, label: '密　级', options: [{ key: '一般', value: 0 }, { key: '秘密', value: 1 }, { key: '机密', value: 2 }, { key: '绝密', value: 3 }], valueType: 'number', option: { label: 'key', value: 'value' }, defaultValue: 0 },
    title: { id: 'title', type: 'input-ctrl', disabled: false, hidden: false, required: true, label: '标　题', style: { flex: '100' } },
    save: { id: 'save', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '保存', icon: 'icon-content-save', onClick: 'this.root.call("onSave");' },
    submit: { id: 'submit', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '提交', icon: 'icon-checkbox-marked-circle-outline', onClick: 'this.root.call("onSubmit");' },
    circulate: { id: 'circulate', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '传阅', icon: 'icon-book-open-page-variant', onClick: 'this.root.call("onCirculate");' },
    shift: { id: 'shift', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '转办', icon: 'icon-share', onClick: 'this.root.call("onShift");' },
    close: { id: 'close', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '关闭', icon: 'icon-close-circle-outline', onClick: 'this.root.call("onClose");' },
    print: { id: 'print', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '打印', icon: 'icon-printer', onClick: 'this.root.printPage();' },
    fake: { id: 'fake', type: 'raised-button', shape: 'circle', disabled: false, hidden: false, tip: '测试提交', icon: 'icon-bug', style: { backgroundColor: '#FF4081' }, onClick: 'this.root.call("onFake");' }
  };
  public _onSave: Function;
  public _onSubmit: Function;
  public _onCirculate: Function;
  public _onShift: Function;
  public _onClose: Function;
  public _onPrint: Function;
  public _onReject: Function;
  public _onFake: Function;

  @ViewChild('infoEle', { static: true }) infoEle: ElementRef;
  @ViewChild('formEle', { static: true }) formEle: ElementRef;
  public _overviewMetadata: FlowOverviewMetadata;
  public _approvalListMetadata: FlowApprovalListMetadata;
  public _buttonMetadata: FlowButtonMetadata;
  public _formId: string;
  private main_Ele: any; // main-content Element
  constructor(public _service: ContainerService, public renderer2: Renderer2,
    public bottomSheet: MatBottomSheet, public _overlayContainer: OverlayContainer,
    public route: ActivatedRoute, public _fs: FlowService) {
    super(_service);
  }

  public hiddenButtons = [];
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                 */
  /***********************************************************************************/
  public get initiator(): any { return this.cid('initiator'); }
  public get inittime(): any { return this.cid('inittime'); }
  public get department(): any { return this.cid('department'); }
  public get contact(): any { return this.cid('contact'); }
  public get priority(): any { return this.cid('priority'); }
  public get security(): any { return this.cid('security'); }
  public get title(): any { return this.cid('title'); }
  public get form(): any { return this.cid(this._formId); }
  public get overview(): any { return this.cid('overview'); }

  public get pid(): any { return this.scope['pid'] || null; }
  public get tid(): any { return this.scope['tid'] || null; }
  public get ticket(): any { return this.scope['ticket'] || null; }
  public get state(): any { return this.scope['state'] || null; }
  public get opinions(): any { return this.scope['opinions'] || null; }
  public set prockey(prockey: string) {
    this._prockey = prockey || '';
    this.scope['prockey'] = this._prockey;
  }
  public get prockey(): string { return this._prockey; }
  public set name(name: string) { if (name) { this._fs.name = name; } }
  public get name(): string { return this._fs.name || ''; }

  public set onSave(onSave: string) { this._onSave = this._compileCallbackFunction(onSave); this.metadata.save.hidden = !onSave; }
  public set onSubmit(onSubmit: string) { this._onSubmit = this._compileCallbackFunction(onSubmit); this.metadata.submit.hidden = !onSubmit; }
  public set onCirculate(onCirculate: string) { this._onCirculate = this._compileCallbackFunction(onCirculate); this.metadata.circulate.hidden = !onCirculate; }
  public set onShift(onShift: string) { this._onShift = this._compileCallbackFunction(onShift); this.metadata.shift.hidden = !onShift; }
  public set onClose(onClose: string) { this._onClose = this._compileCallbackFunction(onClose); this.metadata.close.hidden = !onClose; }
  public set onFake(onFake: string) { this._onFake = this._compileCallbackFunction(onFake); this.metadata.fake.hidden = !onFake; }

  public set onPrint(onPrint: string) { if (onPrint) { this._onPrint = this._compileCallbackFunction(onPrint); } }

  public set formChild(formChild: DivFormLayoutMetadata) {
    // formChild 和 formChild.id 一定存在
    if (formChild) {
      this._formId = formChild.id;
      this._formChild = formChild;
    }
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  public pageInit() {
    const _pid = this.scope['pid']; const _state = this.scope['state'];
    if ('opinions' in this.scope) { this.sheetInitData['opinions'] = this.scope.opinions; }
    if (_pid) {
      this.setControls({
        disabled: ['initiator', 'inittime', 'department', 'contact', 'priority', 'security', 'title', 'formChild'],
        hidden: ['save', 'submit', 'circulate', 'shift', 'close', 'fake']
      });
    } else {
      const _controlsState = { disabled: [], hidden: ['submit'] };
      const stateIndex = this.statesConfig.filter(_item => _item.state === _state);
      this.action = stateIndex.length > 0 ? stateIndex[0].stateActions : this.statesConfig.length > 0
        ? this.statesConfig[0]['stateActions'] || [] : this._metadata.action ? this._metadata.action : [];
      const submitKeys = ['$reject', 'submit', 'multiSubmit', 'userSubmit', 'postSubmit'];
      if (this.statesConfig && this.statesConfig instanceof Array) {
        if (!!_state) {
          for (let j = 0; j < this.statesConfig.length; j++) {
            if (this.statesConfig[j]['state'] === _state) { this.currentConfig = this.statesConfig[j] || {}; }
          }
        } else { this.currentConfig = this.statesConfig && this.statesConfig instanceof Array ? this.statesConfig[0] || {} : {}; }
        if (this.action && this.action instanceof Array) {
          const btnKeyList = this.action.map(item => item['value']);
          let hiddenButtons = btnKeyList.filter(item => this.currentConfig['showButtons'].indexOf(item) === -1);
          let disabledButtons = this.currentConfig['disabledButtons'].filter(item => submitKeys.indexOf(item) === -1);
          const hiddenSubmit = submitKeys.every(item => hiddenButtons.indexOf(item) > -1);
          hiddenButtons = hiddenSubmit ? [...hiddenButtons.filter(item => submitKeys.indexOf(item) === -1), ...['submit']] :
            hiddenButtons.filter(item => submitKeys.indexOf(item) === -1);
          const disabledSubmit = this.currentConfig['disabledButtons'].some(item => submitKeys.indexOf(item) > -1);
          disabledButtons = disabledSubmit ? [...disabledButtons.filter(item => submitKeys.indexOf(item) === -1), ...['submit']] :
            disabledButtons.filter(item => submitKeys.indexOf(item) === -1);
          _controlsState.hidden = this._fs.distinct([hiddenButtons, this.currentConfig['hiddenInfo'] || []]);
          _controlsState.disabled = this._fs.distinct([disabledButtons, this.currentConfig['disabledInfo'] || []]);
        }
      }
      if (!this.tid) {
        // 该条流程未进入流程引擎，还未发起
        _controlsState.hidden = [..._controlsState.hidden, ...['circulate', 'shift', 'close']];
      }
      console.log('_controlsState', _controlsState);
      this.setControls(_controlsState);
    }
    this.setContainer();

    let disabledIds = [];
    if (this.pid) {
      // 已办 默认禁用全部
      disabledIds = this.formIdList instanceof Array ? this.formIdList : [];
    } else if (this.statesConfig.length > 0) {
      if (!!_state) {
        const stateConfig = this.statesConfig.filter(item => item['state'] === _state);
        if (stateConfig.length > 0) {
          disabledIds = stateConfig[0]['disabledIds'] || [];
        }
      } else {
        disabledIds = this.statesConfig[0]['disabledIds'] || [];
      }
    }
    // console.log('disabledIds====', disabledIds, this.scope);
    setTimeout(() => {
      disabledIds.forEach(item => { if (this.cid(item)) { this.cid(item)['disabled'] = true; } });
    }, null);

    this.scope = Object.assign({}, this.scope);
    if (this.currentConfig && this.currentConfig instanceof Object && 'stateAction' in this.currentConfig) {
      try {
        // tslint:disable-next-line:no-eval
        const stateAction: any = eval(this.currentConfig['stateAction']);
        if (stateAction instanceof Function) { stateAction(); }
      } catch (e) {
        console.error(e);
        this.src.tipDialog('执行当前节点配置函数错误');
      }
    }
  }

  public printPage() {
    if (this._onPrint) {
      this._onPrint();
    }
    window.print();
  }

  public setControls(config: any) {
    /** 给用户设置只读和隐藏状态控件的方法
     * @param config.disabled: string[]
     * @param config.hidden: string[]
     * ['inittime', 'initiator', ...]
     */
    // console.log('===000---====config=', config);
    const _loop = [{ label: 'disabled', data: config['disabled'] || [] }, { label: 'hidden', data: config['hidden'] || [] }];
    _loop.forEach(item => {
      if (item.data && item.data instanceof Array) {
        item.data.forEach(control => {
          if (this.metadata[control]) {
            this.metadata[control][item.label] = true;
          }
        });
      }
    });
  }

  private setContainer() { // 设置overview、approval和buttons的metadata
    const overview: FlowOverviewMetadata[] = [];
    let buttonData: RaisedButtonMetadata[] = [];
    const _metadata = this._fs.deepCopy(this.metadata);
    delete _metadata.formChild;
    for (const i of Object.keys(_metadata)) {
      if (_metadata[i].type === 'raised-button') {
        if (_metadata[i].id !== 'fake') { buttonData.push(_metadata[i]); }
      } else { overview.push(_metadata[i]); }
    }
    if (!!this._metadata.isFake && this._onFake) { buttonData = [_metadata.fake]; }
    this._overviewMetadata = { id: 'overviewContent', type: 'overview', controls: overview };
    this._buttonMetadata = { id: 'flowButton', type: 'flowButton', buttons: buttonData };
  }

  public getButtonLayout(): boolean {
    this._fs.flexBtnShow = window.innerWidth - this.formEle.nativeElement.offsetLeft - this.formEle.nativeElement.offsetWidth - 20 > 80;
    return this._fs.flexBtnShow;
  }

  public setParamScope() {
    const param = this._fs.getDeskParam();
    if (this.scope) {
      this.scope['state'] = param['state'] || '';
      this.scope = Object.assign(this.scope, param);
    } else {
      this['scope'] = param;
    }
  }

  // 给用户使用 返回标准的约定参数对象
  public getFlowPostData(formData: FormData, actionName: string, msg: string) {
    let _param = null;
    if (this.overview) {
      this.overview.check();
      const actionData = this.action.filter(item => item && item['value'] === actionName)[0];
      _param = {
        formData: {
          bizdata: formData,
          overview: {
            data: this.overview.getValue(true, true, true),
            status: this.overview.validStatus
          }
        },
        initData: this.sheetInitData,
        data: this.sheetData,
        action: this.action,
        actionType: actionName
      };
      if (this.tid) { _param.formData['tid'] = this.tid; }
      if (this.ticket) { _param.formData['ticket'] = this.ticket; }
      if (this.state) { _param.formData['state'] = this.state; }
      if (!this.tid && this.prockey) { _param.formData['prockey'] = this.prockey; }
      _param['postParam'] = { action: actionData, msg: msg || '' };
    }
    return _param;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                   */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    // console.log('============flow========', this._service.copy(this._metadata));
    this.setParamScope();
    this.name = this._metadata.name;
    this.states = this._metadata.states;
    this.prockey = this._metadata.prockey;
    /**
     * this.action 改为在pageInit时 获取当前 state 内的 stateActions
     */
    this.formIdList = this._metadata.formIdList;
    this.statesConfig = this._metadata.statesConfig;
    this.formChild = this._metadata.formChild;
    this.onSave = this._metadata.onSave;
    this.onSubmit = this._metadata.onSubmit;
    this.onCirculate = this._metadata.onCirculate;
    this.onShift = this._metadata.onShift;
    this.onClose = this._metadata.onClose;
    this.onPrint = this._metadata.onPrint;
    this.onFake = this._metadata.onFake;
    this.pageInit();
    const mainEle = document.querySelectorAll('.main_content');
    if (mainEle.length !== 0) {
      this.main_Ele = mainEle[0];
      this.renderer2.setStyle(this.main_Ele, 'padding', '0px');
    }

  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement || !this.infoEle.nativeElement.style.left || window.innerWidth <= 600 || window.innerWidth >= 1366) {
      return;
    }
    const overlay = this._overlayContainer.getContainerElement();
    if (overlay.contains(targetElement)) {
      return;
    }
    const clickedInside = this.infoEle.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this._fs.leftContentShow = true;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.main_Ele) {
      this.renderer2.removeStyle(this.main_Ele, 'padding');
    }
  }
}
