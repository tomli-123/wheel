import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ContainerService } from '../../../container/container.service';
import { DialogRootMetadata, CommonDialogRootComponent } from '../dialog.component';
import { ContainerMetadata } from '../../../container/container.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface BottomSheetDialogMetadata extends DialogRootMetadata {
  contentChild: ContainerMetadata;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bottomSheet-dialog',
  styleUrls: ['./bottomSheetDialog.component.scss'],
  animations: [
    trigger('fadeout', [
      state('show', style({ opacity: 1, 'z-index': 999 })),
      state('hidden', style({ opacity: 0, 'z-index': -1 })),
      transition('show => hidden', [animate('.2s')]),
    ])
  ],
  templateUrl: './bottomSheetDialog.component.html'
})
export class BottomSheetDialogComponent extends CommonDialogRootComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _contentChild: any;

  constructor(public _service: ContainerService, public dialogRef: MatBottomSheetRef<BottomSheetDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dialogData: any, public ele: ElementRef, public renderer2: Renderer2) {
    // super(_service, dialogRef, dialogData);
    super(_service);
    this.id = dialogData.id;
    dialogRef.backdropClick().subscribe(result => {
      this.close();
    });
  }

  public get dialogMetadata() {
    return this._metadata;
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get contentChild() {
    return this._contentChild;
  }
  public set contentChild(contentChild: any) {
    this._contentChild = contentChild;
  }

  public close(_code?: number, _data?: any) {
    _code || _code === 0 ? _code = _code : _code = -1;
    _data || _data === 0 ? _data = _data : _data = null;
    const callback = { code: _code, data: _data };
    if (this._onBeforeClose) {
      this._onBeforeClose(callback);
    } else {
      this.dialogRef.dismiss(callback);
    }
  }

  public setSize() {
    const _obj = {
      full: '100vw', huge: '85vw', large: '70vw', medium: '55vw', small: '40vw', tiny: '25vw'
    };
    const _width = _obj[this._metadata.size] || '40vw';
    this.renderer2.setStyle(this.ele.nativeElement, 'display', 'inline-block');
    this.renderer2.setStyle(this.ele.nativeElement, 'width', `calc(${_width} - 32px)`);
  }


  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this.setSize();
    this.contentChild = this._metadata.contentChild;
  }

  // @HostListener('document:click', ['$event', '$event.target'])
  // onClick(event: MouseEvent, targetElement: HTMLElement) {
  //   if (!targetElement || this.clickType === 'unInit') {
  //     this.clickType = 'init';
  //     return;
  //   }
  //   const clickedInside = this.bottomSheetEle.nativeElement.contains(targetElement);
  //   if (!clickedInside) {
  //     this.close();
  //   }
  // }

}
