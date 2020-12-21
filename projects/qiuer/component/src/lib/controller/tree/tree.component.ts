/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/* 2019/6/21 贾磊 修复 replaceData字段与dialog与tree-select中的字段对应问题
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { TreeDialogComponent } from './tree-dialog/tree-dialog.component';

export class Option {
  nodes?: string; // 节点名；
  value?: string; // 选中的value字段;
  label?: string; // 展示的label;
}

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface TreeControllerMetadata extends ControllerMetadata {
  options?: object[]; // tree组件的数据
  isMultiSelect?: boolean; // 配置是否多选（true：多选）
  hasClear?: boolean; // 清除按钮
  option?: Option; // 配置对应的节点名称（nodes），展示名称（name），对应节点值（value）
  canHoverData?: boolean; // 是否可以hover显示数据 默认不显示
  hoverLength?: number; // hover显示数据长度 默认显示前十条
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get
/* value 表单的值
/* urlParam 当表单setURLparam时，url对应字段上处理后的值
/* set hasClear 是否有清除按钮
/***********************************************************************************/
@Component({
  selector: 'tree-ctrl',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: TreeControllerMetadata;
  public displayName: string;
  public _hasClear: boolean;
  public _options: object[];
  public isMultiSelect = false;
  public _canHoverData = false;
  public _hoverLength: number;
  public selectTip: string; // 显示已选择数据
  public _selectionNodes = []; // 选中的Nodes
  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  private _option: Option = {
    nodes: 'nodes',
    label: 'label',
    value: 'value'
  };

  private formatValueAsArray(value: any): any {
    if (value instanceof Array === false) {
      return [value];
    } else {
      return value;
    }
  }

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, public dialog: MatDialog) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  openTreeDialog(): void {
    if (this._formControl.disabled) {
      return;
    }
    const dialogRef = this.dialog.open(TreeDialogComponent, {
      data: {
        title: this.label,
        items: this.options,
        value: this.formatValueAsArray(this.value),
        isMultiSelect: this.isMultiSelect,
        replaceData: this._option
      },
      panelClass: ['panelClass-dialog', 'col-sm'],
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._selectionNodes = result.nodes;
        if (!this.isMultiSelect) {
          this._formControl.setValue(result.value.selectedValue[0]);
          this.displayName = result.value.selectedName || '';
        } else {
          this._formControl.setValue(result.value);
        }
      }
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get selectionNodes(): any {
    return this._selectionNodes || [];
  }
  public set options(options: Array<object>) {
    this._options = options;
    if (!this.isMultiSelect) {
      const selected = this._ctrlService.getTreeValue(options, this._formControl.value, this._option);
      if (selected.length > 0) { this.displayName = selected[0][this._option.label]; }
    }
  }
  public get options(): Array<object> { return this._options; }

  public set hasClear(hasClear: boolean) {
    this._hasClear = !!hasClear;
  }

  public set value(value) {
    this._formControl.setValue(value);
    if (!this.isMultiSelect) {
      this.displayName = value instanceof Array && value.length > 0 ? value[0][this._option.label] || '' : '';
    }
  }
  public get value(): any {
    return this._formControl.value || [];
  }

  public get urlParam(): string {
    if (this.isMultiSelect === true) {
      return null;
    } else {
      return this.value;
    }
  }
  public set urlParam(urlParam: string) {
    const param = this.transFromParam(urlParam);
    this.value = param;
  }
  public set canHoverData(canHoverData: boolean) {
    this._canHoverData = !!canHoverData;
  }

  public get canHoverData(): boolean {
    return this._canHoverData;
  }

  public set hoverLength(hoverLength: number) {
    this._hoverLength = hoverLength;
  }

  public get hoverLength(): number {
    return this._hoverLength;
  }
  _setSelectTip(val: any[]): void {
    let htmlStr = '';
    let newHtml = '';
    this.options.forEach(element => {
      const option = this._option;
      htmlStr += val.indexOf(element[option.value]) > -1 ? element[option.label] + '\n' : '';
    });
    // console.log('**************' + htmlStr);
    if (htmlStr.split('\n').length > (this.hoverLength + 1)) {
      let select = [];
      select = htmlStr.split('\n').slice(0, this.hoverLength);
      for (const item of select) {
        newHtml += item + '\n';
      }
      newHtml += '......';
      this.selectTip = newHtml;
    } else {
      this.selectTip = htmlStr;
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata = this._metadata;
    this.options = metadata.options || [];
    this.hasClear = metadata.hasClear;
    if (metadata.isMultiSelect) { this.isMultiSelect = true; }
    this.canHoverData = this._metadata.canHoverData;
    this.hoverLength = this._metadata.hoverLength || 10;
    const option: any = metadata.option;
    if (option) {
      if (option.nodes) { this._option.nodes = option.nodes; }
      if (option.value) { this._option.value = option.value; }
      if (option.label) { this._option.label = option.label; }
    }
    if (this.canHoverData) {
      this.subs(this.id, 'valueChange', (e) => {
        e = this.formatValueAsArray(e);
        // console.log('+++++++', this.selectTip, e, this);
        this._setSelectTip(e);
      });
    }
    // console.log('init over++++++++', this._formControl);
  }

}
