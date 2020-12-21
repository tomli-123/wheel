import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from '@ag-grid-community/all-modules';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import { FilterConditionService } from '../../filterCondition.service';
export interface AggridFilterDatePickerParams extends IFilterParams {
    label?: string;
    hasClear?: boolean; // 有清除按钮
}
@Component({
    templateUrl: './aggrid-filter-datepicker.component.html',
    styleUrls: ['./aggrid-filter-datepicker.component.scss']
})
export class AggridFilterDatepickerComponent implements IFilterAngularComp, OnDestroy {
    private component: any;
    private params: AggridFilterDatePickerParams;
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

    @ViewChild('select', { static: true }) public select;
    constructor(public filterConditionService: FilterConditionService) {

    }
    agInit(params: AggridFilterDatePickerParams): void {
        this.component = params;

        this.params = this.component.colDef.filterParams || {};
        this.options = this.filterCondition;
        this.conditionControl.setValue(this.options[0].value);

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


    // 是否处于filter状态
    isFilterActive(): boolean {
        return this.value !== undefined && this.value !== '' && this.value !== null;
    }

    // 判断是否通过filter条件
    doesFilterPass(params: IDoesFilterPassParams): boolean {
        if (this.value === undefined || this.value === null || this.value === '' || !this.value) {
            return true;
        }
        if (this.component.colDef['doesFilterPass'] !== undefined) {
            return this.component.colDef['doesFilterPass'](this.component.valueGetter(params.node), this.value);
        }
        const source = Number(this.component.valueGetter(params.node));
        const value = Number(this.value);
        return this.filterConditionService[this.conditionControl.value](source, value);
    }
    // 返回给其他组件的value对象 例如floatFilter
    getModel(): any {
        return { value: this.value };
    }
    // 获取其他组件的value对象
    setModel(model: any): void {
        if (model.value !== this.value) {
            this.value = model.value;
        }
    }

    ngAfterViewInit(): void {

    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }

    onChange(): void {
        this.component.filterChangedCallback();
    }

    // 开关 如有监听事件 可用该开关取消订阅
    ngOnDestroy() {
        this.subscribe.unsubscribe();
        this.conditionSubscribe.unsubscribe();
    }
}


