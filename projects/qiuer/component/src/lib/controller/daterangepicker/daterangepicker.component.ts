/***********************************************************************************/
/* author: 谢祥
/* update logs:
/* 2019/6/11 谢祥 创建
/***********************************************************************************/
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';
// import * as MomentObj from 'moment';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DaterangeControllerMetadata extends ControllerMetadata {
  hasClear?: boolean; // 有清除按钮
  minDate?: string; // 最小日期
  maxDate?: string; // 最大日期
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法(用户使用):                                                                  */
/* set/get
/* value 表单的值
/* urlParam 当表单setURLparam时，url对应字段上处理后的值
/* hasClear 是否有清除按钮
/***********************************************************************************/
@Component({
  selector: 'daterangepicker-ctrl',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.scss']
})
export class DaterangepickerControllerComponent extends ControllerComponent implements OnInit {

  protected _metadata: DaterangeControllerMetadata;
  public _hasClear: boolean;
  public _minDate: any;
  public _maxDate: any;


  public _dateLocale = {
    format: 'YYYYMMDD', separator: ' - ', applyLabel: '确认', cancelLabel: '取消',
    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
    firstDay: 1,
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  };

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, private renderer2: Renderer2) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get value(): any {
    const _dateObj = {};
    const _dateArr = [];
    const _value = this._formControl.value;
    if (_value instanceof Object) {
      if (_value['startDate'] && _value['startDate']['_d']) {
        _value['startDate'] = _value['startDate']['_d'];
      }
      if (_value['endDate'] && _value['endDate']['_d']) {
        _value['endDate'] = _value['endDate']['_d'];
      }
      if (_value['startDate'] && _value['startDate'] instanceof Date === true) {
        _dateObj['startDate'] = this._ctrlService.dateToStr(_value['startDate']);
      } else if (_value['startDate']) {
        try {
          _dateObj['startDate'] = this._ctrlService.getDateParams(_value['startDate']) instanceof Date === true ?
            _value['startDate'] : null;
        } catch (e) {
          _dateObj['startDate'] = null;
        }
      } else {
        _dateObj['startDate'] = null;
      }
      if (_value['endDate'] && _value['endDate'] instanceof Date === true) {
        _dateObj['endDate'] = this._ctrlService.dateToStr(_value['endDate']);
      } else if (_value['endDate']) {
        try {
          _dateObj['endDate'] = this._ctrlService.getDateParams(_value['endDate']) instanceof Date === true ? _value['endDate'] : null;
        } catch (e) {
          _dateObj['endDate'] = null;
        }
      } else {
        _dateObj['endDate'] = null;
      }
    }
    _dateArr[0] = _dateObj['startDate'];
    _dateArr[1] = _dateObj['endDate'];
    if (!_dateArr[0] && !_dateArr[1]) {
      return [];
    }
    return _dateArr;
  }
  public set value(value: any) {
    const _dateObj = this.transformValue(value);
    this._formControl.setValue(_dateObj);
  }

  public transformValue(value: any): any {
    if (value instanceof Array) {
      value.forEach(date => {
        if (date instanceof Date) {
          date = this._ctrlService.dateToStr(date);
        } else {
          try {
            date = new Date(date);
          } catch (e) {
            console.log(e);
            console.error('输入日期格式有误');
          }
        }
      });
      const _obj = {};
      _obj['startDate'] = value[0];
      _obj['endDate'] = value[1];
      return _obj;
    } else if (typeof (value) === 'string') {
      try {
        const _arr = value.split('-');
        if (_arr.length === 2) {
          const _obj = {};
          _obj['startDate'] = this._ctrlService.getDateParams(_arr[0]);
          _obj['endDate'] = this._ctrlService.getDateParams(_arr[1]);
          return _obj;
        }
      } catch (e) { }
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
    if (minDate) {
      // this._minDate = MomentObj(minDate);
    }
  }

  public set maxDate(maxDate: string) {
    if (maxDate) {
      // this._maxDate = MomentObj(maxDate);
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
  public pickerClick(event): void {
    const pEle = event['target'] ? event.target['parentElement'] : null;
    if (pEle) {
      let pEleRight = window.innerWidth - pEle.getBoundingClientRect().x - pEle.offsetWidth;
      if (this.hasClear) { pEleRight = pEleRight - 24; }
      setTimeout(() => {
        const pickerEle = pEle.querySelector('.md-drppicker');
        const pickerShow = pickerEle.className.indexOf('shown') > -1;
        if (window.innerWidth - pickerEle.getBoundingClientRect().x - 514 < 0) {
          this.renderer2.setStyle(pickerEle, 'right', (pickerShow ? pEleRight : 0) + 'px');
        }
      }, 50);
    }
  }

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
}
