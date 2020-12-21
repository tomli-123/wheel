import { ChangeDetectorRef, OnInit, ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '@qiuer/core';
import { ColumnMetadata } from '../../../dataset/table/table.component';

export class TodoItemNode {
  nodes: TodoItemNode[];
  name: string;
  value: string;
  expandable: boolean;
}

/**
 * Checklist demo with flat tree
 */
@Component({
  selector: 'table-dialog',
  templateUrl: 'table-dialog.component.html',
  styleUrls: ['table-dialog.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class TableDialogComponent implements OnInit {

  @ViewChild('tableSelect', { static: true }) tableSelect: any;
  public title: string;
  public labelField: any;
  public valueField: any;
  public value: any;
  public multSelect: boolean;
  public url: string;
  public hasCheck = false;
  public columns: ColumnMetadata[];
  public openIntelligent: boolean; // 是否开启智能模式
  public size: string;
  public height: string;
  public contentclass: string;

  /** The selection for checklist */
  public checklistSelection = [];

  public replaceData: any = {
    value: 'value',
    label: 'label'
  };

  public tableMetadata: any = {};
  public tableData: any = {};

  constructor(private dialogRef: MatDialogRef<TableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private changeDetectorRef: ChangeDetectorRef,
    private cs: ContainerService) {
    // console.log('table dialog init', dialogData);
    this.title = dialogData['title'];
    this.labelField = dialogData['labelField'];
    this.valueField = dialogData['valueField'];
    this.columns = dialogData['columns'];
    this.size = dialogData['size'];
    this.height = dialogData['height'];
    this.value = dialogData['value'];
    this.multSelect = dialogData['isMultiSelect'];
    this.url = dialogData['url'];
    this.openIntelligent = dialogData['openIntelligent'];
    this.contentclass = 'dialog-content ' + this.height;
    console.log(this.contentclass);
    this.replaceName({
      label: this.labelField,
      value: this.valueField
    });
  }

  replaceName(data): void {
    if (data) {
      this.replaceData.value = data['value'] || 'value';
      this.replaceData.label = data['label'] || 'label';
    }
  }

  canSubmit = (): boolean => {
    if (this.checklistSelection && this.checklistSelection.length > 0) {
      return false;
    }
    return true;
  }

  objClone(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }

  submit(): void {
    if (!this.hasCheck) {
      this.dialogRef.close(this.value);
      return;
    }
    const selected = this.checklistSelection;
    if (this.multSelect === true) {
      const selectedValue = [];
      for (const item of selected) {
        if (typeof item[this.replaceData.value] !== 'undefined') {
          selectedValue.push(item[this.replaceData.value]);
        }
      }
      this.dialogRef.close(Array.from(new Set(selectedValue)));
    } else {
      const selectData = {
        selectedValue: [],
        selectedName: ''
      };
      for (const item of selected) {
        if (item[this.replaceData.value]) {
          selectData.selectedValue.push(item[this.replaceData.value]);
          selectData.selectedName = item[this.replaceData.label];
        }
      }
      this.dialogRef.close(selectData);
    }

  }

  getData(): void {
    console.log('getData');
    const selectData = {
      field: this.replaceData.value,
      value: this.multSelect ? this.value : this.value[0]
    };
    if (this.url) {
      this.cs.postData(this.url, null).then((res: any) => {
        const temp = {
          data: res.data || []
        };
        if (this.value.length > 0) {
          temp['defaultValue'] = selectData;
        }
        this.tableData = temp;
      });
    } else {
      const temp = {
        data: this.dialogData['data']
      };
      if (this.value.length > 0) {
        temp['defaultValue'] = selectData;
      }
      this.tableData = temp;
    }
  }

  tableEventReducer(e): void {
    // console.log('tableEventReducer', e, this.tableSelect);
    switch (e.type) {
      case 'selectionChange':
        this.checklistSelection = e.data.selected;
        this.hasCheck = true;
        break;

      default:
        break;
    }
  }

  ngOnInit(): void {
    // console.log('table dialog init', this);
    this.tableMetadata = {
      id: 'table', type: 'table-dataset',
      isSelect: true,
      isSort: true,
      isMultiple: this.multSelect,
      openIntelligent: this.openIntelligent,
      isToolbar: true,
      isMsg: true,
      isFilter: true,
      isPaginator: true,
      columns: this.columns,
      style: {}
    };
    this.getData();
  }
}
