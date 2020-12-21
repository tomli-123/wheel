/***********************************************************************************/
/* author: 武俊
/* update logs:
/* 2019/6/10 武俊 创建
/***********************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface MonthpickerControllerMetadata extends ControllerMetadata {
  hasClear?: boolean; // 有清除按钮
  minDate?: string; // 最小日期 6位字符串
  maxDate?: string; // 最大日期 6位字符串
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* chosenMonthpicker 组件关闭时调用
/* openMonthpicker 组件点击时调用
/* set/get 存取器get/set 用户使用
/* hasClear 设置清除功能
/***********************************************************************************/
@Component({
  selector: 'monthpicker-ctrl',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss']
})
export class MonthpickerControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: MonthpickerControllerMetadata;
  @ViewChild('monthpicker', { static: true }) monthpicker;
  public _minDate: Date;
  public _maxDate: Date;
  public _dateValue: any = null;
  protected _reg = '^\\d{4}(0?[1-9]|1[0-2])$';
  public _hasClear: boolean;

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           组件关闭时调用 方法使用                                */
  /***********************************************************************************/
  chosenMonthpicker(month, datepicker: MatDatepicker<Date>): void {
    const date = this._ctrlService.dateToStr(month, 'yyyyMM');
    this._formControl.setValue(date);
    this._dateValue = month;
    datepicker.close();
  }

  /***********************************************************************************/
  /*                           组件点击时调用 方法使用                                */
  /***********************************************************************************/
  openMonthpicker(event: Event, datepicker: MatDatepicker<Date>): void {
    datepicker.open();
    event.stopPropagation();
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: any) {
    const _value = this.transformValue(value);
    this._formControl.setValue(_value);
  }
  public get value(): any {
    const value = this._formControl.value;
    const ReExp = new RegExp(this._reg);
    if (ReExp.test(value) === true) {
      return value + '';
    } else {
      return null;
    }
  }

  public transformValue(value: any): any {
    const ReExp = new RegExp(this._reg);
    console.log(value);
    if (ReExp.test(value) === true) {
      const date: Date = this._ctrlService.getDateParams(value + '01');
      const _dateStr = this._ctrlService.dateToStr(date, 'yyyyMM');
      // console.log(_dateStr);
      this._dateValue = date;
      return _dateStr;
    } else if (value !== null && value !== undefined && value !== '') {
      console.error('monthPicker id:' + this.id + '的value必须是6位有效月份');
      return null;
    }
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
  public set minDate(minDate: string) {
    if (minDate !== undefined && minDate !== null && minDate.length === 6) {
      this._minDate = this._ctrlService.getDateParams(minDate + '01');
    }
  }
  public set maxDate(maxDate: string) {
    if (maxDate !== undefined && maxDate !== null && maxDate.length === 6) {
      this._maxDate = this._ctrlService.getDateParams(maxDate + '01');
    }
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
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

}
