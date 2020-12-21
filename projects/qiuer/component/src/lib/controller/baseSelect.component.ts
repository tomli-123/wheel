import { OnInit, Component } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { ControllerService } from './controller.service';
import { HaveSelectControllerComponent, HaveSelectControllerMetadata } from './haveSelect.component';


export interface BaseSelectControllerMetadata extends HaveSelectControllerMetadata {
  hasFilter?: boolean; // 是否开启过滤
  filterField?: string; // 过滤字段
  filterPlaceholder?: string; // 占位符
  filterValue?: string; // 过滤值
  tip?: string;
}

@Component({ template: '' })
export abstract class BaseSelectControllerComponent extends HaveSelectControllerComponent implements OnInit {

  public _fileredOptions: any[]; // 过滤后的options
  public _hasFilter = false;
  public _filterPlaceholder: string;
  public _filterField: string;
  public _filterValue: string;
  public tip: string;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  public set filterValue(filterValue: string) {
    this._filterValue = filterValue;
    this._filterOptions(filterValue, this._options);
  }
  public get filterValue(): string {
    return this._filterValue;
  }

  protected _filterOptions(filter, options): void {
    if (filter === undefined || filter === '' || filter === null) {
      this._fileredOptions = options;
      return;
    }
    this._fileredOptions = this._afterFilter(options, filter, this._filterField);
  }

  public _afterFilter(options, search, field?): any {
    return options.filter((item) => {
      if (typeof item !== 'object') {
        if (item.toString().includes(search)) {
          return true;
        }
      }

      if (typeof item === 'object' && field !== undefined && field !== null) {
        if (!item[field]) {
          return false;
        }
        if (item[field].toString().toLowerCase().includes(search.toString().toLowerCase())) {
          return true;
        }
      } else if (typeof item === 'object') {
        for (const property in item) {
          if (item[property] === null) {
            continue;
          }
          if (item[property].toString().toLowerCase().includes(search.toString().toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    const metadata: BaseSelectControllerMetadata = this._metadata;
    this._hasFilter = metadata.hasFilter || false;
    if (this._hasFilter) {
      this._filterField = metadata.filterField || null;
      this._filterPlaceholder = metadata.filterPlaceholder || '- 筛选过滤 -';
      this.filterValue = metadata.filterValue;
      this.tip = metadata.tip;
    } else {
      this._fileredOptions = this._options;
    }

  }

}
