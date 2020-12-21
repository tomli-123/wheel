import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ContainerService } from '../container/container.service';

@Component({
  selector: 'bsDialog-container',
  styleUrls: ['./bsDialog.component.scss'],
  templateUrl: './bsDialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BsDialogContainerComponent implements OnInit, OnDestroy {

  protected _metadata: any = null;

  constructor(public _service: ContainerService,
    public dialogRef: MatBottomSheetRef<BsDialogContainerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public metadata: any) {
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
