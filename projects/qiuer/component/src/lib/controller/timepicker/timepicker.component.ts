/***********************************************************************************/
/* author: 武俊
/* update logs:
/* 2019/6/10 武俊 创建
/***********************************************************************************/
import { Component, OnInit, Injectable } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';

import { OwlDateTimeIntl } from 'ng-pick-datetime';

@Injectable()
export class DefaultIntl extends OwlDateTimeIntl {
  cancelBtnLabel = '取消';
  setBtnLabel = '确认';
}

export const CUSTOM_DATE_TIME_FORMATS = {
  fullPickerInput: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  },
  datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour12: false },
  timePickerInput: { hour: 'numeric', minute: 'numeric', hour12: false },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface TimepickerControllerMetadata extends ControllerMetadata {
  minDate?: string; // 设置最小时间 YYYYMMDD HH:mm:ss 或 14位字符串
  maxDate?: string; // 设置最大时间
  hasClear?: boolean; // 有清除按钮
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get 存取器get/set 用户使用
/* transformValue 地址栏获取日期并转换为标准格式
/* hasClear 设置清除功能
/***********************************************************************************/
@Component({
  selector: 'timepicker-ctrl',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
  // encapsulation: ViewEncapsulation.None // 影响全局样式 无Shadow DOM 修改时请注意
})
export class TimepickerControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: TimepickerControllerMetadata;
  public _minDate;
  public _maxDate;
  public _hasClear: boolean;

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  constructor(public _service: ContainerService, public _ctrlService: ControllerService) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public set value(value: string) {
    const date = this.transformValue(value);
    this._formControl.setValue(date);
  }

  public get value(): string {
    if (this._formControl.value == null) {
      return null;
    } else {
      const dateForStr = this._service.timeToStr(this._formControl.value);
      return dateForStr;
    }
  }

  public transformValue(value: string): any {
    return this._ctrlService.getTimeParams(value);
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
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    this._minDate = this._ctrlService.getTimeParams(this._metadata.minDate) || null;
    this._maxDate = this._ctrlService.getTimeParams(this._metadata.maxDate) || null;
    const metadata = this._metadata;
    this.hasClear = metadata.hasClear;
  }


  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/

}
