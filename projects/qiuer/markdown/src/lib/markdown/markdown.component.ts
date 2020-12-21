/***********************************************************************************/
/* author: 林清将
/* update logs:
/* 2019/10/15 林清将 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { DatasetService, DatasetComponent, DatasetMetadata } from '@qiuer/component';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { Subject } from 'rxjs';

import { MarkdownService } from 'ngx-markdown';

import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface MarkdownDatasetMetadata extends DatasetMetadata {
  contentType?: string; // 内容类型 file md文件, string 字符串
  fullHeight?: boolean; // 是否撑满页面高度
  data?: string; // 符合md规范的字符串
  path?: string; // md文件地址或请求功能点
  catalog?: boolean; // 目录
  onLoad?: string; // 加载完成事件
  onError?: string; // 加载失败事件
}


/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get value
/* set data 符合md规范的字符串
/* set path md文件地址
/* set contentType string 读取data内容 file 通过配置的地址获取md文件
/***********************************************************************************/
@Component({
  selector: 'markdown-dataset',
  styleUrls: ['./markdown.component.scss'],
  templateUrl: './markdown.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MarkdownDatasetComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: MarkdownDatasetMetadata;
  protected _contentType: string;
  protected _data: string;
  protected _path: string;
  protected _catalog: boolean;
  public _css: string;
  public _isActive = false;
  public _isDialogActive = false;

  // Subject
  protected onLoadSubject: Subject<any> = new Subject<any>();
  protected onErrorSubject: Subject<any> = new Subject<any>();

  @ViewChild('chart', { static: true }) chart: ElementRef;

  constructor(
    public _service: ContainerService,
    public _ds: DatasetService,
    public el: ElementRef,
    public renderer: Renderer2,
    private mds: MarkdownService) {
    super(_service, _ds, el, renderer);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get html() {
    const htmlstr = `<div class="md_content div_content markdown_views">
    ${this.renderer['delegate'].shadowRoot.getElementById('content').innerHTML}
    </div>
    `;
    return htmlstr;
  }

  public get data() {
    return this._data;
  }

  public set data(data: string) {
    this._data = data;
  }

  public get catalog() {
    return this._catalog;
  }

  public set catalog(catalog: boolean) {
    this._catalog = catalog;
  }

  public get path() {
    return this._path;
  }
  public set path(path: string) {
    this._path = path.trim();
  }

  public set fullHeight(fullHeight: boolean) {
    if (this.root['dialogData'] && this.root['dialogData'] instanceof Object) {
      this._isDialogActive = fullHeight;
    } else {
      this._isActive = fullHeight;
    }
  }
  public get fullHeight() {
    return this._isActive || this._isDialogActive;
  }

  public get contentType() {
    return this._contentType;
  }
  public set contentType(contentType: string) {
    this._contentType = contentType;
  }

  public get onLoad(): string { return this._getCallback('onLoad').toString(); }
  public set onLoad(onLoad: string) { this._setEvent('load', onLoad); }
  public get onError(): string { return this._getCallback('onError').toString(); }
  public set onError(onError: string) { this._setEvent('error', onError); }

  public set css(css: string) { this._css = css; }
  public get css() { return this._css; }
  /***********************************************************************************/
  /*                            others                                 */
  /***********************************************************************************/

  addClass(className: string) {
    this.renderer.addClass(this.el.nativeElement.querySelector('.div_content'), className);
  }

  registerEvent() {
    const loadEvent = new ContainerEvent('load', this.onLoadSubject, '(event)');
    const errorEvent = new ContainerEvent('error', this.onErrorSubject, '(event)');

    this._setCallbackEvent(loadEvent);
    this._setCallbackEvent(errorEvent);

    this._setDoEventFunction(loadEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(errorEvent, (func: Function, e: any) => {
      func(e);
    });

  }

  mdOnLoad(event) {
    this.onLoadSubject.next(event);
  }

  mdOnReady(event) {
    this.onLoadSubject.next(event);
  }

  mdOnError(event) {
    console.log('mdOnError', event);
    this.onErrorSubject.next(event);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this.fullHeight = !!this._metadata.fullHeight;
    this.contentType = this._metadata.contentType || 'file';
    this.data = this._metadata.data || '';
    this.catalog = !!this._metadata.catalog;
    this.path = this._metadata.path || '';

    this.registerEvent();
    this.onLoad = this._metadata.onLoad;
    this.onError = this._metadata.onError;
    if (this.catalog) {
      this.mds.renderer.heading = (text: string, level: number) => {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return '<h' + level + '>' +
          '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
          '<span class="header-link"></span>' +
          '</a>' + text +
          '</h' + level + '>';
      };
    }
  }

  ngAfterViewInit(): void {
    this.getLayoutChange();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}

