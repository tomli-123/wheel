/***********************************************************************************/
/* author: wujun
/* update logs:
/* 2019/6/10
/***********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContainerService } from '@qiuer/core';
import { PanelLayoutMetadata, PanelLayoutComponent } from '../panel.component';

export interface CarouselPanelLayoutMetadata extends PanelLayoutMetadata {
  showId?: string;
}

@Component({
  selector: 'carouselpanel-layout',
  templateUrl: './carouselPanel.component.html',
  styleUrls: ['./carouselPanel.component.scss']
})
export class CarouselPanelLayoutComponent extends PanelLayoutComponent implements OnInit, OnDestroy {
  protected _metadata: CarouselPanelLayoutMetadata;
  constructor(public _service: ContainerService) {
    super(_service);
  }

  public _showId = '';

  public set showId(showId: string) {
    try {
      this.childs.forEach((item) => {
        if (item.id === showId) {
          item['_selfInit'] = true;
        }
      });
    } catch (e) {
      console.log(`this.childs为空`);
    }
    this._showId = showId;
  }

  public get showId(): string {
    return this._showId;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showId = this._metadata.showId || '';
    // this.childs = this._metadata.childs || [];
    // this._service.setChildsRootPath(this._childs, this._rootPath, this);
  }

}
