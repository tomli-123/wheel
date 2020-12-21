import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { FormLayoutMetadata } from '../../layout/form/form.component';
import { LayoutMetadata } from '../../layout/layout.component';
import { AlignLayoutMetadata } from './../../layout/align/align.component';
import { ContainerMetadata, ContainerService, RootComponent, RootMetadata, HeaderBtn } from '@qiuer/core';

interface HelpDlg {
  name: string;
  docid: string;
}


export interface QueryRootMetadata extends RootMetadata {
  helpTabs: HelpDlg[];
  formChild?: FormLayoutMetadata;
  buttonChild?: AlignLayoutMetadata;
  dataChild?: LayoutMetadata;
  // name?: string;

  // formStyle?: string; // 表单样式
  // dataStyle?: string; // data节点样式
}

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})

export class QueryRootComponent extends RootComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: QueryRootMetadata;
  public _childs: ContainerMetadata[];

  public _helpTabs: HelpDlg[];
  public _isShowForm = false;
  public isActive = false;
  public _formChild: FormLayoutMetadata;
  public _buttonChild: AlignLayoutMetadata;
  public _dataChild: LayoutMetadata;
  public _headerBtns: HeaderBtn[] = [{ icon: 'dots-vertical', id: 'form' }];

  public _dataHeight: number;
  public _dataWidth: number;
  public _repaint = false;

  @ViewChild('query_form', { static: false }) query_form: ElementRef;
  @ViewChild('query_data', { static: false }) query_data: ElementRef;

  constructor(public _service: ContainerService, private el: ElementRef, private renderer2: Renderer2) {
    super(_service);
  }

  /********************************* get set *********************************/
  public set helpTabs(helpTabs: HelpDlg[]) { this._helpTabs = helpTabs; }
  public get helpTabs(): HelpDlg[] {
    return this._helpTabs;
  }

  public set isShowForm(isShowForm: boolean) { this._isShowForm = isShowForm; }
  public get isShowForm(): boolean {
    return this._isShowForm;
  }

  public set dataHeight(dataHeight: number) { this._dataHeight = dataHeight; }
  public get dataHeight(): number {
    return this._dataHeight;
  }

  public set dataWidth(dataWidth: number) { this._dataWidth = dataWidth; }
  public get dataWidth(): number {
    return this._dataWidth;
  }

  public set formStyle(formStyle: object) {
    for (const i of Object.keys(formStyle)) {
      this.renderer2.setStyle(this.query_form.nativeElement, i, formStyle[i]);
    }
  }

  public set dataStyle(dataStyle: object) {
    for (const i of Object.keys(dataStyle)) {
      this.renderer2.setStyle(this.query_data.nativeElement, i, dataStyle[i]);
    }
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  layoutChange(): any {
    this._repaint = !this._repaint;
    this.onLayoutChangeSubject.next(true);
  }

  showOrHide(): void {
    this.isShowForm = !this.isShowForm;
    setTimeout(() => {
      this.root.layoutChange();
    }, 100);
  }

  openShareDialog(): void {
    const shareDialog = {
      id: 'shareDialog',
      type: 'common-dialog',
      title: '扫一扫',
      size: 'tiny',
      height: 'height-medium',
      isClosedByESC: true,
      contentChild: {
        id: 'content',
        type: 'div-form',
        childs: [
          {
            id: 'qrcode',
            type: 'qrcode-dataset',
            url: window.location.href,
            size: 200,
            style: {
              width: '100%'
            }
          }
        ],
        fullHeight: true
      }
    };
    this.openCustDialog(shareDialog);
  }

  openHelpDialog(): void {
    const helpDialog = {
      id: 'helpDialog',
      type: 'common-dialog',
      scope: {},
      contentChild: {
        id: 'content',
        type: 'div',
        childs: [
          {
            id: 'tabs',
            type: 'tab-panel',
            childs: [
            ],
            onSelectedIndexChange: '(index)=>{\r\n    this.call(\'ufGetDocument\',index);\r\n}',
            ufGetDocument: '(index) => { \r\n  if (this.scope[\'helpTabs\'][index] && !this.scope[\'helpTabs\'][index][\'html\']) {\r\n        this.postData(\'do/80.15\', { docid: this.scope[\'helpTabs\'][this.tabIndex][\'docid\'] }, (res) => {\r\n            let id = \'helpHtml\' + index;\r\n            this.cid(id).template = res[\'data\'][\'content\'];\r\n            this.scope[\'helpTabs\'][index][\'html\'] =true;\r\n        });\r\n    }\r\n\r\n}'
          }
        ]
      },
      title: '帮助',
      size: 'huge',
      height: 'height-large',
      version: '2.5.4'
    };
    const htmlChilds = [];
    this.helpTabs.forEach((help, index) => {
      const tab = {
        id: 'tab',
        type: 'div',
        childs: [
          {
            id: 'helpHtml',
            type: 'html-dataset'
          }
        ],
        name: ''
      };
      tab['id'] = 'tab' + index;
      tab['name'] = help['name'];
      tab['childs'][0]['id'] = 'helpHtml' + index;
      htmlChilds.push(tab);
    });
    helpDialog['scope']['helpTabs'] = this.helpTabs;
    helpDialog['contentChild']['childs'][0]['childs'] = htmlChilds;
    this.openCustDialog(helpDialog);
  }

  headerBtnClick(id: string): void {
    this.showOrHide();
  }

  openNewPage(): void {
    window.open(window.location.href, '_blank');
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this._formChild = this._metadata.formChild;
    this._dataChild = this._metadata.dataChild;
    this._buttonChild = this._metadata.buttonChild;
    this.helpTabs = this._metadata.helpTabs;
    this._childs = [this._formChild, this._buttonChild, this._dataChild];
  }



  ngAfterViewInit(): void {
    // this.dataHeight = this.query_data.nativeElement.offsetHeight;
    // this.dataWidth = this.query_data.nativeElement.offsetWidth;
    super.ngAfterViewInit();
  }

  /***********************************************************************************/
  /*                           自定义方法                             */
  /***********************************************************************************/
}
