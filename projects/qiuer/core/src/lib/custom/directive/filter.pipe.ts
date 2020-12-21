import {Pipe, PipeTransform, Injectable} from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any, term: any, designated?, unfilter?): any {
    /*items源，term第一次过滤输入，designated第一次过滤指定的字段没有填null,unfilter当输入=unfilter当输入时不去过滤*/

    if (!items) {
      return;
    }
    if (!unfilter) {
      unfilter = null;
    }
    if (!designated) {
      designated = null;
    }

    if (!term || term === 'ALL') {
      return items;
    }

    // console.log(items);

    return items.filter(function (item) {
      if (typeof item !== 'object') {
        if (item.toString().includes(term)) {
          return true;
        }
      }

      if (typeof item == 'object' && designated!==null) {
        if (!item[designated]) {
          return false;
        }
        if(item[designated].toString().toLowerCase().includes(term.toString().toLowerCase())) {
          return true;
        }
      }

      if (typeof item == 'object' && designated === null) {
        for (let property in item) {
          if (item[property] === null) {
            continue;
          }
          if (item[property].toString().toLowerCase().includes(term.toString().toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });


  }
}

