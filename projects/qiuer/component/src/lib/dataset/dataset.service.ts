import { Injectable } from '@angular/core';

@Injectable()
export class DatasetService {

  regu = /^\s*function.*}$/;
  re = new RegExp(this.regu);

  reguForEs6 = /=>\s*.*}$/;
  reForEs6 = new RegExp(this.reguForEs6);

  evalObj(obj): any {
    if (!obj || obj instanceof Object !== true) {
      // console.log('return');
      return null;
    }
    for (const i of Object.keys(obj)) {
      if (typeof obj[i] === 'string' && (this.re.test(obj[i]) || this.reForEs6.test(obj[i]))) {
        // tslint:disable-next-line:no-eval
        obj[i] = eval('(' + obj[i] + ')');
      }
      if (obj[i] instanceof Object === true) {
        this.evalObj(obj[i]);
      }
      if (obj[i] instanceof Array === true) {
        for (const j of obj[i]) {
          this.evalObj(j);
        }
      }
    }
  }

  translateDataToTree(data): any {
    const parents = [];
    const children = [];
    for (const i of data) {
      if (!i.pid && i.pid !== 0) { parents.push(i); }
      if (i.pid || i.pid === 0) { children.push(i); }
    }
    this.translator(parents, children);
    return parents;
  }

  translator(parents, children): void {
    for (const parent of parents) {
      for (const current of children) {
        if (current.pid === parent.id) {
          this.translator([current], children);
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current];
        }
      }
    }
  }


}
