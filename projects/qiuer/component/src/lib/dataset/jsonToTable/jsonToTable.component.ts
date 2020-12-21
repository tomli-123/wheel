import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { DomSanitizer } from '@angular/platform-browser';


export interface JsonToTableDatasetMetadata extends DatasetMetadata {
  data?: string | object | JSON;
}

@Component({
  selector: 'jsonToTable',
  template: `
    <div class="tableHtml" [innerHTML]="tableHtml|safeHtml"></div>
  `,
  styleUrls: ['jsonToTable.component.scss'],
})
export class JsonToTableComponent extends DatasetComponent implements OnInit, OnDestroy {
  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }
  tableHtml: any;
  // format: Function = function (t) {
  //   const args = arguments;
  //   console.log(args);
  //   return t.replace(/{(\d+)}/g, function (match, number) {
  //     return typeof args[number + 1] !== 'undefined' ? args[number + 1] : '{' + number + 1 + '}';
  //   });
  // };
  public set data(data: string | object | JSON) {
    if (data === '' || data === null || data === undefined) {
      return;
    }
    let jsonObject;
    try {
      if (typeof data === 'string') {
        jsonObject = JSON.parse(data);
      } else {
        jsonObject = data;
      }
    } catch (e) {
      console.error('JSON格式有误', e);
    }

    try {
      this.tableHtml = this.ConvertJsonToTable(jsonObject, 'jsonTable', null, '点击访问');
    } catch (e) {
      console.log(e);
    }

  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata: JsonToTableDatasetMetadata = this._metadata;
    // console.log(metadata);
    this.data = metadata.data;
  }

  ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText): any {
    const link = linkText ? '<a href="{0}">' + linkText + '</a>' : '<a href="{0}">{0}</a>';

    const idMarkup = tableId ? ' id="' + tableId + '"' : '';
    const classMarkup = tableClassName ? ' class="' + tableClassName + '"' : '';
    let tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

    let th = '<thead>{0}</thead>';
    let tb = '<tbody>{0}</tbody>';
    const tr = '<tr>{0}</tr>';
    const thRow = '<th>{0}</th>';
    const tdRow = '<td>{0}</td>';
    const tdClassRow = '<td class="{1}">{0}</td>';
    let thCon = '';
    let tbCon = '';
    let trCon = '';
    if (!parsedJson) { return null; }
    const isArray = Array.isArray(parsedJson);
    const isObjectArray = typeof (parsedJson[0]) === 'object';
    // console.log('json=', parsedJson, 'isArray='+isArray, 'isObjectArray='+isObjectArray);

    // Create table headers from JSON data
    // Must loop all items
    let headers;
    // Create table rows from Json data
    if (!isArray) {
      // console.log('非数组', parsedJson);
      for (const key in parsedJson) {
        if (key) {
          // console.log('key=', key);
          tbCon += this.format(tdClassRow, key, 'key');
          tbCon += this.format_value(parsedJson[key], tdClassRow, tdRow, tableClassName, linkText);
          trCon += this.format(tr, tbCon);
          tbCon = '';
        }
      }
    } else if (isArray && !isObjectArray) { // 是纯类型数组
      // console.log('纯类型数组', parsedJson);
      for (let i = 0; i < parsedJson.length; i++) {
        tbCon += this.format_value(parsedJson[i], tdClassRow, tdRow, tableClassName, linkText);
        trCon += this.format(tr, tbCon);
        tbCon = '';
      }
    } else {
      // console.log('对象数组', parsedJson, headers);
      headers = this.array_keys(parsedJson);
      // console.log('headers', headers);
      for (let i = 0; i < headers.length; i++) {
        thCon += this.format(thRow, headers[i]);
      }

      if (headers.length > 0) {
        const urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
        const javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

        for (let i = 0; i < parsedJson.length; i++) {
          for (let j = 0; j < headers.length; j++) {
            const value = parsedJson[i][headers[j]];
            const isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);
            if (isUrl) {
              tbCon += this.format(tdRow, this.format(link, value));
            } else {
              if (value) {
                if (typeof (value) === 'object') {
                  tbCon += this.format(tdRow, this.ConvertJsonToTable(value, null, tableClassName, linkText));
                } else {
                  tbCon += this.format_value(value, tdClassRow, tdRow, tableClassName, linkText);
                }
              } else if (typeof (value) === 'number') {
                // console.log('isNumber', value);
                tbCon += this.format(tdClassRow, 0, 0);
              } else { // If value == null we format it like PhpMyAdmin NULL values
                tbCon += this.format(tdClassRow, 'null', 'null');
              }
            }
          }
          trCon += this.format(tr, tbCon);
          tbCon = '';
        }
      }
    }
    th = this.format(th, this.format(tr, thCon));
    tb = this.format(tb, trCon);
    tbl = this.format(tbl, th, tb);
    return tbl;
  }

  format_value(value, tdClassRow, tdRow, tableClassName, linkText): any {
    let tbCon = '';
    switch (typeof (value)) {
      case 'number': tbCon = this.format(tdClassRow, value, 'number'); break;
      case 'boolean': tbCon = this.format(tdClassRow, value, 'boolean'); break;
      case 'string': tbCon = this.format(tdClassRow, value, 'string'); break;
      case 'object':
        const html = this.format(tdRow, this.ConvertJsonToTable(value, null, tableClassName, linkText));
        // console.log('format_value=object', html);
        tbCon += html; break;
      default: tbCon = this.format(tdClassRow, value, null);
    }
    return tbCon;
  }


  array_keys(array): any {
    const tmp = {};
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      for (const key in item) {
        if (key) {
          tmp[key] = null;
        }
      }
    }
    const headers = [];
    for (const key in tmp) {
      if (key) {
        headers.push(key);
      }
    }
    return headers;
  }

  format(t?, a?, b?, c?): any {

    const newArray = [];
    if (a !== undefined) {
      newArray.push(a);
    }
    if (b !== undefined) {
      newArray.push(b);
    }
    if (c !== undefined) {
      newArray.push(c);
    }
    if (a === '' || b === '' || c === '') {
      return t.replace(/{(\d+)}/g, '');
    } else {
      return t.replace(/{(\d+)}/g, (match, number) => {
        return typeof newArray[number] !== undefined && newArray[number] !== 'undefined' ? newArray[number] : '{' + number + '}';
      });
    }
  }
}
