/***********************************************************************************/
/* author: 宋晨
/* update logs:
/* 2020/9/25 宋晨 创建
/***********************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ControllerComponent, ControllerMetadata } from '../controller.component';
import { ControllerService } from '../controller.service';
import { ContainerService } from '@qiuer/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

/***********************************************************************************/
/*                                     接口                                        */
/***********************************************************************************/
export interface DateComparisonPickerControllerMetadata extends ControllerMetadata {
  maxDate?: string; // 可选最大日期
  minDate?: string; // 可选最小日期
  comparisonDateStart?: any; // 对比初始日期
  comparisonDateEnd?: any; // 对比结束日期
  separator?: string; // 链接符
  defInterval?: string | number; // 默认间隔时间 week | month | 天数
  intervalPath?: string; // before | after 间隔时间方向
}

/***********************************************************************************/
/*                                     组件                                        */
/* 方法:
/* set/get 存取器get/set 用户使用
/* comparisonStart 对比起日期
/* comparisonEnd 对比止日期
/* min 可选最小日期
/* max 可选最大日期
/***********************************************************************************/
@Component({
  selector: 'datecomparisonpicker-ctrl',
  templateUrl: './datecomparisonpicker.component.html',
  styleUrls: ['./datecomparisonpicker.component.scss']
})
export class DateComparisonPickerControllerComponent extends ControllerComponent implements OnInit {

  /***********************************************************************************/
  /*                    私有或继承  for private or inherit                           */
  /***********************************************************************************/
  @ViewChild('campaignOnePicker', { static: true }) campaignOnePicker;

  protected _metadata: DateComparisonPickerControllerMetadata;
  _defaultDate: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null)
  });

  _comparisonDateStart: Date;
  _comparisonDateEnd: Date;
  _maxDate: Date;
  _minDate: Date;
  _separator: string;

  private _defInterval: number;
  private _interMonth: number = new Date().getMonth(); // 标识用哪个月的天数做间隔
  private _startDate: Date;
  private _endDate: Date;
  private _intervalPath: string;

  constructor(public _service: ContainerService, public _ctrlService: ControllerService, public fb: FormBuilder) {
    super(_service, _ctrlService);
  }

  /***********************************************************************************/
  /*                           存取器get/set 用户使用                                */
  /***********************************************************************************/
  public get value(): any {
    const _dateObj = {};
    const _dateArr = [];
    const _value = this._defaultDate.getRawValue();
    if (_value instanceof Object) {
      _value['startDate'] = _value['startDate'] || null;
      _value['endDate'] = _value['endDate'] || null;
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
    const _date = this.transformValue(value);
    this._defaultDate.patchValue(_date);
    this._formControl.setValue(this.value);
  }

  public set comparisonDateStart(value: string | Date) { this._comparisonDateStart = new Date(value); }
  public get comparisonDateStart(): string | Date { return this._comparisonDateStart; }

  public set comparisonDateEnd(value: string | Date) { this._comparisonDateEnd = new Date(value); }
  public get comparisonDateEnd(): string | Date { return this._comparisonDateEnd; }

  public set maxDate(maxDate: string | Date) { this._maxDate = maxDate ? this._ctrlService.getDateParams(maxDate) : new Date('2099/01/01'); }
  public get maxDate(): string | Date { return this._maxDate; }

  public set minDate(minDate: string | Date) { this._minDate = minDate ? this._ctrlService.getDateParams(minDate) : new Date('1970/01/01'); }
  public get minDate(): string | Date { return this._minDate; }

  public set separator(value: string) { this._separator = value; }
  public get separator(): string {
    const str = this.value.length === 2 ? this._separator : '';
    return str;
  }

  public set intervalPath(intervalPath: string) {
    this._intervalPath = intervalPath;
    this._interMonth = intervalPath === 'before' ? new Date().getMonth() : new Date().getMonth() + 1;
  }
  public get intervalPath(): string { return this._intervalPath; }

  public set defInterval(defInterval: string | number) {
    const defIntervalDay = [7, new Date(new Date().getFullYear(), this._interMonth, 0).getDate()];
    enum defIntervalList { 'week', 'month' };
    this._defInterval = typeof (defInterval) === 'string' ? defIntervalDay[defIntervalList[defInterval]] : defInterval;
  }
  public get defInterval(): string | number { return this._defInterval; }

  /***********************************************************************************/
  /*                            生命周期 life cycle                                  */
  /***********************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    const metadata = this._metadata;
    this.comparisonDateStart = metadata.comparisonDateStart;
    this.comparisonDateEnd = metadata.comparisonDateEnd;
    this.maxDate = metadata.maxDate;
    this.minDate = metadata.minDate;
    this.separator = metadata.separator;
    this.intervalPath = metadata.intervalPath;
    this.defInterval = metadata.defInterval;
  }

  /***********************************************************************************/
  /*                              互相调用  for call                                 */
  /***********************************************************************************/
  public startChange(e) {
    this._startDate = e.value;
  }

  public endChange(e) {
    this._endDate = e.value ? e.value : null;
    this.dateChange();
  }

  public dateChange() {
    let _value: string;
    if (this.defInterval || this.defInterval === 0) {
      const _interval = 1000 * 60 * 60 * 24 * (this._defInterval - 1);
      _value = this.intervalPath === 'before' ? `${this._service.dateToStr(new Date(this._startDate.getTime() - _interval))}-${this._service.dateToStr(this._startDate)}` :
        `${this._service.dateToStr(this._startDate)}-${this._service.dateToStr(new Date(this._startDate.getTime() + _interval))}`;
    } else {
      _value = this._startDate && this._endDate ? `${this._service.dateToStr(this._startDate)}-${this._service.dateToStr(this._endDate)}` : null;
      if (!_value) { return; }
    }
    this.value = _value;
  }

  public openPicker() {
    this.campaignOnePicker.open();
  }

  public clearValue() {
    this._defaultDate.reset();
  }

  public transformValue(value: string | Array<string | Date>): any {
    const _obj = {
      startDate: null,
      endDate: null
    };
    if (value instanceof Array && value.length === 2) {
      const _value = [];
      value.forEach(date => {
        let _date = null;
        if (date instanceof Date) {
          _date = this._ctrlService.dateToStr(date);
        } else {
          try {
            _date = this._ctrlService.getDateParams(date);
          } catch (e) {
            console.error('输入日期格式有误');
          }
        }
        _value.push(_date);
      });
      _obj['startDate'] = _value[0] || null;
      _obj['endDate'] = _value[1] || null;
    } else if (typeof (value) === 'string') {
      try {
        const _arr = value.split('-');
        if (_arr.length === 2) {
          _obj['startDate'] = this._ctrlService.getDateParams(_arr[0]) || null;
          _obj['endDate'] = this._ctrlService.getDateParams(_arr[1]) || null;
        }
      } catch (e) { console.log(e); }
    }
    return _obj;
  }

}
