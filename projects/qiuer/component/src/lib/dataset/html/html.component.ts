import { Component, OnInit, ViewEncapsulation, OnDestroy, Renderer2, ElementRef, NgZone } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
/**
 * 基础模板标识<% %>
 * @ParamCell 变量标识 <%{ something }%>
 * @FuncCell 函数名标识 <%( something )%>
 * @循环体标识 <%[ data=<%{ something }%> something ]%>
 */
class BaseCell {
  public get(data: any): string { return null; }
}
class TextCell extends BaseCell { // 文本类型单元格类 调用返回一段文本
  constructor(private template: string) { super(); }
  public get(data: any): string { return this.template; }
}
class ParamCell extends BaseCell { // 变量填充类型单元格类 调用返回函数返回的文本
  private func: Function;
  constructor(private template: string, private html: any) {
    super();
    if (this.html._service.isFunction(this.template)) {
      // tslint:disable-next-line:no-eval 如果是函数则调用函数
      this.func = eval('(' + this.template + ')');
    } else {
      // tslint:disable-next-line:no-eval 如果是变量名则填充对应变量 cellStr=data.' + this.template + ' || "";
      this.func = eval('(' + 'function (data) { if (data instanceof Object) { let cellStr=""; try { cellStr=(data.' + this.template + ' || data.' + this.template + ' === 0) ? data.' + this.template + ' : "" } catch (e) {}; return cellStr; } else { return ""; } }' + ')');
    }
  }
  public get(data: any): string {
    const ret = this.func(data);
    return ret;
  }
}
class FuncCell extends BaseCell {
  private _fnName: any = [];
  constructor(private fnKey: string, private html: any) {
    super();
    this.fnKey = this.fnKey.replace(/\s+/g, '');
    const _arr = this.fnKey.split(';');
    _arr.forEach(item => {
      this._fnName.push(this.html._rootClass + '.' + item);
    });
  }
  public get(data: any): any {
    const _str = this._fnName.join(';');
    return _str;
  }
}
export interface HtmlDatasetMetadata extends DatasetMetadata {
  template?: string;
  hiddenLoading?: boolean; // 是否隐藏loading
  clsBg?: boolean;   //  html报表的背景图
  css?: string; // class集合字符串 <style>something class</style>
  script?: string; // function方法 function xxx(html: HtmlDatasetComponent, data: 对应的cellData) {}
}
@Component({
  selector: 'html-dataset',
  styleUrls: ['./html.component.scss'],
  templateUrl: './html.component.html'
  // encapsulation: ViewEncapsulation.None
})
export class HtmlDatasetComponent extends DatasetComponent implements OnInit, OnDestroy {

  public _metadata: HtmlDatasetMetadata;
  // 默认样式
  public _clsBg: boolean;
  public _template: string; // html展示字符串
  private templateStr: string; // 用户的模板数据
  public _css: string; // css字符串
  private cssStr: string; // 用户的css数据
  public _htmlData: any = {}; // 数据
  public _rootClass = '_html_' + Date.now(); // 包裹层class
  public _cellsTree: any; // 树结构的模板数据
  public _hiddenLoading = false;

  constructor(public _service: ContainerService, public _ds: DatasetService,
    public el: ElementRef, public renderer2: Renderer2, public zone: NgZone) {
    super(_service, _ds, el, renderer2);
  }
  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get clsBg(): boolean { return this._clsBg; }
  public set clsBg(clsBg: boolean) {
    if (clsBg) {
      this._clsBg = !!clsBg;
      this._clazz['showContentBg'] = this._clsBg;
    }
  }
  public set data(data: any) {
    this._htmlData = data || {};
    this.replaceHtml();
  }
  public get data(): any { return this._htmlData; }

  public set template(_template: string) {
    this.templateStr = _template;
    _template = _template ? _template.replace(/[\r\n]/g, '') : '';
    const _data = this.getLoopBody(_template, '<%[', ']%>', true);
    const _tree = this._ds.translateDataToTree(JSON.parse(JSON.stringify(_data.loops)));
    const _cells = _tree instanceof Array && _tree.length > 0 ? {
      children: JSON.parse(JSON.stringify(_tree)), template: _template
    } : { children: [], template: _template };
    this.getReplaceTem(_cells);
    this._cellsTree = _cells;
    this.replaceHtml();
  }
  public get template(): string { return this.templateStr; }
  public set css(css: string) {
    this.cssStr = css;
    css = css.replace(/[\r\n]/g, '').replace(/\/\*.*?\*\//g, '');
    css = css.replace(/↵/g, ' ');
    const _data_ = this.getLoopBody(css, '{', '}');
    const _cssArr = _data_.template.split('loop%>').filter(item => !!item.trim());
    for (let i = 0; i < _cssArr.length; i++) {
      if (_cssArr[i].indexOf('@media') === -1) {
        const _id = _cssArr[i].replace(/.*?\<%loop id_/, '');
        const _mediaObj = _data_.loops.filter(item => item.id === Number(_id))[0];
        const _prefix = _cssArr[i].indexOf('@keyframes') === -1 ? `.${this._rootClass}` : '';
        _cssArr[i] = `${_prefix} ${_cssArr[i]}`.replace(`<%loop id_${Number(_id)}`, _mediaObj.template);
      } else {
        const _id = _cssArr[i].replace(/@media.*?\<%loop id_/, '');
        const _mediaObj = _data_.loops.filter(item => item.id === Number(_id))[0];
        _mediaObj.template = this.getCss(_mediaObj.template.slice(1, -1));
        _cssArr[i] = _cssArr[i].replace(`<%loop id_${Number(_id)}`, `{${_mediaObj.template}}`);
      }
    }
    this._css = '<style>' + _cssArr.join('') + '</style>';
    this.replaceHtml();
  }
  public get css(): string { return this.cssStr; }
  private set script(script: string | object) { // 只许初始化 不许修改
    if (script) {
      let _htmlScript = {};
      if (script instanceof Object === false) {
        try {
          // tslint:disable-next-line:no-eval
          _htmlScript = eval('(' + script + ')');
        } catch (e) { console.error(e); }
      } else { _htmlScript = script; }
      if (_htmlScript && _htmlScript instanceof Object) {
        for (const i of Object.keys(_htmlScript)) {
          try {
            // tslint:disable-next-line:no-eval
            const _fn = eval('(' + _htmlScript[i] + ')');
            _htmlScript[i] = _fn.bind(this);
          } catch (e) { console.error(e); }
        }
        window[this._rootClass] = _htmlScript;
      }
    }
  }

  getCss(str): string {
    const _arr = str.split(/({.*?})/);
    const _pushArr = [];
    _arr.forEach((item, index) => {
      const _str = item.replace(/[\r\n]/g, '').trim();
      if (index % 2 === 0 && _str) {
        item = item.trim();
        item = '.' + this._rootClass + ' ' + item;
      }
      _pushArr.push(item);
    });
    return _pushArr.join('');
  }

  private getLoopBody(_template: string, startStr: string, endStr: string, hasData?: boolean): any {
    const _indexArr = [];
    let _start = _template.indexOf(startStr);
    let _end = _template.indexOf(endStr);
    while (_start > -1) {
      _indexArr.push({ startIndex: _start, id: _indexArr.length });
      _start = _template.indexOf(startStr, _start + 1);
    }
    while (_end > -1) {
      for (let i = _indexArr.length - 1; i > -1; i--) {
        if ('endIndex' in _indexArr[i] === false && _end > _indexArr[i]['startIndex']) { _indexArr[i]['endIndex'] = _end; break; }
      }
      _end = _template.indexOf(endStr, _end + 1);
    }
    for (const indexItem of _indexArr) {
      _indexArr.forEach(item => {
        if (item.startIndex < indexItem.startIndex && item.endIndex > indexItem.endIndex) { indexItem['pid'] = item.id; }
      });
      indexItem['template'] = _template.substring(indexItem['startIndex'], indexItem['endIndex']);
      if (hasData) {
        indexItem['dataKey'] = indexItem['template'].match(/\<%\[.*?data.*?=.*?<%{.*?}%>/)[0].replace(/[\r\n]/g, '')
          .replace(/\s+/g, '').match(/<%{\S*}%>/)[0].replace(/<%{/, '').replace(/}%>/, '');
      }
      indexItem['template'] = indexItem['template'] + endStr;
    }
    const _topLoop = _indexArr.filter(item => ('pid' in item) === false);
    for (const item of _topLoop) {
      _template = _template.replace(item.template, `<%loop id_${item.id} loop%>`);
    }
    return { template: _template, loops: _indexArr };
  }

  private getReplaceTem(data: any): void { // data.template data.children
    if (data && data instanceof Object) {
      data['replaceTem'] = data['template'];
      if ('children' in data && data['children'] instanceof Array) {
        for (let i = 0; i < data['children'].length; i++) {
          data['replaceTem'] = data['replaceTem'].replace(data['children'][i].template, `<%loop id_${data['children'][i].id} loop%>`);
          this.getReplaceTem(data['children'][i]);
        }
      }
      data['replaceTem'] = data['replaceTem'].replace(/\<%\[.*?data.*?=.*?<%{.*?}%>/, '').replace(/]%>/, '');
      data['cells'] = this.getCells(data['replaceTem']);
    }
  }

  private getCells(template: string): any {
    const _arr = template.split(/(<%.*?%>)/); const cells = [];
    _arr.forEach(cell => {
      if (cell.indexOf('<%(') > -1 && cell.indexOf(')%>') > -1) {
        const _key = cell.replace(/<%\(/, '').replace(/\)%>/, '');
        cells.push(new FuncCell(_key, this));
      } else if (cell.indexOf('<%{') > -1 && cell.indexOf('}%>') > -1) {
        const _key = cell.replace(/<%{/, '').replace(/}%>/, '');
        cells.push(new ParamCell(_key, this));
      } else { cells.push(new TextCell(cell)); }
    });
    return cells;
  }

  public replaceHtml(): void { // console.log('============时间戳', this._rootClass);
    let initHtml = `${this._css || ''}<div class="${this._rootClass}">`;
    const htmlTree = [];
    this.getLoopHtml(this._cellsTree, this._htmlData, htmlTree);
    this.setHtmlData(htmlTree);
    const _html = htmlTree instanceof Array && htmlTree.length > 0 && 'html' in htmlTree[0] ? htmlTree[0].html : '';
    initHtml += `${_html}</div>`;
    this._template = initHtml;
  }

  private setHtmlData(data): void {
    if (data && data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]['children'] && data[i]['children'].length > 0) {
          for (let l = 0; l < data[i]['children'].length; l++) {
            if (data[i]['children'][l] instanceof Array) {
              let _html = '';
              for (let j = 0; j < data[i]['children'][l].length; j++) {
                if ((data[i]['children'][l][j]['children'])) { this.setHtmlData(data[i]['children'][l]); }
                _html += data[i]['children'][l][j].html;
              }
              data[i].html = data[i].html.replace(/<%loop.*?loop%>/, _html);
            }
          }
        }
      }
    }
  }

  private getLoopHtml(cells, data, htmlCell): void {
    if (cells && 'cells' in cells && cells['cells'] instanceof Array) {
      let htmlStr = '';
      cells.cells.forEach(cell => { htmlStr += cell.get(data); });
      const _html = { html: htmlStr, children: [] };
      if ('children' in cells && cells['children'] instanceof Array) {
        for (let j = 0; j < cells['children'].length; j++) {
          const _data = cells['children'][j].dataKey in data && data[cells['children'][j].dataKey] instanceof Array ?
            data[cells['children'][j].dataKey] : [];
          const _arr = [];
          for (let i = 0; i < _data.length; i++) {
            this.getLoopHtml(cells['children'][j], _data[i], _arr);
          }
          _html['children'].push(_arr);
        }
      }
      htmlCell.push(_html);
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.css = this._metadata.css || '';
    this.data = this._metadata.defaultData;
    this.template = this._metadata.template || '';
    this.clsBg = this._metadata.clsBg;
    this.script = this._metadata.script;
    this._hiddenLoading = !!this._metadata.hiddenLoading;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (window[this._rootClass]) { delete window[this._rootClass]; }
  }

}
