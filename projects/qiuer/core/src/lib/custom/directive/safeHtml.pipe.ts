import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
@Injectable()
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value) {
    if (!value) {
      value = '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

