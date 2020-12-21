import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * 支持的文件['.jpg', '.png', '.jpeg', '.bmp', '.pdf', '.mp3', '.ogg', '.wav']
 */

export interface PreviewDatasetMetadata extends DatasetMetadata {
  fileType?: string; // 文件类型
  url?: string; // 文件路径
  param?: object; // 请求文件参数
  canDownload?: boolean; // 是否开启辅助下载 默认true
  canPrint?: boolean; // 是否允许打印 默认true
  canMouseRight?: boolean; // 是否允许右键 默认true
  canCopy?: boolean; // 是否允许拷贝 默认true
  canSaveHtml?: boolean; // 是否网页允许另存为 默认false
}

@Component({
  selector: 'preview',
  templateUrl: 'preview.component.html',
  styleUrls: ['preview.component.scss'],
})
export class PreviewDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {
  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2, public sanitizer: DomSanitizer) {
    super(_service, _ds, el, renderer2);
  }

  // protected _ready = {
  //   canDownloadReady: false,
  //   canPrintReady: false,
  //   canMouseRightReady: false,
  //   canCopyReady: false,
  //   canSaveHtmlReady: false,
  //   paramReady: false,
  //   fileTypeReady: false,
  // };
  private ready = false;
  public _viewsrc: any;
  public _url: string;
  public picture = ['jpg', 'png', 'jpeg', 'bmp'];
  public audio = ['mp3', 'ogg', 'wav'];
  public video = ['mp4', 'webm'];
  public _fileType: string;
  public _param: object;
  public secondaryDownload = false;
  public _config = {
    canDownloadAsPreviewContainer: true,
    canPrintAsPreviewContainer: true,
    canMouseRightAsPreviewContainer: true,
    canCopyAsPreviewContainer: true,
    canSaveHtmlAsPreviewContainer: false
  };

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  // 直接请求路径 不支持pdf流文件
  public set url(url: string) {
    // for (const i in this.ready) {
    //   if (this.ready[i] === false) {
    //     return;
    //   }
    // }
    if (!this.ready) {
      return;
    }
    this._url = url;
    if (url !== undefined && url !== null) {
      let paramstr = '';
      for (const i in this.param || {}) {
        if (this.param[i] && this.param[i] !== null) {
          paramstr = paramstr + '&' + i + '=' + this.param[i];
        }
      }
      paramstr = paramstr.replace('&', '');

      let configStr = '';
      for (const i in this._config) {
        if (this._config[i] !== undefined) {
          configStr += '&' + i + '=' + this._config[i];
        }
      }

      if (this.fileType === 'pdf') {
        let initUrl = '/assets/pdf/viewer.html?' + 'url=' + url + configStr;
        if (paramstr !== '') {
          initUrl += '&' + paramstr;
        }
        this.initPage(initUrl);
      } else if (this.picture.indexOf(this.fileType) !== -1) {
        let initUrl = '/assets/img/viewer.html?' + 'url=' + url + configStr;
        if (paramstr !== '') {
          initUrl += '&' + paramstr;
        }
        this.initPage(initUrl);
      } else {
        this.initPage(paramstr ? (url + '?' + paramstr) : url);
      }
    }
  }


  public set fileType(fileType: string) {
    if (fileType) {
      this._fileType = fileType.trim().toLowerCase().replace('.', '');
      this.url = this._url;
    }
  }
  public get fileType(): string {
    return this._fileType;
  }


  public set param(param: object) {
    this._param = param;
    this.url = this._url;
  }
  public get param(): object {
    return this._param;
  }
  public get support(): any {
    const newObj = {
      picture: ['jpg', 'png', 'jpeg', 'bmp'],
      audio: ['mp3', 'ogg', 'wav'],
      document: ['pdf'],
      video: ['mp4', 'webm']
    };
    return newObj;
  }
  public set canDownload(canDownload: boolean) {
    if (canDownload !== undefined) {
      this._config.canDownloadAsPreviewContainer = !!canDownload;
    }
    this.url = this._url;
  }
  public set canPrint(canPrint: boolean) {
    if (canPrint !== undefined) {
      this._config.canPrintAsPreviewContainer = !!canPrint;
    }
    this.url = this._url;
  }

  public set canMouseRight(canMouseRight: boolean) {
    if (canMouseRight !== undefined) {
      this._config.canMouseRightAsPreviewContainer = !!canMouseRight;
    }
    this.url = this._url;
  }

  public set canCopy(canCopy: boolean) {
    if (canCopy !== undefined) {
      this._config.canCopyAsPreviewContainer = !!canCopy;
    }
    this.url = this._url;
  }
  public set canSaveHtml(canSaveHtml: boolean) {
    if (canSaveHtml !== undefined) {
      this._config.canSaveHtmlAsPreviewContainer = !!canSaveHtml;
    }
    this.url = this._url;
  }


  initPage(p): void {
    this._viewsrc = this.sanitizer.bypassSecurityTrustResourceUrl(p);
  }

  videoError(e) {
    this.src.tipDialog('视频播放错误');
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata: PreviewDatasetMetadata = this._metadata;
    this.fileType = metadata.fileType;
    this.param = metadata.param || {};
    this.canDownload = metadata.canDownload;
    this.canPrint = metadata.canPrint;
    this.canMouseRight = metadata.canMouseRight;
    this.canCopy = metadata.canCopy;
    this.canSaveHtml = metadata.canSaveHtml;
    this.ready = true;
    this.url = metadata.url;
  }

}
