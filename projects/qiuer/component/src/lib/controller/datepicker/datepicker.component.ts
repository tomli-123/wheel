/***********************************************************************************/
/* author: 武俊
/* update logs:
/* 2019/6/10 武俊 创建
/* 2019/6/24 贾磊 支持minDate、minDate
/* 2019/6/25 贾磊 dateFilter在dateMonthView对象下 取不到dateMonthView 无法塞变量 待定
/***********************************************************************************/
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';


/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DatepickerControllerMetadata extends ControllerMetadata {
  minDate?: string;
  maxDate?: string;
  disabledDay?: number[]; // 1-7的数组 TODO 暂时做不到
  hasClear?: boolean; // 有清除按钮
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get 存取器get/set 用户使用
/* transformValue 地址栏获取日期并转换为标准格式
/* hasClear 设置清除功能
/* min 最小日期
/* max 最大日期
/* disabledDay 禁用星期
/***********************************************************************************/
@Component({
  selector: 'datepicker-ctrl',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerControllerComponent extends ControllerComponent implements OnInit, AfterViewInit {

  @ViewChild('datepicker', { static: true }) datepicker;
  protected _metadata: DatepickerControllerMetadata;
  public _hasClear: boolean;
  public _minDate: Date;
  public _maxDate: Date;
  public _disabledDay: number[];
  public _dayFilter: any;
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata = this._metadata;
    this.hasClear = metadata.hasClear;
    this.maxDate = metadata.maxDate;
    this.minDate = metadata.minDate;
    this.disabledDay = metadata.disabledDay;
    this._dayFilter = (d: Date): boolean => {
      const day = d.getDay();
      let res = true;
      for (const i of this._disabledDay) {
        res = res && i !== day;
      }
      return res;
    };
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get value(): string {
    if (this._formControl.value instanceof Date === true) {
      return this._ctrlService.dateToStr(this._formControl.value);
    } else {
      return null;
    }
  }
  public set value(value: string) {
    const date = this.transformValue(value);
    this._formControl.setValue(date);
  }

  public set minDate(minDate: string) {
    this._minDate = this._ctrlService.getDateParams(minDate);
  }
  public set maxDate(maxDate: string) {
    this._maxDate = this._ctrlService.getDateParams(maxDate);
  }
  public set disabledDay(disabledDay: number[]) {
    this._disabledDay = disabledDay || [];
  }

  public transformValue(value: string): any {
    return this._ctrlService.getDateParams(value);
  }

  public set hasClear(hasClear: any) {
    if (this._metadata.required) {
      this._hasClear = false;
    } else if (typeof hasClear === 'undefined') {
      this._hasClear = true;
    } else if (hasClear === null) {
      this._hasClear = false;
    } else {
      this._hasClear = hasClear;
    }
  }
  public get hasClear(): any {
    return this._hasClear;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
