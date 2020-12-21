import { Directive, ElementRef, Renderer2, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[appClazz]'
})
export class ClazzDirective implements  OnChanges {

  // tslint:disable-next-line:no-input-rename
  @Input('clazz') clazz: any;

  constructor(public el: ElementRef, public renderer2: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.doClazz();
    }
  }

  public doClazz() {
    for (const clz in this.clazz) {
      if (this.clazz[clz]) {
        this.renderer2.addClass(this.el.nativeElement, clz);
      } else {
        this.renderer2.removeClass(this.el.nativeElement, clz);
      }
    }
  }

}
