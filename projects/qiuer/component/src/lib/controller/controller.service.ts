import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class ControllerService {

  constructor(public datePipe: DatePipe) {

  }
  // 日期转化字符串
  dateToStr(d = new Date(), pattern = 'yyyyMMdd'): string {
    try {
      return this.datePipe.transform(d, pattern).toString();
    } catch (e) {
      console.error('日期转换出错!');
    }
  }

  // 多选参数转化字符串
  multiToStr(value): string {
    let valueStr = '';
    if (value.length === 0) {
      return '';
    }
    for (const item of value) {
      valueStr = valueStr + ',' + item;
    }
    valueStr = valueStr.replace(',', '');
    return valueStr;
  }

  /*
 从url获取表单对应的值，
 四种类型  date  string  mult number
 start
  */
  getDateParam(param: string, paramObj: any): any {
    return this.getDateParams(paramObj[param]) || null;
  }

  getParam(param: string, paramObj: any): any {
    return paramObj[param] || null;
  }

  getMultiParam(param: string, paramObj: any): any {
    return this.getMultiParams(paramObj[param]) || [];
  }

  getNumberParam(param: string, paramObj: any): any {
    return parseFloat(paramObj[param]) || null;
  }

  getTimeParam(param: string, paramObj: any): any {
    return this.getTimeParams(paramObj[param]) || null;
  }

  getTimeParams(value: string): Date {
    if (!value || value === null || value === '') {
      return;
    }
    let str = value;
    str = str.replace(/\s*/g, '').replace(/:/g, '').replace(/%20/g, ' ');
    if (str.length !== 14) {
      console.error('timeStr转化date出错,timeStr应为YYYYMMDD hh:mm:ss或14位字符串');
    }
    const year = Number(str.match(/.{4}/g)[0]);
    const month = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[0]) - 1;
    const date = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[1]);

    const h = Number(str.substring(8, 10));
    const m = Number(str.substring(10, 12));
    const s = Number(str.substring(12, 14));
    return new Date(Date.UTC(year, month, date, h, m, s));
  }

  // 地址栏获取日期并转换为标准格式
  getDateParams(value): any {
    if (value === null || value === '' || value === undefined) {
      return null;
    }
    if (value.length !== 8) {
      try {
        const _date = new Date(value);
        return _date;
      } catch (e) {
        return null;
      }
    }
    const str = value;
    const year = Number(str.match(/.{4}/g)[0]);
    const month = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[0]) - 1;
    const date = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[1]);
    return new Date(Date.UTC(year, month, date));
  }

  // 地址栏获取多选参数
  getMultiParams(value): any {
    let newArray = [];
    if (value === null || value === '' || value === undefined) {
      return newArray;
    }
    if (value.indexOf(',') === -1) {
      newArray.push(value);
      return newArray;
    }
    newArray = value.split(',');
    return newArray;
  }

  // 传输字符串，改变地址栏
  setUrlParams(params): void {
    let str = window.location.href;
    params = this.handleParams(params);
    // tslint:disable-next-line:forin
    for (const i in params) {
      str = this.getChangeHref(i, params[i], str);
    }
    window.location.href = encodeURI(str);
  }

  handleParams(params): any {
    const param = {};
    for (const i in params) {
      if (params[i] instanceof Object === true && i.indexOf('_') > -1) {
        const rangeList = i.split('_');
        param[rangeList[0]] = params[i]['begin'];
        param[rangeList[1]] = params[i]['end'];
      } else {
        param[i] = params[i];
      }
    }
    return param;
  }

  getChangeHref(key, value, href): any {
    if (typeof (value) === 'number') {
      value = value.toString();
    } else if (value instanceof Array === true) {
      value = this.multiToStr(value);
    } else if (value instanceof Date === true) {
      value = this.dateToStr(value);
    } else if (typeof (value) !== 'string') {
      return href;
    }
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
      for (const item of paramArray) {
        params[item.split('=')[0]] = decodeURI(item.split('=')[1]);
      }
      return params;
    }
  }


  getUrlValue(type: string, key: string, paramObj: any): any {
    if (!paramObj) {
      return undefined;
    }
    if (type === 'date') {
      return this.getDateParam(key, paramObj);
    } else if (type === 'number') {
      return this.getNumberParam(key, paramObj);
    } else if (type === 'mult' || type === 'tree') {
      return this.getMultiParam(key, paramObj);
    } else if (type === 'time') {
      return this.getTimeParam(key, paramObj);
    } else {
      return this.getParam(key, paramObj);
    }
  }

  isObjectValueEqual(obj1, obj2): boolean {
    const aProps = Object.getOwnPropertyNames(obj1);
    const bProps = Object.getOwnPropertyNames(obj2);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (const item of aProps) {
      const propName = item;
      const propA = obj1[propName];
      const propB = obj2[propName];
      if ((typeof (propA) === 'object')) {
        if (this.isObjectValueEqual(propA, propB)) {
          return true;
        } else {
          return false;
        }
      } else if (propA !== propB) {
        return false;
      } else { }
    }
    return true;
  }

  getTreeValue(tree: Array<any>, value: Array<any>, option: any): Array<any> {
    if (typeof (value) === 'string' || typeof (value) === 'number') { value = [value]; }
    if (!(value instanceof Array)) { return []; }
    let nodeName = 'nodes';
    let valueName = 'value';
    if (option && option instanceof Object) {
      if (option['nodes']) { nodeName = option['nodes']; }
      if (option['value']) { valueName = option['value']; }
    }
    const values = [];
    if (tree instanceof Array) {
      this.getTreeValueLoop(tree, value, nodeName, valueName, values);
    }
    return values;
  }

  getTreeValueLoop(tree: Array<any>, value: Array<any>, nodeName: string, valueName: string, values: Array<any>): void {
    for (const item of tree) {
      if (item instanceof Object && value.indexOf(item[valueName]) > -1) {
        values.push(item);
      }
      if (item[nodeName] && item[nodeName] instanceof Array) {
        this.getTreeValueLoop(item[nodeName], value, nodeName, valueName, values);
      }
    }
  }

}
