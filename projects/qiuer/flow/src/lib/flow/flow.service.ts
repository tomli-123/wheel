import { Injectable } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class FlowService {

  public name: string; // 流程名称
  public leftContentShow: boolean; // 小屏左侧模块展示

  public flexBtnShow: boolean; // 判断功能按钮展示
  public pack = false; // overview展开收起
  public _userInfo = { name: '', department: '', depcode: '', avatar: '' };

  constructor(public _cs: ContainerService, public datePipe: DatePipe, public route: ActivatedRoute, public http: HttpClient) {
    this.getUserInfo();
  }

  getUserInfo() {
    this.http.post('/do/2201.61', {}).toPromise().then(res => {
      // console.log(res);
      // console.log('====service=get userInfo===');
      if (res['code'] === 0) {
        this.userInfo = res['data'];
      }
    });
  }

  public getInfoState(_state: boolean): boolean { // 获取信息模块（总览和流程表单）默认展开收起状态
    return _state && window.innerWidth > 600 && window.innerWidth < 1366;
  }
  public set userInfo(userInfo: any) {
    if (userInfo instanceof Object) {
      this._userInfo = Object.assign(this._userInfo, userInfo);
    }
  }
  public get userInfo() {
    return this._userInfo;
  }

  getDeskParam() {
    const href = JSON.parse(JSON.stringify(window.location.href));
    const _paramArr = href.split('/');
    const _paramStr = _paramArr[_paramArr.length - 1];
    const _paramObj = {};
    if (_paramStr && typeof (_paramStr) === 'string') {
      _paramStr.split('$').forEach(item => {
        if (item.indexOf('@') > -1) {
          _paramObj[item.split('@')[0]] = item.split('@')[1].split('?')[0];
        }
      });
    }
    return _paramObj;
  }

  createUrlParam(params) {
    let href = JSON.parse(JSON.stringify(window.location.href));
    for (const i of Object.keys(params)) {
      if (typeof (params[i]) !== 'object' && typeof (params[i]) !== 'undefined') {
        href = this.getChangeHref(i, params[i], href);
      }
    }
    window.location.href = encodeURI(href);
  }

  getChangeHref(key, value, href) {
    let symbol = '?';
    let param = '';
    if (href.indexOf('?') !== -1) {
      const str = href.split('?');
      const paramArray = decodeURI(str[1]).split('&');
      if (href.indexOf(key) < 0 && value !== '') {
        paramArray.push(key + '=' + value);
      } else {
        for (let i = 0; i < paramArray.length; i++) {
          if (paramArray[i].indexOf(key) >= 0) {
            if (value === '') {
              paramArray.splice(i, 1);
              break;
            }
            paramArray.splice(i, 1, key + '=' + value);
            break;
          }
        }
      }
      for (let i = 0; i < paramArray.length; i++) {
        if (i > 0) {
          symbol = '&';
        }
        param = param + symbol + paramArray[i];
      }
      return str[0] + param;
    } else if (value !== '') {
      return href + symbol + key + '=' + value;
    }
  }

  getOpinionData(_list, state, id) {
    const _opinions = {};
    const list = this.deepCopy(_list);
    if (id && state) {
      const indexItems = list.filter(_item => _item.state === state);
      if (indexItems.length === 1) {
        indexItems[0]['items'].forEach(item => {
          if (item['tid'] && item['tid'] === id) {
            _opinions['comment'] = item['comment'] || '';
            _opinions['opinion'] = item['opinion'] || '';
          }
        });
      }
    }
    return _opinions;
  }

  deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  distinct(arr: Array<any>) {
    const result = []; const obj = {};
    if (arr && arr instanceof Array) {
      let _arr = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i] instanceof Array) { _arr = _arr.concat(arr[i]); }
      }
      for (const i of _arr) { if (!obj[i]) { result.push(i); obj[i] = 1; } }
    }
    return result;
  }

}
