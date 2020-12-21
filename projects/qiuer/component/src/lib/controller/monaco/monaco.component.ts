/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/11 贾磊 创建
/***********************************************************************************/
import {
  Component, OnInit, ViewChild, AfterViewInit, ElementRef, Renderer2, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export enum Language {
  javascript = 'javascript',
  json = 'json',
  typescript = 'typescript',
  xml = 'xml',
  html = 'html',
  sql = 'sql',
  css = 'css',
  qscript = 'qscript'
}

export enum KeyMod {
  alt = 'Alt',
  shift = 'Shift',
  ctrl = 'CtrlCmd',
  win = 'WinCtrl',
  windows = 'WinCtrl'
}
export enum KeyBord {
  abnt_c1 = 'ABNT_C1',
  abnt_c2 = 'ABNT_C2',
  alt = 'Alt',
  backspace = 'Backspace',
  capslock = 'CapsLock',
  contextmenu = 'ContextMenu',
  ctrl = 'Ctrl',
  delete = 'Delete',
  downarrow = 'DownArrow',
  end = 'End',
  enter = 'Enter',
  esc = 'Escape',
  f1 = 'F1',
  f10 = 'F10',
  f11 = 'F11',
  f12 = 'F12',
  f13 = 'F13',
  f14 = 'F14',
  f15 = 'F15',
  f16 = 'F16',
  f17 = 'F17',
  f18 = 'F18',
  f19 = 'F19',
  f2 = 'F2',
  f3 = 'F3',
  f4 = 'F4',
  f5 = 'F5',
  f6 = 'F6',
  f7 = 'F7',
  f8 = 'F8',
  f9 = 'F9',
  home = 'Home',
  insert = 'Insert',
  key_0 = 'KEY_0',
  key_1 = 'KEY_1',
  key_2 = 'KEY_2',
  key_3 = 'KEY_3',
  key_4 = 'KEY_4',
  key_5 = 'KEY_5',
  key_6 = 'KEY_6',
  key_7 = 'KEY_7',
  key_8 = 'KEY_8',
  key_9 = 'KEY_9',
  key_a = 'KEY_A',
  key_b = 'KEY_B',
  key_c = 'KEY_C',
  key_d = 'KEY_D',
  key_e = 'KEY_E',
  key_f = 'KEY_F',
  key_g = 'KEY_G',
  key_h = 'KEY_H',
  key_i = 'KEY_I',
  key_j = 'KEY_J',
  key_k = 'KEY_K',
  key_l = 'KEY_L',
  key_m = 'KEY_M',
  key_n = 'KEY_N',
  key_o = 'KEY_O',
  key_p = 'KEY_P',
  key_q = 'KEY_Q',
  key_r = 'KEY_R',
  key_s = 'KEY_S',
  key_t = 'KEY_T',
  key_u = 'KEY_U',
  key_v = 'KEY_V',
  key_w = 'KEY_W',
  key_x = 'KEY_X',
  key_y = 'KEY_Y',
  key_z = 'KEY_Z',
  leftarrow = 'LeftArrow', // 左箭头
  meta = 'Meta',
  num_0 = 'NUMPAD_0',
  num_1 = 'NUMPAD_1',
  num_2 = 'NUMPAD_2',
  num_3 = 'NUMPAD_3',
  num_4 = 'NUMPAD_4',
  num_5 = 'NUMPAD_5',
  num_6 = 'NUMPAD_6',
  num_7 = 'NUMPAD_7',
  num_8 = 'NUMPAD_8',
  num_9 = 'NUMPAD_9',
  num_add = 'NUMPAD_ADD', // 小键盘加号
  num_decimal = 'NUMPAD_DECIMAL', // 小键盘 .
  num_divide = 'NUMPAD_DIVIDE', // 小键盘 /
  num_multiply = 'NUMPAD_MULTIPLY', // 小键盘 *
  num_separator = 'NUMPAD_SEPARATOR', // 小键盘回车
  num_subtract = 'NUMPAD_SUBTRACT', // 小键盘 -
  numlock = 'NumLock',
  oem_102 = 'OEM_102', // RT102键键盘上的尖括号键或反斜杠键。
  oem_8 = 'OEM_8', // 用于杂项字符; 它可以因键盘而异。
  pagedown = 'PageDown',
  pageup = 'PageUp',
  pausebreak = 'PauseBreak',
  rightarrow = 'RightArrow',
  scrolllock = 'ScrollLock',
  shift = 'Shift',
  space = 'Space',
  tab = 'Tab',
  backslash = 'US_BACKSLASH', // |
  backtick = 'US_BACKTICK', // ~
  close_square_bracket = 'US_CLOSE_SQUARE_BRACKET', // }]
  comma = 'US_COMMA', // ,<
  dot = 'US_DOT', // .>
  equal = 'US_EQUAL', // =+
  minus = 'US_MINUS', // -_
  open_square_bracket = 'US_OPEN_SQUARE_BRACKET', // [{
  quote = 'US_QUOTE', // "'
  semicolon = 'US_SEMICOLON', // ;:
  slash = 'US_SLASH', // /?
  uparrow = 'UpArrow'
}

export interface KeyboardAction {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  windows?: boolean;
  key: string;
  function: string;
  contextmenu?: boolean; // 是否在右键菜单展示
  contextmenuLabel?: string; // 右键菜单展示名称 默认快捷键组合名 例如ctrl+s
}

export interface MonacoControllerMetadata extends ControllerMetadata {
  language?: Language; // 语言种类
  height?: number; // 高度 px
  isMaxHeight?: boolean; // 是否撑满页面或dialog高度
  tabSize?: number; // 制表符大小 默认为2
  keyboardAction?: KeyboardAction[];
  theme?: string;
  minimap?: boolean;
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/* set module 设置语言
/***********************************************************************************/
@Component({
  selector: 'monaco-ctrl',
  templateUrl: './monaco.component.html',
  styleUrls: ['./monaco.component.scss']
})

export class MonacoControllerComponent extends ControllerComponent implements OnInit, AfterViewInit, OnDestroy {
  public _height: number;
  public _metadata: MonacoControllerMetadata;
  public monacoConfig = {
    language: 'qscript', wordWrap: 'on', theme: 'vs-dark', minimap: {
      enabled: true
    }
  };
  public layoutChange: boolean;

  public _isActive = false;
  public _isDialogActive = false;
  public monacoEditor: any;
  public monacoModel: any;
  @ViewChild('monaco', { static: true }) monaco: any;
  @ViewChild('monacoContent', { static: true }) monacoContent: ElementRef;
  private editElement: Element;
  // private isFullScreen = false;
  private isInFullScreen = false;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService,
    public renderer2: Renderer2, public el: ElementRef, public changeRef: ChangeDetectorRef) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    this.monacoConfig.minimap.enabled = this._metadata.minimap === undefined ? true : this._metadata.minimap;
    super.ngOnInit();
    this.language = this._metadata.language;
    // this.isMaxHeight = this._metadata.isMaxHeight;
    this.setLayoutChange();
    // console.log('monaco ngOnInit, dirty=', this._formControl.dirty);
    // 暂时注掉reset有问题解开
    // this._formControl.reset();
    this.editElement = this.monaco._editorContainer.nativeElement;
    // console.log('=============monaco Init=============');

    // document.addEventListener('keydown', (e) => {
    //   console.log(e);
    //   const keycode = e.keyCode || e.which;
    //   if (keycode === 27 && this.isInFullScreen) {
    //     this.isInFullScreen = false;
    //   }
    // });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  // ngAfterContentInit(): void {
  //   // 设置组件高度
  //   if (!this.height) {
  //     const height = this.el.nativeElement.querySelector('.monaco_content').offsetHeight;
  //     this.height = height;
  //   }

  // }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // document.removeEventListener('keydown', (e) => {
    //   const keycode = e.keyCode || e.which;
    //   if (keycode === 27 && this.isInFullScreen) {
    //     this.isInFullScreen = false;
    //   }
    // });
  }
  monacoInit(ev): void {
    this.monacoEditor = ev;
    this.monacoModel = ev.getModel();
    this.tabSize = this._metadata.tabSize || 2;
    this.command = this._metadata.keyboardAction || [];
    this.theme = this._metadata.theme || 'vs-dark';
    setTimeout(() => {
      if (!this._metadata.isMaxHeight) {
        this.height = typeof (this._metadata.height) === 'number' ? this._metadata.height :
          this.monacoContent.nativeElement.offsetHeight ? this.monacoContent.nativeElement.offsetHeight : 300;
      }
      this.addAction();
      this.editorResize();
    }, 50);
  }
  addAction(): any {
    if (this.monacoConfig.language === 'qscript') {
      this.monacoEditor.addAction({
        id: 'ctrl&/',
        label: 'comment',
        keybindings: [
          // tslint:disable-next-line:no-bitwise
          (window as any).monaco.KeyMod.CtrlCmd | (window as any).monaco.KeyCode.US_SLASH
        ],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: (ed) => {
          const value = ed.getValue();
          const selection = ed.getSelection();
          const startLine = selection.startLineNumber;
          const endLine = selection.endLineNumber;
          const strArray = value.split('\n');
          let newStr = '';
          const reg = /^(\/\/).*?/;
          const reg1 = /^(\/\/\s).*?/;
          for (let i = 1; i < strArray.length + 1; i++) {
            if (i - startLine >= 0 && endLine - i >= 0) {
              // 选中行
              if (reg1.test(strArray[i - 1].replace(/^\s*|\s*$/g, ''))) {
                newStr += strArray[i - 1].replace('// ', '') + '\n';
              } else if (reg.test(strArray[i - 1].replace(/^\s*|\s*$/g, ''))) {
                newStr += strArray[i - 1].replace('//', '') + '\n';
              } else {
                newStr += '// ' + strArray[i - 1] + '\n';
              }
            } else if (i !== strArray.length) {
              newStr += strArray[i - 1] + '\n';
            } else {
              newStr += strArray[i - 1];
            }
          }
          // this.value = newStr;
          ed.executeEdits('', [{
            range: ed.getModel().getFullModelRange(),
            text: newStr
          }]);
          return newStr;
        }
      });
    }
    this.monacoEditor.addAction({
      id: 'ctrl&F10',
      label: 'full screen',
      keybindings: [
        // tslint:disable-next-line:no-bitwise
        (window as any).monaco.KeyMod.CtrlCmd | (window as any).monaco.KeyCode.F10
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (ed) => {
        this.fullScreen();
        return null;
      }
    });

    this.monacoEditor.addAction({
      id: 'stopCtrl&S',
      label: 'stopCtrl&S',
      keybindings: [
        // tslint:disable-next-line:no-bitwise
        (window as any).monaco.KeyMod.CtrlCmd | (window as any).monaco.KeyCode.KEY_S
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (ed) => {
        console.log('暂未定义monaco的自定义保存方法');
        return null;
      }
    });
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set tabSize(_tabSize: number) {
    // 只有默认 json html js ts css可用
    if (_tabSize && this.monacoModel.updateOptions) {
      this.monacoModel.updateOptions({ tabSize: _tabSize });
    }
  }
  public set language(language: string) {
    if (language) {
      const mode = Language[language.toLowerCase()];
      if (mode) {
        this.monacoConfig.language = mode;
      }
    }
  }

  public set theme(_theme: string) {
    if (_theme) {
      this.monacoModel.updateOptions({ theme: _theme });
    }
  }
  public set value(value: string) {
    this._formControl.setValue(value);
  }
  public get value(): string {
    return this._formControl.value;
  }
  public set height(height: number) {
    this._height = height;
  }
  public get height(): number {
    return this._height;
  }

  // public set isMaxHeight(isMaxHeight: boolean) {
  //   if (this.root['dialogData'] && this.root['dialogData'] instanceof Object) {
  //     this._isDialogActive = isMaxHeight;
  //   } else {
  //     this._isActive = isMaxHeight;
  //   }
  //   // console.log(this._isDialogActive);
  //   // console.log(this._isActive);
  // }
  // public get isMaxHeight() {
  //   return this._isActive || this._isDialogActive;
  // }
  // public resetDirty() {
  //   this._formControl.markAsPristine();
  // }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  public fullScreen(): void {
    if (this.editElement) {
      this.isInFullScreen = true;
      const _height = window.screen.height;
      const _width = window.screen.width;
      this.monacoEditor.layout({ width: _width, height: _height });
      this.editElement.requestFullscreen();
    }
  }

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  public get urlParam(): any {
    return null;
  }

  public onKeyDown(event): void {
    console.log(event);
  }

  setLayoutChange(): void {
    if (this._rootPath && this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => { this.getLayoutChange(); });
    }
  }

  getLayoutChange(): void {
    this.editorResize();
  }

  // public setLayoutChange() {
  //   this.editorResize();
  //   if (this._rootPath[0]) {
  //     this.subs(this._rootPath[0], 'layoutChange', () => {
  //       console.log('layoutChange');
  //       this.layoutChange = !this.layoutChange;
  //       this.editorResize();
  //     });
  //   }
  // }
  public set disabled(disabled: boolean) {
    if (disabled) {
      this._formControl.disable();
      this.monacoConfig['readOnly'] = true;
      this.monacoConfig = this._service.copy(this.monacoConfig);
    } else {
      this.monacoConfig['readOnly'] = false;
      this.monacoConfig = this._service.copy(this.monacoConfig);
      this._formControl.enable();
    }
  }
  public get disabled(): boolean { return this._formControl.disabled; }


  public _doOnInit(): void {
    // console.log('monaco _doOnInit, dirty=', this._formControl.dirty);
    this._formControl.markAsPristine();
    // console.log('重置后 monaco _doOnInit, dirty=', this._formControl.dirty);
    super._doOnInit();
  }

  editorResize(): void {
    this.changeRef.detectChanges();
    if (this.monacoEditor && !this.isInFullScreen) {
      const _height = this.monacoContent.nativeElement.offsetHeight;
      const _width = this.monacoContent.nativeElement.offsetWidth;
      this.monacoEditor.layout({ width: _width, height: _height });
    }
  }

  // protected _evalStatement(statement): any {
  //   if (statement && this._hasDestroy === false) {
  //     try {
  //       // tslint:disable-next-line:no-eval
  //       const ret: any = eval(statement);
  //       return ret;
  //     } catch (e) {
  //       console.log(e);
  //       console.error(statement);
  //       this._service.tipDialog('执行语句出错!');
  //     }
  //   }
  // }

  public set command(keyboardActions: KeyboardAction[]) {
    if (keyboardActions && keyboardActions.length < 1) {
      return;
    }
    for (const i of keyboardActions) {
      let keybindings: any;
      let _id = '';
      if (i.ctrl) { keybindings = keybindings | (window as any).monaco.KeyMod[KeyMod['ctrl']]; _id === '' ? _id = 'ctrl' : _id += '+ctrl'; }
      if (i.alt) { keybindings = keybindings | (window as any).monaco.KeyMod[KeyMod['alt']]; _id === '' ? _id = 'alt' : _id += '+alt'; }
      if (i.shift) { keybindings = keybindings | (window as any).monaco.KeyMod[KeyMod['shift']]; _id === '' ? _id = 'shift' : _id += '+shift'; }
      if (i.windows) { keybindings = keybindings | (window as any).monaco.KeyMod[KeyMod['win']]; _id === '' ? _id = 'win' : _id += '+win'; }
      keybindings = keybindings | (window as any).monaco.KeyCode[KeyBord[i.key.toLowerCase()]];
      _id === '' ? _id = i.key : _id += '+' + i.key;
      let func: any;
      if (this._service.isFunction(i.function)) {
        func = this._evalStatement(i.function);
      } else {
        func = this._evalStatement('(rowdata) => {\nreturn ' + i.function + '\n}');
      }
      if (i.contextmenu) {
        this.monacoEditor.addAction({
          id: _id,
          label: i.contextmenuLabel || _id,
          keybindings: [
            keybindings
          ],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: func
        });
      } else {
        this.monacoEditor.addCommand(keybindings, func);
      }
    }
  }

}
