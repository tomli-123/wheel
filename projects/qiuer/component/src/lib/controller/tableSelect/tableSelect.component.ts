/***********************************************************************************/
/* author: 林清将
/* update logs:
/* 2019/10/11 林清将 创建
/***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from '../controller.service';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { TableDialogComponent } from './table-dialog/table-dialog.component';

import { ColumnMetadata } from '../../dataset/table/table.component';

// export class Column {
//   value?: string; // 选中的value字段;
//   label?: string; // 展示的label;
// }
/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface TableControllerMetadata extends ControllerMetadata {
  data?: object[]; // table组件的数据
  columns?: ColumnMetadata[]; // 标准table column配置
  labelField?: string; // 名称字段
  valueField?: string; // 值字段
  isMultiSelect?: boolean; // 配置是否多选（true：多选）
  hasClear?: boolean; // 清除按钮
  canHoverData?: boolean; // 是否可以hover显示数据 默认不显示
  hoverLength?: number; // hover显示数据长度 默认显示前十条
  openIntelligent?: boolean; // 是否开启智能模式, 默认不开启
  dialogSize?: string; // 弹出层宽度
  dialogHeight?: string; // 弹出层高度
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
  selector: 'table-ctrl',
  templateUrl: './tableSelect.component.html',
  styleUrls: ['./tableSelect.component.scss']
})
export class TableSelectControllerComponent extends ControllerComponent implements OnInit {
  protected _metadata: TableControllerMetadata;
  public dialogSize: string;
  public dialogHeight: string;
  public displayName: string;
  public _hasClear: boolean;
  public data: object[] = [];
  public isMultiSelect = false;
  public labelField: string;
  public valueField: string;
  private _columns: ColumnMetadata[];
  public selectTip: string; // 显示已选择数据
  public _canHoverData = false;
  public _hoverLength: number;
  public openIntelligent: boolean; // 是否开启智能模式
  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

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
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: {
        title: this.label,
        columns: this.columns,
        labelField: this.labelField,
        valueField: this.valueField,
        value: this.formatValueAsArray(this.value),
        isMultiSelect: this.isMultiSelect,
        openIntelligent: this.openIntelligent,
        size: this.dialogSize,
        height: this.dialogHeight,
        data: this.data
      },
      panelClass: ['panelClass-dialog', this.dialogSize, this.dialogHeight],
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('dialog afterClosed', result);
      if (result) {
        if (!this.isMultiSelect) {
          this._formControl.setValue(result.selectedValue[0]);
          this.displayName = result.selectedName || '';
        } else {
          this._formControl.setValue(result);
        }
        // console.log('&&&&&&&&&&&&' + this.value);
      }
    });
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set hasClear(hasClear: boolean) {
    this._hasClear = !!hasClear;
  }

  public set value(value) {
    this._formControl.setValue(value);
  }
  public get value(): any {
    return this._formControl.value || [];
  }

  public get columns(): Array<ColumnMetadata> {
    return this._columns;
  }
  public set columns(columns: ColumnMetadata[]) {
    this._columns = columns;
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
    this.data.forEach(element => {
      const valueField = this._metadata.valueField;
      htmlStr += val.indexOf(element[valueField]) > -1 ? element[this.labelField] + '\n' : '';
    });
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
    this.data = metadata.data || [];
    this.hasClear = metadata.hasClear;
    if (metadata.isMultiSelect) { this.isMultiSelect = true; }
    this.canHoverData = this._metadata.canHoverData;
    this.hoverLength = this._metadata.hoverLength || 10;
    this.columns = metadata.columns;
    this.labelField = metadata.labelField || 'name';
    this.valueField = metadata.valueField || 'id';
    this.dialogSize = metadata.dialogSize || 'medium';
    this.dialogHeight = metadata.dialogHeight || 'height-large';
    this.openIntelligent = metadata.openIntelligent || false;
    if (this.canHoverData) {
      this.subs(this.id, 'valueChange', (e) => {
        this._setSelectTip(e);
        // console.log('+++++++', this.selectTip, e, this);
      });
    }
  }

}
