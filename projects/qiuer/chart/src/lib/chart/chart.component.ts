import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { DatasetComponent, DatasetMetadata, DatasetService } from '@qiuer/component';
import { ContainerEvent, ContainerService } from '@qiuer/core';
import * as echarts from 'echarts';
declare const require: any;
import { Subject } from 'rxjs/index';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface ChartDatasetMetadata extends DatasetMetadata {
  option?: object; // chart图表配置
  // event
  onChartClick?: string; // TODO onClick
  onChartDbClick?: string; // TODO onDblClick
}

@Component({
  selector: 'chart-dataset',
  styleUrls: ['./chart.component.scss'],
  templateUrl: './chart.component.html'
})
export class ChartDatasetComponent extends DatasetComponent implements OnInit, OnDestroy, AfterViewInit {

  protected _metadata: ChartDatasetMetadata;
  public echartsInstance: any; // chart的 echart对象
  theme: string;

  public _data: any;
  public _option: any;

  // Subject
  protected onChartClickSubject: Subject<any> = new Subject<any>();
  protected onChartDbClickSubject: Subject<any> = new Subject<any>();

  @ViewChild('chart', { static: true }) chart: ElementRef;

  constructor(public _service: ContainerService, public _ds: DatasetService, public el: ElementRef, public renderer2: Renderer2) {
    super(_service, _ds, el, renderer2);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/


  public get data() {
    return this._data;
  }
  public set data(data: any) {
    this._data = data;
  }

  public get option() {
    return this._option;
  }
  public set option(option: any) {
    this._ds.evalObj(option);
    this._option = option;
  }

  public get onChartClick(): string { return this._getCallback('onChartClick').toString(); }
  public set onChartClick(onChartClick: string) { this._setEvent('onChartClick', onChartClick); }
  public get onChartDbClick(): string { return this._getCallback('onChartDbClick').toString(); }
  public set onChartDbClick(onChartDbClick: string) { this._setEvent('onChartDbClick', onChartDbClick); }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit() {
    super.ngOnInit();
    this.option = this._metadata.option;

    this.registerEvent();
    this.onChartClick = this._metadata.onChartClick;
    this.onChartDbClick = this._metadata.onChartDbClick;
  }

  ngAfterViewInit(): void {
    this.getLayoutChange();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /***********************************************************************************/
  /*                            others                                 */
  /***********************************************************************************/

  registerEvent() {
    const clickEvent = new ContainerEvent('onChartClick', this.onChartClickSubject, '(event)');
    const dbClickEvent = new ContainerEvent('onChartDbClick', this.onChartDbClickSubject, '(event)');

    this._setCallbackEvent(clickEvent);
    this._setCallbackEvent(dbClickEvent);

    this._setDoEventFunction(clickEvent, (func: Function, e: any) => {
      func(e);
    });

    this._setDoEventFunction(dbClickEvent, (func: Function, e: any) => {
      func(e);
    });

  }


  clear() {
    if (this.echartsInstance) {
      this.echartsInstance.clear();
    }
  }

  public _onChartInit(event) {
    this.echartsInstance = event;
  }

  public _onChartClick(event) {
    this.onChartClickSubject.next(event);
  }

  public _onChartDblClick(event) {
    this.onChartDbClickSubject.next(event);
  }

  getLayoutChange() {
    setTimeout(() => {
      if (this.echartsInstance) {
        // this.echartsInstance.resize();
        const _dom = this.echartsInstance._dom;
        const _height = this.chart.nativeElement.offsetHeight;
        this.renderer2.setStyle(_dom, 'height', _height + 'px');
      }
    }, 100);
  }

  multiply = (a, b) => {
    let m = 0;
    // tslint:disable-next-line:prefer-const
    let c = a.toString();
    // tslint:disable-next-line:prefer-const
    let d = b.toString();
    try {
      m += c.split('.')[1].length;
    } catch (e) { }
    try {
      m += d.split('.')[1].length;
    } catch (e) { }
    return Number(c.replace('.', '')) * Number(d.replace('.', '')) / Math.pow(10, m);
  }

}
