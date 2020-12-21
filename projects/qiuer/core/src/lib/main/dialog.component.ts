import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '../container/container.service';

@Component({
  selector: 'dialog-container', // TODO main-content
  styleUrls: ['./dialog.component.scss'],
  templateUrl: './dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DialogContainerComponent implements OnInit, OnDestroy {

  protected _metadata: any = null;

  constructor(public _service: ContainerService,
    public dialogRef: MatDialogRef<DialogContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public metadata: any,
    public el: ElementRef) {
    // super(_service, dialogRef, dialogData);
    // console.log('DialogContainerComponent constructor', dialogRef, metadata);
  }

  public get dialogMetadata() {
    return this._metadata;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    this._metadata = this.metadata;
  }

  ngOnDestroy() {

  }

}
