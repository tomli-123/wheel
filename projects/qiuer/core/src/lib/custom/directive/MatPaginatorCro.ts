import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorCro extends MatPaginatorIntl {
  itemsPerPageLabel = '每页';
  nextPageLabel = '前进';
  previousPageLabel = '后退';
  _displayedPageSizeOptions = [1, 2, 3, 4];
  getRangeLabel = (page, pageSize, length) => {

    if (length === 0 || pageSize === 0) {
      return '0 / ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return page + 1 + ' / ' + Math.ceil(length / pageSize);
  };
}
