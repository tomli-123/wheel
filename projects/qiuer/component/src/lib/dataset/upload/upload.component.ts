/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/7/29 谢祥 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { FileUploader } from 'ng2-file-upload';
import { ContainerService, ContainerEvent } from '@qiuer/core';
import { Subject } from 'rxjs';
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface UploadDatasetMetadata extends DatasetMetadata {
  typeIndex?: string[]; // 文件类型
  maxSize?: number; // 文件大小控制 单位 M
  disWatch?: boolean; // 是否禁止上传
  param?: object; // 上传带参数
  url: string; // 上传url
  issingle?: boolean; // 是否单文件上传
  // event
  onFileChange?: string; // 选择文件时触发
  onProgressChange?: string; // 上传进度变化时触发
  onCompleteAll?: string; // 文件全部上传完成时触发
  onError?: string; // 单个文件上传失败时触发
  onSuccess?: string; // 单个文件上传成功时触发
}

@Component({
  selector: 'upload-dataset',
  styleUrls: ['./upload.component.scss'],
  templateUrl: './upload.component.html'
})
export class UploadDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {
  public _metadata: UploadDatasetMetadata;
  public upload: any; // file文件列表
  public url: string; // 上传接口
  public _typeIndex: string[] = ['.jpg', '.png', '.jpeg', '.bmp', '.pdf', '.docx', '.doc', '.xlsx', '.xls']; // 文件类型 可覆盖；
  public _maxSize = 8; // 文件大小控制 单位 M 可覆盖；
  private isAllTypes = false; // 是否开放所有类型文件上传
  public hasBaseDropZoneOver = false; // 是否在读取文件中
  public disWatch = false; // 是否禁止上传
  public _param: string;
  public _fileChangeEvent: ContainerEvent;
  public _issingle: boolean; // 是否多选
  // Subject
  onFileChangeSubject: Subject<any> = new Subject<any>();
  onProgressChangeSubject: Subject<any> = new Subject<any>();
  onCompleteAllSubject: Subject<any> = new Subject<any>();
  onErrorSubject: Subject<any> = new Subject<any>();
  onSuccessSubject: Subject<any> = new Subject<any>();

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  registerEvent(): void {
    const fileChangeEvent = new ContainerEvent('fileChange', this.onFileChangeSubject, '(files)');
    this._setCallbackEvent(fileChangeEvent);
    this._setDoEventFunction(fileChangeEvent, (func: Function, e: any) => {
      func(e.files, e.indexFiles);
    });

    const progressChangeEvent = new ContainerEvent('progressChange', this.onProgressChangeSubject, '(progress)');
    this._setCallbackEvent(progressChangeEvent);
    this._setDoEventFunction(progressChangeEvent, (func: Function, e: any) => {
      func(e);
    });

    const completeAllEvent = new ContainerEvent('completeAll', this.onCompleteAllSubject, '()');
    this._setCallbackEvent(completeAllEvent);
    this._setDoEventFunction(completeAllEvent, (func: Function, e: any) => {
      func(e);
    });

    const errorEvent = new ContainerEvent('error', this.onErrorSubject, '()');
    this._setCallbackEvent(errorEvent);
    this._setDoEventFunction(errorEvent, (func: Function, e: any) => {
      func(e);
    });
    const successEvent = new ContainerEvent('success', this.onSuccessSubject, '()');
    this._setCallbackEvent(successEvent);
    this._setDoEventFunction(successEvent, (func: Function, e: any) => {
      func(e);
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                 */
  /***********************************************************************************/
  public set typeIndex(typeIndex: string[]) {
    if (typeIndex && typeIndex instanceof Array) {
      this._typeIndex = typeIndex;
      if (typeIndex.length === 1 && typeIndex[0] === '*') {
        this.isAllTypes = true;
      }
    }
  }
  public get typeIndex(): string[] { return this._typeIndex; }

  public set maxSize(maxSize: number) {
    if (maxSize !== 0 && !isNaN(maxSize) && maxSize !== null) {
      this._maxSize = maxSize;
    }
  }
  public get maxSize(): number { return this._maxSize; }

  public set param(param: object) {
    if (param && param instanceof Object) {
      let _param = '';
      for (const i of Object.keys(param)) {
        _param += '&' + i + '=' + param[i];
      }
      this._param = _param;
    }
  }



  public set files(files: any) {
    if (files && files instanceof Array) {
      this.upload.queue = files;
    }
  }
  public get files(): any {
    // return this.upload.queue;
    const _files = this.upload.queue;
    _files.forEach((file, index) => {
      file['index'] = index + 1;
      file['filename'] = file['file'] ? file.file['name'] || '' : '';
      file['code'] = file['code'] || file['code'] === 0 ? file['code'] : null;
      file['msg'] = file['msg'] ? file['msg'] : null;
      file['size'] = file['some'] ? file.some['size'] || null : null;
    });
    return _files;
  }

  public get originalFiles(): any {
    const _files = [];
    this.upload.queue.forEach((file, index) => {
      _files.push(file['some']);
    });
    return _files;
  }

  public set onFileChange(onFileChange: string) {
    this._setEvent('fileChange', onFileChange);
  }
  public set onError(onError: string) {
    this._setEvent('error', onError);
  }
  public set onSuccess(onSuccess: string) {
    this._setEvent('success', onSuccess);
  }
  public set onProgressChange(onProgressChange: string) {
    this._setEvent('progressChange', onProgressChange);
  }

  public set onCompleteAll(onCompleteAll: string) {
    this._setEvent('completeAll', onCompleteAll);
  }

  public set issingle(issingle: boolean) {
    this._issingle = !!issingle;
  }
  public get issingle(): boolean {
    return this._issingle;
  }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.url = this._metadata.url;
    this.upload = new FileUploader({
      method: 'POST',
      url: this.url
      // ,
      // headers: [{
      //   name: 'Content-Type',
      //   value: 'multipart/form-data'
      // }]
    });
    this.registerEvent();
    this.typeIndex = this._metadata.typeIndex;
    this.maxSize = this._metadata.maxSize;
    this.disWatch = !!this._metadata.disWatch;
    this.param = this._metadata.param;
    this.issingle = !!this._metadata.issingle;
    console.log('init ++++', this.issingle);
    this.onFileChange = this._metadata.onFileChange;
    this.onError = this._metadata.onError;
    this.onSuccess = this._metadata.onSuccess;
    this.onProgressChange = this._metadata.onProgressChange;
    this.onCompleteAll = this._metadata.onCompleteAll;
    this.upload.onProgressAll = (progress => {
      if (!this._hasDestroy) { this.onProgressChangeSubject.next(progress); }
    });
    this.upload.onCompleteAll = (() => {
      if (!this._hasDestroy) { this.onCompleteAllSubject.next(); }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.onProgressChangeSubject.unsubscribe();
    this.onFileChangeSubject.unsubscribe();
    this.onCompleteAllSubject.unsubscribe();
    this.onErrorSubject.unsubscribe();
    this.onSuccessSubject.unsubscribe();
  }

  /***********************************************************************************/
  /*                            others                                               */
  /***********************************************************************************/
  // 选择文件处理
  onFileSelected(event): void {
    for (let i = this.upload.queue.length - 1; i > -1; i--) {
      const type = /\.[^\.]+$/.exec(this.upload.queue[i].some.name)[0].toLowerCase();
      if (this._typeIndex.indexOf(type) === -1 && !this.isAllTypes) {
        this._service.tipDialog('文件格式有误');
        this.upload.queue[i].remove();
      } else if (this.upload.queue[i].some.size / 1048576 > this._maxSize) {
        this._service.tipDialog('单个文件大小不得大于' + this.maxSize + 'M');
        this.upload.queue[i].remove();
      }
    }
    // console.log('this.upload', this.upload, event);
    const _obj = {
      files: this.files,
      indexFiles: event
    };
    this.onFileChangeSubject.next(_obj);
  }

  //  选择文件前处理
  afterSel(): void {
    this.upload.queue.forEach((ele, i) => {
      if (ele.isError || (ele.isSuccess && ele.code !== 0)) {
        ele.remove();
      }
    });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  uploadFile(url: string, success: string | Function, error: string | Function): void {
    const _url = url || this.url;
    const _files = Object.assign([], this.files);
    const _param = this._param || '';
    const _success = success instanceof Function ? success : success ? this._evalStatement(success) : null;
    const _error = error instanceof Function ? error : error ? this._evalStatement(error) : null;
    if (!_url) {
      this._service.tipDialog('缺少请求功能点');
      return;
    }
    _files.forEach(file => {
      if (file.isUploaded) {
        return;
      }
      let _fakeUrl = _url;
      if (file.some.name.indexOf('.') !== -1) {
        const type = /\.[^\.]+$/.exec(file.some.name)[0].toLowerCase();
        _fakeUrl += '?type=' + type + _param;
      }
      file.url = _fakeUrl;
      file.upload();
      file.onSuccess = (response, status, headers) => {
        const tempRes = JSON.parse(response);
        if (tempRes.msg) {
          file['msg'] = tempRes.msg;
        }
        file['code'] = tempRes.code;
        if (file.code === 0) {
          file['result'] = {};
          for (const j of Object.keys(tempRes.data)) {
            if (j) {
              file.result[j] = tempRes.data[j];
            }
          }
          if (_success) { _success(file); }
        } else {
          this._service.tipDialog(file['msg']);
          if (_error) { _error(tempRes); }
        }
      };
      file.onError = (response, status, headers) => { // 本地上传失败
        this._service.tipDialog('本地上传失败');
        if (_error) { _error(response); }
      };

    });
  }

  doUpload(url?: string): void {
    const _url = url || this.url;
    const _files = Object.assign([], this.files);
    const _param = this._param || '';
    const _self = this;
    for (const file of _files) {
      console.log(file);
      file.onError = (res) => {
        _self.onErrorSubject.next(res);
      };
      file.onSuccess = (res) => {
        _self.onSuccessSubject.next(res);
      };
    }
    this._service.upLoadFiles(_url, _files, _param);
  }

  @HostListener('drop', ['$event'])
  drop(event): void { if (this.disWatch) { event.preventDefault(); } }
  @HostListener('dragover', ['$event'])
  dragover(event): void { if (this.disWatch) { event.preventDefault(); } }

}
