/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/10 谢祥 创建
/* 2019/6/10 林清将 添加注释
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonComponent, ButtonMetadata } from '../button.component';
import { ContainerService } from '@qiuer/core';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface IconButtonMetadata extends ButtonMetadata {
  size?: string; // 以px结尾的字符大小
}

/***********************************************************************************/
/*                                     组件                                        */
/***********************************************************************************/
@Component({
  selector: 'icon-button',
  styleUrls: ['./icon.component.scss'],
  templateUrl: './icon.component.html'
})
export class IconButtonComponent extends ButtonComponent implements OnInit, OnDestroy {

  protected _metadata: IconButtonMetadata;

  //  public _iconStyle = {};

  public _size: string;

  constructor(public _service: ContainerService) {
    super(_service);
  }

  public set size(size: string) {
    if (size) {
      const _size = parseFloat(size);
      if (!isNaN(_size)) {
        this._ngStyle['font-size'] = this._size = size.endsWith('px') ? size : size + 'px';
      }
    }
  }
  public get size(): string {
    return this._size;
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    // this._color = this._metadata.color || 'primary';
    this.size = this._metadata.size;
    // if (this._color && this._color.trim()[0] === '#') {
    //   this._iconStyle['color'] = this._color;
    // }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
