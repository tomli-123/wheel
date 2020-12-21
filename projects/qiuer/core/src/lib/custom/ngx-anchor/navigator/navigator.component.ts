import { Component, OnInit, ViewEncapsulation, OnDestroy, TemplateRef, ContentChild, Renderer2 } from '@angular/core'
import { AnchorService } from '../anchor.service'
import { getElementViewTop, isScrollToBottom } from '../utils/dom'
import { Anchor } from '../model'

import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-anchor-nav',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
  // encapsulation: ViewEncapsulation.None,
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private scroll$$: Subscription
  private isClosed = false

  @ContentChild('anchorTpl', { read: TemplateRef, static: true }) itemTpl: TemplateRef<Anchor>

  constructor(
    public anchorService: AnchorService,
    public renderer: Renderer2
  ) { }

  ngOnInit() {
    // this.scroll$$ = this.anchorService.attachListner().subscribe();
  }

  ngOnDestroy() {

  }

  trackByFn(idx: number, anchor: Anchor) {
    return anchor.id
  }

  handleClick(anchor: Anchor) {
    this.anchorService.scrollTo(anchor, this.renderer)
  }
}
