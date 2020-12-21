import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent, LayoutMetadata } from '../layout.component';
import { ContainerMetadata, ContainerService } from '@qiuer/core';

export interface AlignLayoutMetadata extends LayoutMetadata {
  order?: string; //  次序 （along：顺序；reverse: 倒序）
  direction?: string; // 方向 （horizontal: 横向；vertical： 竖向）
  frontChilds?: Array<ContainerMetadata>;
  middleChilds?: Array<ContainerMetadata>;
  backChilds?: Array<ContainerMetadata>;
}

@Component({
  selector: 'align-layout',
  templateUrl: './align.component.html',
  styleUrls: ['./align.component.scss']
})

export class AlignLayoutComponent extends LayoutComponent implements OnInit, OnDestroy {
  protected _metadata: AlignLayoutMetadata;
  // order : 次序 （along：顺序；reverse: 倒序）
  // direction: 方向 （horizontal: 横向；vertical： 竖向）

  groupClass = '';

  public frontChilds: ContainerMetadata[];
  public middleChilds: ContainerMetadata[];
  public backChilds: ContainerMetadata[];

  constructor(public _service: ContainerService) {
    super(_service);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/


  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  protected _order: string;
  protected _direction: string;

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this.frontChilds = this._metadata.frontChilds || [];
    this.middleChilds = this._metadata.middleChilds || [];
    this.backChilds = this._metadata.backChilds || [];
    // const _childs = this._service.ArrayMerge([this.frontChilds, this.middleChilds, this.backChilds]);
    // this._service.setChildsRootPath(_childs, this._rootPath, this);
    this._order = this._metadata['order'] || 'along';
    this._direction = this._metadata['direction'] || 'horizontal';
    if (this._direction === 'vertical' && this._order === 'along') { this.groupClass = 'column'; }
    if (this._direction === 'vertical' && this._order === 'reverse') { this.groupClass = 'column_reverse'; }
    if (this._direction === 'horizontal' && this._order === 'reverse') { this.groupClass = 'row_reverse'; }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
