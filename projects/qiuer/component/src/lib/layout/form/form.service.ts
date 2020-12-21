import { Injectable, EventEmitter } from '@angular/core';
import { FormLayoutMetadata } from './form.component';
import { ContainerService } from '@qiuer/core';


@Injectable()
export class FormService {

  constructor(public _cs: ContainerService) { }

  createUrlParam(params): void {
    let href = JSON.parse(JSON.stringify(window.location.href));
    for (const i of Object.keys(params)) {
      if (typeof (params[i]) !== 'object' && typeof (params[i]) !== 'undefined') {
        href = this.getChangeHref(i, params[i], href);
      }
    }
    window.location.href = encodeURI(href);
  }

  getChangeHref(key, value, href): any {
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

  // 获取地址栏参数转化成对象
  getParams(): any {
    const shareUrl = window.location.href;
    if (shareUrl.indexOf('?') === -1) {
      return {};
    } else {
      const str = shareUrl.split('?');
      const paramArray = str[1].split('&');
      const params = new Object();
      for (let i = 0; i < paramArray.length; i++) {
        params[paramArray[i].split('=')[0]] = decodeURI(paramArray[i].split('=')[1]);
      }
      return params;
    }
  }

  // 设置控件的默认layout
  _setDefLayout(childs: Array<FormLayoutMetadata>, special: Array<{ list: Array<string>, layout: object }>, defLayout: object): any {
    special.forEach(item => {
      childs.forEach(child => {
        if (item.list.indexOf(child.type) !== -1) {
          child.style = this._cs.mergeObject(item.layout, child['layout']);
          // child.layout = Object.assign(defLayout[i], child['layout']);
        } else {
          child.style = this._cs.mergeObject(defLayout, child['layout']);
          // child.layout = Object.assign(defLayout.def, child['layout']);
        }
      });
    });
    return childs;
  }

}
