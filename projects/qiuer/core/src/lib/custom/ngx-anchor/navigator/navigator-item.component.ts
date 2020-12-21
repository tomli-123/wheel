import { Component, OnInit, Input, ViewEncapsulation, TemplateRef, EventEmitter, Output } from '@angular/core'
import { Anchor } from '../model'
import { AnchorService } from '../anchor.service'

@Component({
  selector: 'ngx-navigator-item',
  templateUrl: './navigator-item.component.html'
  // encapsulation: ViewEncapsulation.None,
})
export class NavigatorItemComponent implements OnInit {
  @Input() anchor: Anchor
  @Input() itemTpl: TemplateRef<Anchor>
  @Input() sub: boolean

  @Output() clickRquest = new EventEmitter<Anchor>()

  constructor(
    public anchorService: AnchorService
  ) { }

  ngOnInit() {
    console.log(this.anchor);
  }

  handleClick(anchor: Anchor) {
    this.clickRquest.emit(anchor)
  }
}
