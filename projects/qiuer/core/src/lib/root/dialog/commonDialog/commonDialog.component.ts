import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '../../../container/container.service';
import { DialogRootMetadata, CommonDialogRootComponent } from '../dialog.component';
import { ContainerMetadata } from '../../../container/container.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
// import { AlignLayoutMetadata } from '../../../layout/align/align.component';

export interface CommonDialogMetadata extends DialogRootMetadata {
  contentChild: ContainerMetadata;
  buttonChild: ContainerMetadata;
  customizeWidth?: number;
  customizeHeight?: number;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'common-dialog',
  styleUrls: ['./commonDialog.component.scss'],
  animations: [
    trigger('fadeout', [
      state('show', style({ opacity: 1, 'z-index': 999 })),
      state('hidden', style({ opacity: 0, 'z-index': -1 })),
      transition('show => hidden', [animate('.2s')]),
    ])
  ],
  templateUrl: './commonDialog.component.html'
})
export class CommonDialogComponent extends CommonDialogRootComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _contentChild: any;
  protected _buttonChild: any;

  public contentHeight: number;

  constructor(public _service: ContainerService,
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public el: ElementRef) {
    // super(_service, dialogRef, dialogData);
    super(_service);
    this.id = dialogData.id;
  }

  public get dialogMetadata() {
    return this._metadata;
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get dialogHeight(): number {
    return parseInt(this._metadata.customizeHeight || document.body.clientHeight * this._heightMap[this._metadata.height || 1], 10);
  }

  public get dialogWidth(): number {
    return parseInt(this._metadata.customizeHeight || document.body.clientWidth * this._widthMap[this._metadata.size || 1], 10);
  }


  public get contentChild() {
    return this._contentChild;
  }
  public set contentChild(contentChild: any) {
    this._contentChild = contentChild;
  }

  public get buttonChild() {
    return this._buttonChild;
  }
  public set buttonChild(buttonChild: any) {
    this._buttonChild = buttonChild;
  }

  public close(_code?: number, _data?: any) {
    _code || _code === 0 ? _code = _code : _code = -1;
    _data || _data === 0 ? _data = _data : _data = null;
    const callback = { code: _code, data: _data };
    if (this._onBeforeClose) {
      this._onBeforeClose(callback);
    } else {
      this.dialogRef.close(callback);
    }
  }

  // imgload() {
  //   this._showMaskDiv = false;
  //   this._metadata = this.dialogData;
  //   this._metadata._rootPath = []; // 只有root容器才创建
  //   this._service.setRootContainer(this.id, this);
  // }


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();

    this.contentChild = this._metadata.contentChild;
    this.buttonChild = this._metadata.buttonChild;

    const arr = [];
    if (this.contentChild) {
      arr.push(this.contentChild);
    }
    if (this.buttonChild) {
      arr.push(this.buttonChild);
    }
    // this._service.setChildsRootPath(arr, this._rootPath, this);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

}
