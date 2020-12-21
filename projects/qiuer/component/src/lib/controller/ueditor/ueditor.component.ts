/***********************************************************************************/
/* author: 贾磊
/* update logs:
/* 2019/6/10 贾磊 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { UEditorComponent } from 'ngx-ueditor';
import { Subject } from 'rxjs';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface UeditorControllerMetadata extends ControllerMetadata {
  height?: number; // 高度  //TODO 删除usditor，减小包得的体积
  imageActionName?: string; // 执行上传图片的action名称 'ipc.ueditor.upload.do'
  imageAllowFiles?: Array<string>; // 允许上传的图片格式['.png', '.jpg', '.jpeg', '.gif', '.bmp']
  serverUrl?: string; // 执行上传的方法 'https://sim-ipc.gtjaqh.net/upload/3500.24'
  imageRemoteServerPath?: string; // 展示的图片地址 'https://cdn2.gtjaqh.cn/vis/images/R_YX_VIS/'

  fileActionName?: string; // 执行上传附件的action名称
  // hasImgUpload?: boolean; // 是否需要上传功能
  // videoActionName?: string; // 视频上传的action名称 'www.admin.resource.upload'
  allHtml?: string; // 带html标签格式的文本内容
  funTypeMenu?: any; // 功能类型按钮list
  rowMenuLength?: Array<number>; // 设置每行多少个按钮
  // event
  onUEReady?: string; // ueditor初始化后触发
}
/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/* set height 设置高度 b
/***********************************************************************************/
@Component({
  selector: 'ueditor-ctrl',
  styleUrls: ['./ueditor.component.scss'],
  templateUrl: './ueditor.component.html'
})
export class UeditorControllerComponent extends ControllerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ueditor', { static: true }) ueditor: UEditorComponent;
  public ueditorHeight: number;
  public readonly = false;
  public _hasImgUpload: boolean;
  public uploadHConfig: any = [
    'removeformat', // 清除格式
    'formatmatch', // 格式刷
    'pasteplain', // 纯文本粘贴模式
    'indent', // 首行缩进
    'justifyleft', // 居左对齐
    'justifyright', // 居右对齐
    'justifycenter', // 居中对齐
    'justifyjustify', // 两端对齐
    'insertorderedlist', // 有序列表
    'insertunorderedlist', // 无序列表
    'rowspacingtop', // 段前距
    'rowspacingbottom', // 段后距
    'lineheight', // 行间距
    'pagebreak', // 分页
    'horizontal', // 分隔线
    'searchreplace', // 查询替换
    'preview', // 预览
    'print', // 打印
    // 'insertimage', // 多图上传
    'imagecenter', // 居中
    // 'insertvideo', // 视频
    'fullscreen' // 全屏
  ];
  public _funTypeMenu: any = {};
  public _rowMenuLength: Array<number> = [];
  public iconList: Array<string> = [];

  // 基础功能
  public base = [
    'source', // 源代码
    'undo', // 撤销
    'redo', // 重做
    'anchor', // 锚点
    'bold', // 加粗
    'italic', // 斜体
    'underline', // 下划线
    'strikethrough', // 删除线
    'fontborder', // 字符边框
    'removeformat', // 清除格式
    'formatmatch', // 格式刷
    'cleardoc', // 清空文档
    'pasteplain', // 纯文本粘贴模式
    'selectall', // 全选
    'backcolor', // 背景色
    'searchreplace', // 查询替换
    'background', // 背景
    'link', // 超链接
    'unlink', // 取消链接
    'help', // 帮助
    'fullscreen' // 全屏
  ];

  // 段落
  public paragraph = [
    'horizontal', // 分隔线
    'justifyleft', // 居左对齐
    'justifyright', // 居右对齐
    'justifycenter', // 居中对齐
    'justifyjustify', // 两端对齐
    'insertorderedlist', // 有序列表
    'insertunorderedlist', // 无序列表
    'paragraph', // 段落格式
    'directionalityltr', // 从左向右输入
    'directionalityrtl', // 从右向左输入
    'rowspacingtop', // 段前距
    'rowspacingbottom', // 段后距
    'pagebreak', // 分页
    'lineheight', // 行间距
    'autotypeset', // 自动排版
    'customstyle', // 自定义标题
  ];

  // 字体
  public font = [
    'indent', // 首行缩进
    'subscript', // 下标
    'superscript', // 上标
    'fontfamily', // 字体
    'fontsize', // 字号
    'forecolor', // 字体颜色
  ];

  // 表格
  public table = [
    'inserttable', // 插入表格
    'insertrow', // 前插入行
    'insertcol', // 前插入列
    'mergeright', // 右合并单元格
    'mergedown', // 下合并单元格
    'deleterow', // 删除行
    'deletecol', // 删除列
    'splittorows', // 拆分成行
    'splittocols', // 拆分成列
    'splittocells', // 完全拆分单元格
    'deletecaption', // 删除表格标题
    'mergecells', // 合并多个单元格
    'deletetable', // 删除表格
    'insertparagraphbeforetable', // 表格前插入行
    'edittable', // 表格属性
    'edittd', // 单元格属性
  ];

  // 文件
  public file = [
    'snapscreen', // 截图
    'insertvideo', // 视频
    'simpleupload', // 单图上传
    'insertimage', // 多图上传
    'imagenone', // 默认
    'imageleft', // 左浮动
    'imageright', // 右浮动
    'attachment', // 附件
    'imagecenter', // 居中
    'wordimage', // 图片转存
    'scrawl', // 涂鸦
    'music', // 音乐
  ];

  // 其他
  public other = [
    'print', // 打印
    'preview', // 预览
    'emotion', // 表情
    'spechars', // 特殊字符
    'touppercase', // 字母大写
    'tolowercase', // 字母小写
    'time', // 时间
    'date', // 日期
    'blockquote', // 引用
    'map', // Baidu地图
    'gmap', // Google地图
    'insertcode', // 代码语言
    'insertframe', // 插入Iframe
    'webapp', // 百度应用
    'template', // 模板
  ];

  // tslint:disable-next-line:variable-name
  public UE_config: any = {
    readonly: false,
    initialFrameHeight: 100,
    imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    videoAllowFiles: [
      '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
      '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid'],
    // imageUrlPrefix: '',
    snapscreenUrlPrefix: '',
    autoHeightEnabled: false,
    fileUrlPrefix: '',
    toolbars: [
      [
        'source', // 源码
        'undo', // 撤销
        'redo', // 重做
        'bold', // 加粗
        'italic', // 斜体
        'underline', // 下划线
        'strikethrough', // 删除线
        'fontborder', // 字符边框
        'subscript', // 下标
        'superscript', // 上标
        'paragraph', // 段落格式
        'fontfamily', // 字体
        'fontsize', // 字号
        'forecolor', // 字体颜色
        'backcolor', // 背景色
        'emotion', // 表情
        'spechars', // 特殊字符
        'link', // 超链接
        'unlink' // 删除超链接
      ],
      [
        'inserttable', // 插入表格
        'insertrow', // 前插入行
        'insertcol', // 前插入列
        'mergeright', // 右合并单元格
        'mergedown', // 下合并单元格
        'deleterow', // 删除行
        'deletecol', // 删除列
        'splittorows', // 拆分成行
        'splittocols', // 拆分成列
        'splittocells', // 完全拆分单元格
        'deletecaption', // 删除表格标题
        'mergecells', // 合并多个单元格
        'edittable', // 表格属性
        'edittd', // 单元格属性
        'deletetable' // 删除表格
      ]
    ]
  };

  public onUEReadySubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, public renderer2: Renderer2) {
    super(_service, _ctrlService);
  }

  protected registerEvent(): void {
    this.registerValueChangeEvent();
    this.registerStatusChangeEvent();
    this.UEReadyEvent();
  }

  protected UEReadyEvent(): void {
    const readyEvent = new ContainerEvent('ueReady', this.onUEReadySubject, '(e)');
    this._setCallbackEvent(readyEvent);
    this._setDoEventFunction(readyEvent, (func: Function, e: any) => {
      func(e);
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: string) {
    this._formControl.setValue(value);
  }

  public get value(): string {
    return this._formControl.value;
  }

  public set imageActionName(imageActionName: string) {
    this.setConfig('imageActionName', imageActionName);
    this.setConfig('snapscreenActionName', imageActionName);
  }
  public get imageActionName(): string {
    return this.UE_config['imageActionName'];
  }

  public set fileActionName(fileActionName: string) {
    this.setConfig('fileActionName', fileActionName);
  }
  public get fileActionName(): string {
    return this.UE_config['fileActionName'];
  }

  // public set videoActionName(videoActionName: string) {
  //   this.setConfig('videoActionName', videoActionName);
  // }
  // public get videoActionName() {
  //   return this.UE_config['videoActionName'];
  // }

  public set imageAllowFiles(imageAllowFiles: Array<string>) {
    if (imageAllowFiles instanceof Array && imageAllowFiles.length > 0) {
      this.setConfig('imageAllowFiles', imageAllowFiles);
    }
  }
  public get imageAllowFiles(): Array<string> {
    return this.UE_config['imageAllowFiles'];
  }

  public set serverUrl(serverUrl: string) {
    this.setConfig('serverUrl', serverUrl);
  }
  public get serverUrl(): string {
    return this.UE_config['serverUrl'];
  }

  public set imageRemoteServerPath(imageRemoteServerPath: string) {
    if (imageRemoteServerPath) {
      // tslint:disable-next-line:one-variable-per-declaration
      const arr = imageRemoteServerPath.split('//'),
        origin = arr.length === 1 ? 'https://' : arr[0] + '//',
        path = arr.length === 1 ? arr[0] : arr[1],
        host = origin + path.split('/')[0];
      this.setConfig('imageRemoteServerPath', imageRemoteServerPath);
      this.setConfig('imageRemoteServerHost', host);
      this.setConfig('catcherLocalDomain', ['127.0.0.1', 'localhost', host]);
      this.setConfig('imageUrlPrefix', host);
    }
  }
  public get imageRemoteServerPath(): string {
    return this.UE_config['imageRemoteServerPath'];
  }

  public set hasImgUpload(hasImgUpload: boolean) {
    this._hasImgUpload = hasImgUpload;
    const h = this._service.copy(this.uploadHConfig);
    if (hasImgUpload) {
      h.splice(this.uploadHConfig.length - 2, 0, 'insertimage');
      h.splice(this.uploadHConfig.length - 1, 0, 'insertvideo');
    }
    // this.UE_config.toolbars[1] = h;
    this.UE_config.toolbars.splice(1, 0, h);
  }
  public get hasImgUpload(): boolean {
    return this._hasImgUpload;
  }

  // disabled
  public set disabled(disabled: boolean) { disabled ? this.readonly = true : this.readonly = false; }
  public get disabled(): boolean { return this.readonly; }

  public set height(height: number) {
    if (height !== undefined && height !== null) {
      this.ueditorHeight = height;
      this.UE_config.initialFrameHeight = height;
    }
  }

  public set onUEReady(onUEReady: string) {
    this._setEvent('ueReady', onUEReady);
  }

  public get allHtml(): string {
    if (!this.ueditor || !this.ueditor['Instance']) {
      return '';
    }
    // tslint:disable-next-line:one-variable-per-declaration
    const _allHTML = this.ueditor.Instance.getAllHtml(),
      _html = this.ueditor.Instance.getContent(),
      _body = document.createElement('body'),
      _head = `<head><meta charset="UTF-8">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
    <meta http-equiv="Expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1.0">`;
    let _replaceHTML = '';
    _body.innerHTML = _html;
    // tslint:disable-next-line:one-variable-per-declaration
    const _tables = _body.querySelectorAll('table');
    for (let i = _tables.length - 1; i > -1; i--) {
      _tables[i].style.width = 'auto';
      _tables[i].style.margin = 'auto';
      const _div = document.createElement('div');
      _tables[i].parentElement.insertBefore(_div, _tables[i]);
      _div.appendChild(_tables[i]);
      _div.style.width = '100%';
      _div.style.overflow = 'auto';
      const trs = _tables[i].querySelectorAll('tr');
      for (let j = trs.length - 1; j > -1; j--) {
        const cells = trs[j].querySelectorAll('td');
        for (let k = cells.length - 1; k > -1; k--) {
          if (j === 0) {
            if (k === 0) {
              cells[k].style.borderWidth = '2px 1px 1px 2px';
              cells[k].style.borderStyle = 'double solid solid double';
              cells[k].style.borderColor = 'windowtext';
            } else {
              if (k === cells.length - 1) {
                cells[k].style.borderRight = '2px double windowtext';
              } else {
                cells[k].style.borderRight = '1px solid windowtext';
              }
              cells[k].style.borderTop = '2px double windowtext';
              cells[k].style.borderLeft = 'none';
              cells[k].style.borderBottom = '1px solid windowtext';
            }
          } else {
            cells[k].style.borderLeft = k === 0 ? '2px double windowtext' : 'none';
            cells[k].style.borderRight = k === cells.length - 1 ? '2px double windowtext' : '1px solid windowtext';
            cells[k].style.borderBottom = j === trs.length - 1 ? '2px double windowtext' : '1px solid windowtext';
            cells[k].style.borderTop = 'none';
          }
          cells[k].style.padding = '0px 7px';
        }
      }
    }
    const imgJs = `
      <script>
        window.onload = function(){
          const _images = document.querySelectorAll('img');
          for (let i = _images.length - 1; i > -1; i--) {
            const imgWidth = _images[i].width;
            if (imgWidth + 20 > document.body.clientWidth) { _images[i].style.width = '100%'; }
            // _images[i].style.margin = 'auto';
            _images[i].style.display = 'inline-block';
          }
        }
      </script>
    `;
    _replaceHTML = _allHTML.replace(/\<head>/, _head)
      .replace(/\<body.*?\/body>/, `<body style="margin: 10px;">${_body.innerHTML}${imgJs}</body>`);
    return _replaceHTML;
  }
  public set allHtml(html: string) {
    if (this.ueditor) {
      this.ueditor.Instance.execCommand('insertHtml', `${html}`);
    }
  }

  public set funTypeMenu(data: any) {
    if (!data || !(data instanceof Object)) {
      return;
    }
    const showIcon: Array<any> = [];
    const legitimateKey: Array<string> = ['base', 'paragraph', 'font', 'table', 'file', 'other'];
    for (const key of Object.keys(data)) {
      if (legitimateKey.indexOf(key) === -1) {
        continue;
      }
      if (data[key] instanceof Array && data[key].length !== 0) {
        const legitimateList = data[key][0] === '*' ? this[key] :
          data[key].filter(item => this[key].indexOf(item) !== -1);
        showIcon.push(legitimateList);
      }
    }
    this._funTypeMenu = data;
    this.iconList = showIcon.reduce((acc, val) => acc.concat(val));
  }

  public get funTypeMenu(): any {
    return this._funTypeMenu;
  }

  public set rowMenuLength(data: Array<any>) {
    if (!(data instanceof Array)) {
      return;
    }
    data = data.map(item => parseInt(item, 10)).filter(num => !isNaN(num));
    if (data.length === 0) { data = [0]; }
    const sum = data.reduce((acc, val) => acc + val);
    if (sum > this.iconList.length - 1) {
      return;
    }
    console.log(data);
    console.log(this.iconList);
    const showIcon: Array<any> = [];
    let startIndex = 0;
    for (const i of data) {
      showIcon.push(this.iconList.slice(startIndex, startIndex + i));
      startIndex += i;
    }
    if (sum < this.iconList.length - 1) {
      showIcon.push(this.iconList.slice(sum, this.iconList.length));
    }
    console.log(showIcon);
    this.UE_config.toolbars = showIcon;
  }

  public get rowMenuLength(): Array<any> {
    return this._rowMenuLength;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata: UeditorControllerMetadata = this._metadata;
    this.registerEvent();
    console.log('==========', Object.assign(metadata, {}));
    this.height = metadata.height;
    // this.hasImgUpload = metadata.hasImgUpload;
    this.imageActionName = metadata.imageActionName;
    this.serverUrl = metadata.serverUrl;
    this.imageRemoteServerPath = metadata.imageRemoteServerPath;
    this.imageAllowFiles = metadata.imageAllowFiles;
    this.onUEReady = metadata.onUEReady;

    this.fileActionName = metadata.fileActionName;
    // this.videoActionName = metadata.onUEReady;

    // this.UE_config.toolbars = this.toolbarsTest;
    this.funTypeMenu = metadata.funTypeMenu;
    this.rowMenuLength = metadata.rowMenuLength;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.onUEReadySubject.unsubscribe();
  }

  public setLayoutChange(): void {
    if (this._rootPath[0]) {
      this.subs(this._rootPath[0], 'layoutChange', () => {
        // 此处应增加uedtior初始化方法
      });
    }
  }
  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  public get urlParam(): string {
    return null;
  }
  public preview(): void {
    this.ueditor.Instance.execCommand('preview');
  }
  public execCommand(execCommand: string): void {
    this.ueditor.Instance.execCommand('execCommand');
  }

  public setConfig(key, value): void {
    this.UE_config[key] = value;
  }
  public _UeReady(e): void {
    this.onUEReadySubject.next(e);
    this.setIframe();
    const metadata: UeditorControllerMetadata = this._metadata;
    if (metadata.allHtml) { this.allHtml = metadata.allHtml; }
    if (window['UE']) {
      window['UE'].dom.domUtils.on(e.Instance.body, 'keydown', (oEvent) => {
        const nKeyCode = oEvent.keyCode || oEvent.which || oEvent.charCode;
        const bCtrlKeyCode = oEvent.ctrlKey || oEvent.metaKey;
        if (nKeyCode === 88 && bCtrlKeyCode) {
          try {
            this.value = this.ueditor.Instance.getContent();
          } catch (e) {
            this._service.tipDialog('富文本编辑器不存在...');
          }
        }
      });
    }
  }

  public setIframe(): void {
    // this.ueditor.Instance.setHeight(200);
    const iframeBody = this.ueditor.Instance.container.querySelector('iframe').contentWindow.document.getElementsByTagName('body')[0];
    if (iframeBody) {
      const p = iframeBody.firstElementChild;
      if (p && p.style.overflow) {
        p.style.overflow = 'unset';
      }
    }
  }

  public getBeautify(customiz?): any {
    // tslint:disable-next-line:one-variable-per-declaration
    const html = this.ueditor.Instance.getContent(),
      body = document.createElement('body');
    body.innerHTML = customiz ? customiz : html;
    console.log('========================');
    const _tables = body.querySelectorAll('table');
    const _images = body.querySelectorAll('img');
    for (let i = _tables.length - 1; i > -1; i--) {
      _tables[i].style.width = _tables[i].style.width ? _tables[i].style.width : 'auto';
      _tables[i].style.margin = _tables[i].style.margin ? _tables[i].style.margin : 'auto';
      const _div = document.createElement('div');
      const tableParent = _tables[i].parentElement;
      // if (tableParent && tableParent.tagName === 'DIV' && tableParent.style.overflow === 'auto' && tableParent.childNodes.length === 1) {
      if (tableParent && tableParent.tagName === 'DIV' && tableParent.className === 'u-editor-table-box-100') {
        tableParent.innerHTML = '';
        tableParent.appendChild(_tables[i]);
      } else {
        _tables[i].parentElement.insertBefore(_div, _tables[i]);
        _div.appendChild(_tables[i]);
        _div.className = 'u-editor-table-box-100';
        // _div.style.width = '100%';
        // _div.style.overflow = 'auto';
      }
      /*
      const trs = _tables[i].querySelectorAll('tr');
      for (let j = trs.length - 1; j > -1; j--) {
        const cells = trs[j].querySelectorAll('td');
        for (let k = cells.length - 1; k > -1; k--) {
          if (j === 0) {
            if (k === 0) {
              cells[k].style.borderWidth = '2px 1px 1px 2px';
              cells[k].style.borderStyle = 'double solid solid double';
              cells[k].style.borderColor = 'windowtext';
            } else {
              if (k === cells.length - 1) {
                cells[k].style.borderRight = '2px double windowtext';
              } else {
                cells[k].style.borderRight = '1px solid windowtext';
              }
              cells[k].style.borderTop = '2px double windowtext';
              cells[k].style.borderLeft = 'none';
              cells[k].style.borderBottom = '1px solid windowtext';
            }
          } else {
            cells[k].style.borderLeft = k === 0 ? '2px double windowtext' : 'none';
            cells[k].style.borderRight = k === cells.length - 1 ? '2px double windowtext' : '1px solid windowtext';
            cells[k].style.borderBottom = j === trs.length - 1 ? '2px double windowtext' : '1px solid windowtext';
            cells[k].style.borderTop = 'none';
          }
          cells[k].style.padding = '0px 7px';
        }
      }
      */
    }

    for (let i = _images.length - 1; i > -1; i--) {
      _images[i].setAttribute('onload', '_ueditor_img_onload(event, this);');
    }

    const _script = document.createElement('script');
    _script.setAttribute('type', 'text/javascript');
    _script.innerHTML = `
      var _ueditor_img_onload = function(event, self) {
        self.style.display = 'inline-block';
        if (self.width + 20 > document.body.clientWidth) { self.style.width = '100%'; }
      }
    `;
    body.appendChild(_script);
    return body.innerHTML;
  }

}
