import { Directive, ElementRef, Input, Optional, OnInit } from '@angular/core';
import { getElementTop, getElementViewTop } from './utils/dom'
import { AnchorService } from './anchor.service'
import { WithAnchorDirective } from './with-anchor.directive'

@Directive({
  selector: '[ngxAnchor]'
})
export class AnchorDirective implements OnInit {
  @Input('ngxAnchor') id: string;
  // tslint:disable-next-line:no-input-rename
  @Input('header') isHeader: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('text') text: string;
  constructor(
    private host: ElementRef,
    private anchorService: AnchorService,
    @Optional() private withAnchor: WithAnchorDirective
  ) { }

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement

    // if (this.isHeader) {
    //   this.anchorService.registerAnchor(el, this.group, true)
    // } else {
    //   this.anchorService.registerAnchor(el, this.group)
    // }

    this.anchorService.register(el, {
      id: this.id as string,
      text: this.text as string,
      parent: !!this.withAnchor ? this.withAnchor.id : null
    })
  }
}
