import { NativeDateAdapter } from '@angular/material/core';
import {
  Injectable, Optional, Inject, Host
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';

const SUPPORTS_INTL_API = typeof Intl !== 'undefined';
@Injectable()
export class MyLocal {
   public test = 'zh-cn';
}
@Injectable(
  { providedIn: 'root' }
)
export class MyDateAdapter extends NativeDateAdapter {

  useUtcForDisplay = false;
  constructor(matDateLocale: MyLocal, platform: Platform) {
    super(matDateLocale.test, platform);
  }

  getDateNames() {
    return Array(31).fill(0).map((_, i) => String(i + 1));
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (Intl) {
      const dtf = new Intl.DateTimeFormat(this.locale, { month: 'long' });
      const year = new Date().getFullYear();
      return Array(12).fill(0).map((_, i) => dtf.format(new Date(year, i, 1)));
    }
    return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  }

  getFirstDayOfWeek() {
    return 1;
  }

  parse(value: any): Date | null {
    if (value === '') {
      return null;
    }
    const length = value.match(/.{1}/g);
    // console.log(length);
    if ((typeof value === 'string') && (length.length === 8)) {
      // console.log(value);
      // console.log(length.length);
      const str = value;
      const year = Number(str.match(/.{4}/g)[0]);
      const month = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[0]) - 1;
      const date = Number(str.match(/.{4}/g)[1].match(/.{2}/g)[1]);
      return new Date(Date.UTC(year, month, date));
    }
    return null;
  }

  createDate(year: number, month: number, date: number): Date {
    if (month < 0 || month > 11 || date < 1) {
      return null;
    }
    const result = new Date(Date.UTC(year, month, date));
    return result;
  }

  format(d: Date, displayFormat: Object): string {
    return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
  }
}
