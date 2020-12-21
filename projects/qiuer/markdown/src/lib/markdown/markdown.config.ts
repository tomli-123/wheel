import { HttpClient } from '@angular/common/http';
import { MarkedOptions } from 'ngx-markdown';

// markdown插件配置
export const markdownConf = {
  loader: HttpClient, // optional, only if you use [src] attribute
  markedOptions: {
    provide: MarkedOptions,
    useValue: {
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
    },
  },
};
