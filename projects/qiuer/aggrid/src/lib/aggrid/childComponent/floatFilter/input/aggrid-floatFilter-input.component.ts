import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel } from '@ag-grid-community/all-modules';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../haveOptionsValueType';
import { FormControl } from '@angular/forms';
import { AgFrameworkComponent } from '@ag-grid-community/angular';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import { FilterConditionService } from '../../filterCondition.service';
import { debounceTime } from 'rxjs/operators';
export interface AggridFloatFilterInputParams extends IFloatingFilterParams {
    tip?: string;
    lable?: string;
    valueType?: string;
    prefixHtml?: string; // 前置
    suffixHtml?: string; // 后置
    debounceTime?: number;
    // filterCondition?: { label: string, value: any }[];
}

@Component({
    templateUrl: './aggrid-floatfilter-input.component.html',
    styleUrls: ['./aggrid-floatfilter-input.component.scss']
})
export class AggridFloatFilterInputComponent implements IFloatingFilter, AgFrameworkComponent<AggridFloatFilterInputParams>, OnDestroy {
    private component: any;
    private params: AggridFloatFilterInputParams;
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
    agInit(params: AggridFloatFilterInputParams): void {
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
        });
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

    onChange(): void {
        this.component.parentFilterInstance((instance) => {
            instance.setModel({ value: this.value });
        });
    }
    // 获得filter组件的value对象
    onParentModelChanged(parentModel): void {
        if (this.value !== parentModel.value) {
            this.value = parentModel.value;
        }
    }

    // 开关 如有监听事件 可用该开关取消订阅
    ngOnDestroy() {
        this.subscribe.unsubscribe();
        this.conditionSubscribe.unsubscribe();
    }
}
