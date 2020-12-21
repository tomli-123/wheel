/***********************************************************************************/
/* author: 武俊
/* update logs:
/* 2019/10/15 武俊 创建
/***********************************************************************************/
import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef, AfterViewInit, ChangeDetectorRef, AfterContentInit, NgZone } from '@angular/core';
import { ContainerEvent, ContainerService, ContainerMetadata } from '@qiuer/core';
import { DatasetComponent, DatasetMetadata } from '../dataset.component';
import { DatasetService } from '../dataset.service';
import { Subject } from 'rxjs';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../controller/select.valuetype';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PageEvent } from '@angular/material/paginator';
import { _MatTabGroupBase } from '@angular/material/tabs';

export interface ListDatasetMetadata extends DatasetMetadata {
  label: string;
  rowStyle: string;
  disabled: string;
  checkboxPosition: string;
  data?: any[];
  isSelect?: boolean; // 是否支持选择
  isMultiple?: boolean; // 是否支持多选
  isShadow?: boolean; // 是否有阴影
  dragDrop?: boolean; // 是否支持拖拽
  // event
  onClick?: string;
  onDblClick?: string;
  onSelected?: string;
}

@Component({
  selector: 'list-dataset',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class ListDatasetComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  protected _metadata: ListDatasetMetadata;
  @ViewChild('listDom', { static: true }) listDom: any;
  // attr
  public isShadow: boolean;
  public _data: any = [];
  public _selection: any[] = [];
  public _label: Function;
  public _rowStyle: Function;
  public _disabled: Function;
  public checkboxPosition: string; // before|after
  public isSelect: boolean; // 是否支持选择
  public isMultiple: boolean; // 是否支持多选
  public dragDrop: boolean;
  // event
  protected _clickEvent: ContainerEvent;
  protected _dblClickEvent: ContainerEvent;
  // Subject
  onClickSubject: Subject<any> = new Subject<any>();
  onDblClickSubject: Subject<any> = new Subject<any>();
  onSelectedSubject: Subject<any> = new Subject<any>();
  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get data(): any[] {
    return this._data;
  }
  public set data(data: any[]) {
    this._data = data;
  }

  public set rowStyle(rowStyle: string) {
    if (rowStyle !== undefined && this._service.isFunction(rowStyle)) {
      this._rowStyle = this._evalStatement(rowStyle);
    } else {
      this._rowStyle = this._evalStatement('(rowdata) => {\nreturn ' + rowStyle + '\n}');
    }
  }

  public set disabled(disabled: string) {
    if (disabled !== undefined && this._service.isFunction(disabled)) {
      this._disabled = this._evalStatement(disabled);
    } else {
      this._disabled = this._evalStatement('(rowdata) => {\nreturn ' + disabled + '\n}');
    }
  }

  public set label(label: string) {
    if (label !== undefined && this._service.isFunction(label)) {
      this._label = this._evalStatement(label);
    } else {
      this._label = this._evalStatement('(rowdata) => {\nreturn rowdata[' + label + ']\n}');
    }
  }
  public set selected(selected: any[]) {
    this._selection = selected;
  }
  public get selected(): any[] {
    if (!this.isSelect) {
      return [];
    }
    const selected = this.listDom.selectedOptions.selected.map((res) => {
      return res.value;
    });
    return selected || [];
  }


  public get onClick(): string { return this._getCallback('onClick').toString(); }
  public set onClick(onClick: string) { this._setEvent('click', onClick); }
  public get onDblClick(): string { return this._getCallback('onDblClick').toString(); }
  public set onDblClick(onDblClick: string) { this._setEvent('dblClick', onDblClick); }
  public get onSelected(): string { return this._getCallback('onSelected').toString(); }
  public set onSelected(onSelected: string) { this._setEvent('selected', onSelected); }
  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    if (this._metadata.isSelect) {
      this.isSelect = true;
      this.isMultiple = this._metadata.isMultiple || false;
      this.checkboxPosition = this._metadata.checkboxPosition || 'before';
    } else {
      this.isSelect = false;
    }
    super.ngOnInit();
    this.label = this._metadata.label;
    this.isShadow = this._metadata.isShadow || false;
    if (this._metadata.rowStyle !== undefined) {
      this.rowStyle = this._metadata.rowStyle;
    }
    if (this._metadata.disabled !== undefined) {
      this.disabled = this._metadata.disabled;
    }

    this.dragDrop = this._metadata.dragDrop || false;
    this.registerEvent();
    this.onClick = this._metadata.onClick;
    this.onDblClick = this._metadata.onDblClick;
    this.onSelected = this._metadata.onSelected;
  }

  ngAfterContentInit(): void {

  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }



  /***********************************************************************************/
  /*                               私有                                              */
  /***********************************************************************************/
  isSelected(rowdata: any) {
    if (this._selection.indexOf(rowdata) !== -1) {
      return true;
    }
    return false;
  }
  getStyle(rowdata: any) {
    if (this._rowStyle) {
      return this._rowStyle(rowdata);
    }
    return {};
  }
  getLabel(rowdata: any) {
    if (this._label) {
      return this._label(rowdata);
    }
    return '';
  }
  getDisabled(rowdata: any) {
    if (this._disabled) {
      return this._disabled(rowdata);
    }
    return false;
  }
  selectionChange(event) {
    this.onSelectedSubject.next(event.option.value);
  }
  selectAll() {
    this.listDom.selectAll();
  }
  deselectAll() {
    this.listDom.deselectAll();
  }
  drop(e) {
    console.log(e);
    const previousIndex = e.previousIndex;
    const currentIndex = e.currentIndex;
    const data = this.swapArray(this.data, previousIndex, currentIndex);
    this.data = data;
  }
  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
  _click(rowdata, event) {
    if (event) {
      event.stopPropagation();
    }
    this.onClickSubject.next(rowdata);
  }
  _dblclick(rowdata, event) {
    if (event) {
      event.stopPropagation();
    }
    this.onDblClickSubject.next(rowdata);
  }
  registerEvent(): void {
    const clickEvent = new ContainerEvent('click', this.onClickSubject, '(rowdata)');
    const dblClickEvent = new ContainerEvent('dblClick', this.onDblClickSubject, '(rowdata)');
    const selectedEvent = new ContainerEvent('selected', this.onSelectedSubject, '(rowdata)');
    this._setCallbackEvent(clickEvent);
    this._setCallbackEvent(dblClickEvent);
    this._setCallbackEvent(selectedEvent);

    this._setDoEventFunction(clickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(dblClickEvent, (func: Function, e: any) => {
      func(e);
    });
    this._setDoEventFunction(selectedEvent, (func: Function, e: any) => {
      func(e);
    });

  }
}
