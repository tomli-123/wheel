import { Directive, ElementRef, HostListener, Input, OnInit, Output, OnChanges, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dialogMaxHeight]'
})
export class DialogMaxheightDirective implements OnInit, OnChanges {
  timer: any;
  // bottomHeight
  // @Input() tabHeight = 48;
  @Input() bottomHeight = 20;
  @Input() hasFooter = true;
  @Input() isDialogActive = false;
  @Input() repaint: boolean;
  @Output() finish = new EventEmitter();
  // private dlgContent: Element;

  constructor(private el: ElementRef) {

  }

  public highlight() {
    // console.log('=========================dialog', this.el.nativeElement, this.isDialogActive);
    if (this.isDialogActive) {
      // console.log('bottomHeight========', this.bottomHeight);
      // let maxHeight = window.innerHeight - this.el.nativeElement.getBoundingClientRect().top - 56 - this.tabHeight;
      // if (!this.hasFooter) {
      //   maxHeight = maxHeight + 72;
      // }
      // this.el.nativeElement.style.height = maxHeight + 'px';
      this.getDlgContent(this.el.nativeElement);
    }
  }

  public getDlgContent(baseEle: HTMLElement) {
    // console.log('=================getDlgContent', baseEle);
    if (!baseEle) {
      return;
    }
    // console.log('=================return', baseEle.className);
    if (baseEle.className.indexOf('mat-dialog-content') !== -1) {
      this.dlgContent = baseEle;
    } else {
      this.getDlgContent(baseEle.parentElement);
    }
  }

  public set dlgContent(dlgContent: Element) {
    if (dlgContent) {
      const _height = dlgContent.clientHeight;
      // console.log(_height);
      const _removing = this.el.nativeElement.getBoundingClientRect().top - dlgContent.getBoundingClientRect().top;
      // console.log(this.el.nativeElement.getBoundingClientRect(), dlgContent.getBoundingClientRect());
      const bottomHeight = this.bottomHeight ? this.bottomHeight : 0;
      const _aims = _height - _removing - bottomHeight || 0;
      // console.log(_aims);
      this.el.nativeElement.style.height = _aims + 'px';
      // console.log(_height, _removing, this.bottomHeight, _aims, this.el.nativeElement);
      this.finish.emit(true);
    }
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.timer = setTimeout(() => {
      this.highlight();
    }, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.timer = setTimeout(() => {
      this.highlight();
    }, 0);
  }

}
