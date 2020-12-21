import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel } from '@ag-grid-community/all-modules';
import { AgFrameworkComponent } from '@ag-grid-community/angular';
import { FilterConditionService } from '../../filterCondition.service';
export interface AggridFloatFilterDatePickerParams extends IFloatingFilterParams {
    label?: string;
    hasClear?: boolean; // 有清除按钮
}
@Component({
    templateUrl: './aggrid-floatFilter-datepicker.component.html',
    styleUrls: ['./aggrid-floatFilter-datepicker.component.scss']
})
export class AggridFloatFilterDatepickerComponent implements IFloatingFilter, AgFrameworkComponent<AggridFloatFilterDatePickerParams>, OnDestroy {
    private params: AggridFloatFilterDatePickerParams;
    public formControl: FormControl = new FormControl();
    public conditionControl: FormControl = new FormControl();
    public label: string;
    public hasClear: boolean;
    private subscribe: any;
    private conditionSubscribe: any;
    public options: any[];

    protected filterCondition = [
        { label: '=', value: 'equ' },
        { label: '≠', value: 'neq' },
        { label: '>', value: 'gtr' },
        { label: '<', value: 'less' },
        { label: '≥', value: 'geq' },
        { label: '≤', value: 'leq' }

    ];

    constructor(public filterConditionService: FilterConditionService) {

    }
    agInit(params: AggridFloatFilterDatePickerParams): void {
        this.params = params;
        this.label = this.params.label || '';

        this.hasClear = this.params.hasClear;

        this.subscribe = this.formControl.valueChanges.subscribe(res => {
            this.onChange();
        });
        this.conditionSubscribe = this.conditionControl.valueChanges.subscribe(res => {
            this.onChange();
        });
    }



    private set value(value: any) {
        this.formControl.setValue(value);
    }
    private get value() {
        return this.formControl.value;
    }

    onParentModelChanged(parentModel): void {
        const value = parentModel.value;
        this.formControl.setValue(value);
    }

    onChange(): void {
        this.params.parentFilterInstance((instance) => {
            instance.setModel({ value: this.value });
        });
    }

    // 开关 如有监听事件 可用该开关取消订阅
    ngOnDestroy() {
        this.subscribe.unsubscribe();
        this.conditionSubscribe.unsubscribe();
    }
}


