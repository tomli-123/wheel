import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'tree-dialog',
  templateUrl: 'tree-dialog.component.html',
  styleUrls: ['tree-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.None
})
export class TreeDialogComponent {

  title: string;
  items: any;
  value: any;
  multSelect: boolean;

  filterValue: string;

  hasCheck = false;

  /** The selection for checklist */
  checklistSelection = [];

  replaceData: any = {
    nodes: 'nodes',
    value: 'value',
    label: 'label'
  };

  constructor(private dialogRef: MatDialogRef<TreeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private changeDetectorRef: ChangeDetectorRef) {
    this.title = dialogData['title'];
    this.items = dialogData['items'];
    this.value = dialogData['value'];
    this.multSelect = dialogData['isMultiSelect'];
    this.filterValue = '';
    this.replaceName(dialogData['replaceData']);
  }

  searchTree(value): void {
    this.filterValue = value;
  }

  claerFilter($event): void {
    if ($event.value.length > 0) {
      $event.value = '';
      this.searchTree($event.value);
    }
  }

  replaceName(data): void {
    if (data) {
      this.replaceData.nodes = data['nodes'] || 'nodes';
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

  checkEvent(event): void {
    this.checklistSelection = this.objClone(event);
    this.hasCheck = true;
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
        if (item[this.replaceData.value]) {
          selectedValue.push(item[this.replaceData.value]);
        }
      }
      this.dialogRef.close({
        value: Array.from(new Set(selectedValue)),
        nodes: selected
      });
    } else {
      const selectData = {
        selectedValue: [],
        selectedName: ''
      };
      for (const item of selected) {
        if (item[this.replaceData.value]) {
          selectData.selectedValue.push(item[this.replaceData.value]);
          selectData.selectedName = item['label'];
        }
      }
      this.dialogRef.close({
        value: selectData,
        nodes: selected
      });
    }

  }

}
