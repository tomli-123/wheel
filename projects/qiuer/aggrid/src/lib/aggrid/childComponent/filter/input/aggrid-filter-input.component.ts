import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from '@ag-grid-community/all-modules';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import { FilterConditionService } from '../../filterCondition.service';
import { debounceTime } from 'rxjs/operators';
export interface AggridFilterInputParams extends IFilterParams {
    tip?: string;
    lable?: string;
    valueType?: string;
    prefixHtml?: string; // 前置
    suffixHtml?: string; // 后置
    debounceTime?: number;
    // filterCondition?: { label: string, value: any }[];
}

@Component({
    templateUrl: './aggrid-filter-input.component.html',
    styleUrls: ['./aggrid-filter-input.component.scss']
})
export class AggridFilterInputComponent implements IFilterAngularComp, AfterViewInit, OnDestroy {
    private component: any;
    private params: AggridFilterInputParams;
    public formControl: FormControl = new FormControl();
    public conditionControl: FormControl = new FormControl();
    public tip: string;
    public valueType: string; // text||number
    public prefixHtml: string; // 前置
    public suffixHtml: string; // 后置
    private subscribe: any;
    private conditionSubscribe: any;
    public options: any[];
    private debounceTime: number;
    protected filterCondition = {
        text: [
            { label: '左匹配', value: 'left' },
            { label: '包含', value: 'fuzzy' },
            { label: '不包含', value: 'exclude' },
            { label: '等于', value: 'equ' },
        ],
        number: [
            { label: '=', value: 'equ' },
            { label: '≠', value: 'neq' },
            { label: '>', value: 'gtr' },
            { label: '<', value: 'less' },
            { label: '≥', value: 'geq' },
            { label: '≤', value: 'leq' }

        ]
    };
    @ViewChild('select', { static: true }) public select;
    constructor(public filterConditionService: FilterConditionService) {

    }
    agInit(params: AggridFilterInputParams): void {
        this.component = params;

        this.params = this.component.colDef.filterParams || {};
        this.valueType = this.params.valueType || 'text';
        this.debounceTime = this.params.debounceTime || 300;
        if (this.valueType === 'number') {
            this.options = this.filterCondition.number;
        } else {
            this.options = this.filterCondition.text;
        }
        this.conditionControl.setValue(this.options[0].value);
        if (this.params.tip !== undefined) {
            this.tip = this.params.tip;
        }

        if (this.params.prefixHtml !== undefined) {
            this.prefixHtml = this.params.prefixHtml || '';
        }
        if (this.params.suffixHtml !== undefined) {
            this.suffixHtml = this.params.suffixHtml || '';
        }

        this.subscribe = this.formControl.valueChanges.pipe(debounceTime(this.debounceTime)).subscribe(res => {
            this.onChange();
        });
        this.conditionSubscribe = this.conditionControl.valueChanges.subscribe(res => {
            this.onChange();
        })
    }



    private set value(value: any) {
        this.formControl.setValue(value);
    }
    private get value() {
        const value = this.formControl.value;
        if (this.valueType === 'number' && typeof value === 'string') {
            return parseFloat(value);
        }
        return value;
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
        return this.filterConditionService[this.conditionControl.value](this.component.valueGetter(params.node), this.value);
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
    }
}
