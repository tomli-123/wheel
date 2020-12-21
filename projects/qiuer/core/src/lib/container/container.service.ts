import { Injectable, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
// import { MatDialog, MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ContainerMetadata, HeaderBtn } from './container.component';
import { RootComponent } from '../root/root.container';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { saveAs } from 'file-saver';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable()
export class ContainerService {

  boostrapContainer: ContainerMetadata;
  rootMetadata: { [id: string]: ContainerMetadata } = {};
  rootContainer: { [id: string]: RootComponent } = {};

  dialogList: any[] = [];
  headerBtns: HeaderBtn[];

  // 组件的事件
  // type (mask,headerBtn,headerClick)
  eventChange: EventEmitter<{ type: string, data?: any }>;

  hookChange: EventEmitter<any>;

  constructor(public datePipe: DatePipe,
    public http: HttpClient,
    public httpBackend: HttpBackend,
    public dialog: MatDialog,
    public bottomSheet: MatBottomSheet,
    public snackBar: MatSnackBar,
    public clipboard: Clipboard) {
    this.eventChange = new EventEmitter();
    this.hookChange = new EventEmitter();
  }

  /********************************** container **********************************/
  registerContainers(containers: ContainerMetadata[]): boolean {
    // 注册container前,清空service里的变量
    this.boostrapContainer = null;
    this.rootMetadata = {};
    this.rootContainer = {};
    if (!this.isArray(containers)) {
      this.hideMask();
      this.tipDialog('containers 入参必须为数组');
      return false;
    }
    if (containers.length === 0) {
      this.tipDialog('containers数组长度需大于0');
      return false;
    }
    const bootContainer = containers.some((item) => {
      return item['bootstrap'] === true;
    });
    if (!bootContainer) {
      // 给第一个container设置为bootstrap
      containers[0]['bootstrap'] = true;
    }
    containers.forEach((item) => {
      if (item['bootstrap'] && item['bootstrap'] === true) { this.boostrapContainer = item; }
      if (item['type'] && item.type.indexOf('dialog') > -1) { this.dialogList.push(item); }
      this.setRootMetadata(item.id, item);
    });

    if (!this.boostrapContainer) {
      this.hideMask();
      this.tipDialog('containers 入参必须包含bootstrap=true的container');
      return false;
    }
    return true;
  }

  registerHeaderBtn(btns: HeaderBtn[]) {
    // 注册一个头部组件的右侧按钮
    this.headerBtns = btns;
    this.eventChange.next({ type: 'headerBtn', data: this.headerBtns });
  }

  clearHeaderBtn() {
    // 清除一个头部组件的右侧按钮
    this.headerBtns = [];
    this.eventChange.next({ type: 'headerBtn', data: this.headerBtns });
  }

  getBootstrapContainer(): ContainerMetadata {
    return this.boostrapContainer;
  }
  setRootMetadata(id: string, metadata: ContainerMetadata) {
    this.rootMetadata[id] = metadata;
  }
  getRootMetadata(id: string): ContainerMetadata {
    return this.rootMetadata[id];
  }
  setRootContainer(id: string, container: RootComponent) {
    this.rootContainer[id] = container;
    // console.log('setRootContainer', this.rootContainer);
  }
  getRootContainer(id: string): RootComponent {
    return this.rootContainer[id];
  }
  getContainerClass() {
    // const type = ContainerConfig.getContainerClass('aa');
  }

  /********************************** metadata **********************************/

  getData(url: string, param: object) {
    const httpParam = {};
    httpParam['params'] = param;
    return this.http.get(url, httpParam)
      .toPromise()
      .then()
      .catch();
  }

  postData(url: string, param: any, httpParam?: any) {
    if (!httpParam) {
      httpParam = {};
    }
    return this.http.post(url, param, httpParam)
      .toPromise()
      .then()
      .catch();
  }

  /*
   * file 获取文件请求
   *
   */
  file(url: string, param: any) {
    const httpParam = {};
    httpParam['responseType'] = 'arraybuffer';
    httpParam['observe'] = 'response';
    return this.http.post(url, param, httpParam)
      .toPromise()
      .then()
      .catch();
  }

  saveFile(res: any, fileName?: string) {
    const blob = new Blob([res.body]);
    try {
      const replaceName = res.headers.get('content-disposition').replace(/%/g, '%25');
      const fileNames = decodeURI(replaceName).split('=');
      fileName = fileNames[1];
      fileName = decodeURIComponent(escape(fileName));
    } catch (error) {
      console.log('========saveFile===========', error);
      fileName = 'excel';
    }
    saveAs(blob, fileName); // 中文乱码
  }

  public handleSuccess(res: any) {
    if (res['code'] && res['code'] !== 0) {
      if (res['code'] === -1) {
        this.goToLogin(res['data']);
      } else {
        this.tipDialog(res['msg']);
      }
      return new Promise(() => { });
    }
    return res;
  }

  goToLogin(data?: any) {
    let redirect;
    if (typeof location.origin === 'undefined') {
      redirect = location.protocol + '//' + location.host;
    } else {
      redirect = location.origin;
    }
    redirect += '/tologin.do';
    sessionStorage.setItem('noSessionUrl', location.href);
    redirect += '?url=' + encodeURIComponent(location.href);
    window.location.href = redirect;
  }

  tipDialog(msg: any, time?: number) {
    this.snackBar.open(msg, '关闭', {
      duration: time || 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  hideMask() {
    const event = { type: 'mask', data: false };
    this.eventChange.emit(event);
  }

  showMask() {
    const event = { type: 'mask', data: true };
    this.eventChange.emit(event);
  }

  setLayout(defaultChildLayout, childs, direction, specialChildLayout?) {
    if (childs !== undefined && childs !== null) {
      for (const child of childs) {
        if (child['style'] === undefined) {
          child['style'] = {};
          specialChildLayout !== undefined && specialChildLayout[child.type] ?
            child.style = specialChildLayout[child.type] : child.style = defaultChildLayout;
          // console.log(child.id, child.style);
        } else {
          // console.log(child);
          const childLayout = JSON.parse(JSON.stringify(child.style));
          const cloneDefaultChildLayout = JSON.parse(JSON.stringify(defaultChildLayout));
          if (specialChildLayout !== undefined && specialChildLayout[child.type]) {
            const special = JSON.parse(JSON.stringify(specialChildLayout[child.type]));
            // child.style = Object.assign(special, childLayout);
            child.style = this.layoutAssign(special, childLayout);
            // console.log(child.id, Object.assign({}, child.style));
          } else {
            // child.style = Object.assign(cloneDefaultChildLayout, childLayout);
            child.style = this.layoutAssign(cloneDefaultChildLayout, childLayout);
            // console.log(child.id, Object.assign({}, child.style));
          }
        }
        child['style']['direction'] = direction;
      }
    }
  }

  deleteEmpty(_obj, recurse) {
    for (const i of Object.keys(_obj)) {
      if (!_obj[i] && _obj[i] !== 0) {
        delete _obj[i];
      } else if (recurse && _obj[i] instanceof Object) {
        this.deleteEmpty(_obj[i], recurse);
      }
    }
  }

  layoutAssign(secondary, main) {
    this.deleteEmpty(main, true);
    // console.log('=======================layoutAssign_secondary', Object.assign({}, secondary));
    // console.log('=======================layoutAssign_main', Object.assign({}, main));
    const _customizeObj = { xs: {}, sm: {}, md: {}, gt_md: {} };
    const aimsFlex = {};

    for (const i of Object.keys(_customizeObj)) {
      aimsFlex[i] = {};
      if (main && main[i]) {
        aimsFlex[i] = main[i];
        if (!main[i]['flex'] && main['flex']) { aimsFlex[i]['flex'] = main['flex']; }
      } else if (main && main['flex']) {
        aimsFlex[i]['flex'] = main['flex'];
      } else if (secondary && secondary[i]) {
        aimsFlex[i] = secondary[i];
        if (!secondary[i]['flex'] && secondary['flex']) { aimsFlex[i]['flex'] = secondary['flex']; }
      } else if (secondary && secondary['flex']) {
        aimsFlex[i]['flex'] = secondary['flex'];
      }
    }

    const aimsLayout = Object.assign(secondary || {}, main || {}, aimsFlex);
    // console.log(aimsLayout);
    return aimsLayout;
  }

  /********************************** 自定义公共方法 **********************************/
  // 日期转化字符串
  dateToStr(d = new Date(), pattern = 'yyyyMMdd') {
    try {
      return this.datePipe.transform(d, pattern).toString();
    } catch (e) {
      console.error('日期转换出错!');
    }
  }
  timeToStr(value): string {
    let str = this.dateToStr(value);
    str = str + ' ' + this.addZero(value.getHours()) + ':' + this.addZero(value.getMinutes()) + ':' + this.addZero(value.getSeconds());
    return str;
  }
  monthToStr(month: Date): string {
    try {
      return this.datePipe.transform(month, 'yyyyMM').toString();
    } catch (e) {
      console.error('月份转换出错!');
    }
  }

  addDay(date = new Date(), day = 0, month = 0, year = 0): string {
    date.setFullYear(date.getFullYear() + year);
    date.setMonth(date.getMonth() + month);
    date.setDate(date.getDate() + day);
    let m = date.getMonth() + 1;
    m = this.addZero(m);
    let d = date.getDate();
    d = this.addZero(d);
    return date.getFullYear() + '-' + m + '-' + d;
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  /*
     * 合并两个对象
     *
     * @param target 目标对象
     * @param source 源对象
     *
     * @return 目标对象，源对象会覆盖目标对象
  */
  mergeObject(target: object, source: object): object {
    if (target === undefined || target === null) {
      target = {};
    }
    if (source === undefined && source === null) {
      source = {};
    }
    Object.assign(target, source);
    return target;
  }
  /*
     * 将一个字符串转换成MD5字符串
     *
     * @param pwd 入参字符串
     *
     * @return 全部大写的MD5字符串
  */
  getMd5(pwd: string) {
    return Md5.hashStr(pwd).toString().toLocaleUpperCase();
  }
  /*
     * 复制一个简单对象
     *
     * @param data 被复制的对象
     *
     * @return 新的copy对象
  */
  copy(data: any): any {
    if (!data) {
      data = {};
    }
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public isArray(arr: object): boolean {
    if (arr instanceof Array) {
      return true;
    }
    return false;
  }

  public isFunction(str: string) {
    const pattern = /^\s*\([A-Za-z0-9, ]*\)\s*=>/;
    return pattern.test(str);
  }

  // JSON对象转字符串
  public objToString(data: object, loopData: object[]) {
    if (loopData && loopData instanceof Array) {
      loopData.forEach(item => {
        if (data && data[item['name']]) {
          if (data[item['name']] instanceof item['type']) {
            let _def = '';
            try {
              _def = JSON.stringify(data[item['name']]);
            } catch (e) {
              console.log(e);
              console.error(data[item['name']]);
              _def = '';
            }
            data[item['name']] = _def;
          }
        }
      });
    }
  }

  // JSON字符串转对象
  public stringToObj(data: { status: string, content: object }, loopData: object[]) {
    if (loopData && loopData instanceof Array) {
      loopData.forEach(item => {
        if (data['content'] && data['content'] instanceof Object) {
          let _def = item['default'];
          try {
            if (data['content'][item['name']]) {
              // tslint:disable-next-line:no-eval
              _def = eval('(' + data['content'][item['name']] + ')');
            }
            if (_def instanceof item['type'] === false) {
              data.status = 'ERROR';
              data['content'][item['name']] = item['default'];
            } else {
              data['content'][item['name']] = _def;
            }
          } catch (e) {
            console.log(e);
            console.error(data['content'][item['name']]);
            data['status'] = 'ERROR';
          }
        }
      });
    }
  }

  // 检查是否包含
  public isInclude(source: any, filter: any, field?: string) {
    if (filter === '' || filter === null) {
      return true;
    }
    if (source instanceof Array) {
      if (source.indexOf(filter) !== -1) {
        return true;
      }
    }
    if (source instanceof Object) {
      if (field && field !== '' && field !== null) {
        if (source[field] === undefined || source[field] === null) {
          return false;
        } else {
          return source[field].toString().toLowerCase().includes(filter.toString().toLowerCase());
        }
      }
      for (const property in source) {
        if (source[property] === null) {
          continue;
        }
        if (source[property].toString().toLowerCase().includes(filter.toString().toLowerCase())) {
          return true;
        }
      }
    }
    if (source instanceof String || source instanceof Number) {
      if (source.toString().toLowerCase().includes(filter.toString().toLowerCase())) {
        return true;
      }
    }
    return false;
  }
  // 判断当前版本是否符合最小版本要求
  public isLowVersion(nowVersion: string, msVersion: string): boolean {
    try {
      const nowList = nowVersion.split('.');
      const msList = msVersion.split('.');
      const now = Number(nowList[0]) * 10 + Number(nowList[1]) * 10;
      const ms = Number(msList[0]) * 10 + Number(msList[1]) * 10;
      if (ms > now) {
        return true;
      }
    } catch (error) {
      console.error('版本号定义有误' + '当前版本' + nowVersion + ', 最小要求版本 ' + msVersion);
      return true;
    }
    return false;
  }

  // 用于流程， 设置urlparam
  createDeskParam(params) {
    if (params['formkey']) {
      this.createDoneParam(params);
    } else {
      let href = JSON.parse(JSON.stringify(window.location.href));
      const _hrefArr = href.split('?');
      if (_hrefArr[0].indexOf('@') !== -1) {
        let _arr_ = _hrefArr[0].split('/');
        _arr_ = _arr_.filter(item => item.indexOf('@') === -1);
        _hrefArr[0] = _arr_.join('/');
      }
      const paramArr = [];
      for (const i of Object.keys(params)) {
        if (typeof (params[i]) !== 'object' && typeof (params[i]) !== 'undefined') {
          paramArr.push(`${i}@${params[i]}`);
        }
      }
      href = _hrefArr[0] + '/' + paramArr.join('$') + (_hrefArr.length > 1 ? _hrefArr[1] : '');
      window.location.href = encodeURI(href);
    }
  }

  createDoneParam(params) {
    if (params && params instanceof Object && params['formkey']) {
      const _origin = window.location.origin + params.formkey;
      delete params.formkey;
      let href = JSON.parse(JSON.stringify(window.location.href));
      const _hrefArr = href.split('?');
      const paramArr = [];
      for (const i of Object.keys(params)) {
        if (typeof (params[i]) !== 'object' && typeof (params[i]) !== 'undefined') {
          paramArr.push(`${i}@${params[i]}`);
        }
      }
      console.log('createDoneParam', paramArr);
      href = _origin + '/' + paramArr.join('$') + (_hrefArr.length > 1 ? ('?' + _hrefArr[1]) : '');
      window.location.href = encodeURI(href);
    }
  }

  upLoadFiles(url: string, files: Array<any>, param?: any) {
    // return new Promise((resolve, reject) => {
    const _url = url;
    const _files = Object.assign([], files);
    let _param = '';
    if (!_url) {
      this.tipDialog('缺少请求功能点');
      return;
    }
    if (param) {
      if (param instanceof Object) {
        let _p = '';
        for (const key of Object.keys(param)) {
          _p += `${key}=${param.key || ''}`;
        }
        if (_p) { _param = `&${_p}`; }
      } else if (typeof (param) === 'string') { _param = param; }
    }
    _files.forEach(file => {
      if (file.isUploaded) {
        return;
      }
      const _error = file.onError;
      const _success = file.onSuccess;
      let _fakeUrl = _url;
      if (file.some.name.indexOf('.') !== -1) {
        const type = /\.[^\.]+$/.exec(file.some.name)[0].toLowerCase();
        _fakeUrl += '?type=' + type + _param;
      }
      file.url = _fakeUrl;
      file.upload();
      file.onSuccess = (response, status, headers) => {
        // console.log(response);
        let tempRes: any = {};
        try {
          tempRes = JSON.parse(response);
        } catch (e) { }
        if (tempRes.msg) {
          file['msg'] = tempRes.msg;
        }
        file['code'] = tempRes.code;
        if (file.code === 0) {
          file['result'] = {};
          file.result['file_name'] = file.some.name;
          file.result['file_ext'] = file.some.name.indexOf('.') !== -1 ? /\.[^\.]+$/.exec(file.some.name)[0].toLowerCase() : null;
          file.result['file_size'] = (file.some.size / 1024).toFixed(2);
          // ele.result['file_uploader'] = this.authGuard.getUserInfo().name;
          file.result['file_overtime'] = new Date().getTime();
          for (const j of Object.keys(tempRes.data)) {
            if (j) {
              file.result[j] = tempRes.data[j];
            }
          }
          if (_success) { _success(tempRes); }
          // if (resolve) { resolve(tempRes); }
        } else {
          this.tipDialog(file['msg']);
          if (_error) { _error(tempRes); }
          // if (reject) { reject(tempRes); }
        }
      };
      file.onError = (response, status, headers) => { // 本地上传失败
        // console.log(response);
        let tempRes: any = {};
        try {
          tempRes = JSON.parse(response);
        } catch (e) { }
        this.tipDialog('本地上传失败');
        if (_error) { _error(tempRes); }
        // if (reject) { reject(tempRes); }
      };

    });
    // });
  }

  public copyText(text: string) {
    if (typeof (text) === 'string') {
      const isClipboard = this.clipboard.copy(text);
      const msg = isClipboard ? '成功' : '失败';
      this.tipDialog(`拷贝${msg}`);
    }
  }

}
