import { OnInit, Component, OnDestroy, AfterViewInit, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '../../container/container.service';
import { RootComponent, RootMetadata } from '../root.container';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface DialogRootMetadata extends RootMetadata {
  title?: string;
  size?: string; // full:100% huge:85% large:70% medium: 55% small: 45% tiny: 25%
  isClosedByESC?: boolean;
  height?: string; // full:100% huge:85% large:70% medium: 55% small: 45% tiny: 25%
  // event
  // onOpen?: string;   // 此时 dialog下的所有container还未初始化
  // onClose?: string;
  onBeforeClose?: string; // 关闭前触发
}

@Component({ template: '' })
export abstract class CommonDialogRootComponent extends RootComponent implements OnInit, OnDestroy, AfterViewInit {

  public id: string;
  protected _metadata: any;
  // protected _buttons: ButtonGroupContainerMetadata;
  // protected _content: LayoutContainerMetadata;
  public _title = '';
  public _showMaskImg = false;
  public _heightMap = {
    'height-full': 1,
    'height-huge': 0.85,
    'height-large': 0.7,
    'height-medium': 0.55,
    'height-small': 0.45,
    'height-tiny': 0.25
  };
  public _widthMap = {
    full: 1,
    huge: 0.85,
    large: 0.7,
    medium: 0.55,
    small: 0.45,
    tiny: 0.25
  };
  protected _onOpen: Function;
  protected _onClose: Function;
  protected _onBeforeClose: Function;

  constructor(public _service: ContainerService,
    // public dialogRef: MatDialogRef<CommonDialogRootComponent> | MatBottomSheetRef<CommonDialogRootComponent>,
    // public dialogData: any
  ) {
    super(_service);
    // this.id = dialogData.id;
    // this.create();
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/

  public set title(title: string) {
    if (title) {
      this._title = title;
    }
  }

  public get title(): string {
    return this._title;
  }

  public get onOpen(): string { return this._onOpen.toString(); }
  public set onOpen(onOpen: string) {
    this._onOpen = this._compileCallbackFunction(onOpen);
  }

  public get onClose(): string { return this._onClose.toString(); }
  public set onClose(onClose: string) {
    this._onClose = this._compileCallbackFunction(onClose);
  }

  public get onBeforeClose(): string { return this._onBeforeClose.toString(); }
  public set onBeforeClose(onBeforeClose: string) {
    this._onBeforeClose = this._compileCallbackFunction(onBeforeClose);
  }

  // imgload() {
  //   this._metadata = this.dialogData;
  //   this._metadata._rootPath = []; // 只有root容器才创建
  //   this._service.setRootContainer(this.id, this);
  // }

  // 监听 esc 退出
  @HostListener('window:keydown', ['$event'])
  keydown(ev: Event) {
    if (!!this._metadata['isClosedByESC'] && ev['keyCode'] === 27) {
      this.close(-1);
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    this.title = this._metadata.title;
    this.onBeforeClose = this._metadata.onBeforeClose;
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._onClose) {
      this._onClose();
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this._onOpen) {
      this._onOpen();
    }
  }

  /***********************************************************************************/
  /*                           自定义方法                                */
  /***********************************************************************************/

  public open(config?: any, param?: any, callback?: any) {

  }

  public close(code?: number, data?: any) {

  }

}
