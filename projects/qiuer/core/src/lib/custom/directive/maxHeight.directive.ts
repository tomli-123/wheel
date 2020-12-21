import { Directive, ElementRef, HostListener, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[maxHeight]'
})
export class MaxHeightDirective implements OnInit, OnChanges {
  timer: any;
  screenNum: number;
  @Input() repaint: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('bottomHeight') height = 10;
  @Input() isActive = false;

  @Input() initHeight: number;

  constructor(private el: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.timer = setTimeout(() => {
        this.highlight();
      }, 0);
    }
  }

  public highlight() {
    if (this.isActive) {
      if (this.initHeight ||  this.initHeight === 0) {
        const maxHeight = this.initHeight - this.el.nativeElement.offsetTop - this.height;
        this.el.nativeElement.style.overflow = 'auto';
        this.el.nativeElement.style.height = maxHeight + 'px';
      } else {
        const maxHeight = window.innerHeight - this.el.nativeElement.getBoundingClientRect().top - this.height ;
        this.el.nativeElement.style.overflow = 'auto';
        this.el.nativeElement.style.height = maxHeight + 'px';
      }
    }
  }

  ngOnInit() {
      this.timer = setTimeout(() => {
        this.highlight();
      }, 200);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.highlight();
  }

}
