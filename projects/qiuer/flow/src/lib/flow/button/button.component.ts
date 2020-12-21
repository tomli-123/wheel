import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ContainerService, ContainerMetadata, ContainerComponent } from '@qiuer/core';
import { FlowService } from '../flow.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { RaisedButtonMetadata } from '@qiuer/component';
export interface FlowButtonMetadata extends ContainerMetadata {
  buttons?: RaisedButtonMetadata[];
}

@Component({
  selector: 'flow-button',
  animations: [
    trigger('switchAnimation', [
      state('bottom', style({ transform: 'rotate(0deg)' })),
      state('top', style({ transform: 'rotate(180deg)' })),
      transition('bottom => top', [animate('0.2s')]),
      transition('top => bottom', [animate('0.2s')]),
    ])
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class FlowButtonComponent extends ContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  public _metadata: FlowButtonMetadata;
  public isOpen = false; // 按钮是否展开
  public _buttons: RaisedButtonMetadata[] = [];

  @ViewChild('btn', { static: true }) btn: ElementRef;

  constructor(public _service: ContainerService, public _fs: FlowService) {
    super(_service);
  }

  public set buttons(buttons: RaisedButtonMetadata[]) {
    // console.log(buttons);
    if (buttons && buttons instanceof Array) {
      this._buttons = buttons.filter(button => !button.hidden);
    }
  }
  public get buttons() {
    return this._buttons;
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  buttonStateSwitch() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement || !this.isOpen) {
      return;
    }
    const clickedInside = this.btn['_elementRef'].nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.buttonStateSwitch();
    }
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this.buttons = this._metadata.buttons;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    const flowContent: any = this.parent;
    if (flowContent) {
      flowContent.buttons = this;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
