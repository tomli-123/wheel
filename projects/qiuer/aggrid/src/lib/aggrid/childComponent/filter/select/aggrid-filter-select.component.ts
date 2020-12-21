import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from '@ag-grid-community/all-modules';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../haveOptionsValueType';
export interface AggridFilterSelectParams extends IFilterParams {
    tip?: string;
    valueType?: string;
    prefixHtml?: string; // 前置
    suffixHtml?: string; // 后置
    useEmptyAsString?: boolean; // 是否使用空字符串作为空值 默认值为false;
    hasClear?: boolean;
    options?: any[];
    option: { label?: string, value?: string };
    emptyLabel?: string;
}

@Component({
    templateUrl: './aggrid-filter-select.component.html'
})
export class AggridFilterSelectComponent implements IFilterAngularComp, AfterViewInit, OnDestroy {
    private component: any;
    private params: AggridFilterSelectParams;
    private oldValue: any;
    public formControl: FormControl = new FormControl();
    public tip: string;
    public valueType: string;
    public _valueType: ValueType;
    public prefixHtml: string; // 前置
    public suffixHtml: string; // 后置
    public useEmptyAsString: boolean; // 是否使用空字符串作为空值 默认值为false;
    public options: any[];
    public option: { label?: string, value?: string };
    public emptyLabel: string;
    private _hasDestroy = false;
    @ViewChild('select', { static: true }) public select;


    agInit(params: AggridFilterSelectParams): void {
        this.component = params;
        this.oldValue = this.component.value;
        this.params = this.component.colDef.filterParams;
        this.options = this.params.options || [];
        this.option = this.params.option || {};
        const label: string = this.option.label || null;
        const value: string = this.option.value || null;
        this.valueType = this.params.valueType || 'string';
        this._valueType = this._createValueType(this.valueType, label, value);
        this.value = this.oldValue;
        if (this.params.tip !== undefined) {
            this.tip = this.params.tip;
        }
        if (this.params.useEmptyAsString !== undefined) {
            this.useEmptyAsString = this.params.useEmptyAsString || false;
        }
        if (this.params.prefixHtml !== undefined) {
            this.prefixHtml = this.params.prefixHtml || '';
        }
        if (this.params.suffixHtml !== undefined) {
            this.suffixHtml = this.params.suffixHtml || '';
        }

        this.emptyLabel = this.params.emptyLabel || '<-请选择->';
        this.formControl.valueChanges.subscribe(res => {
            this.onChange(res);
        });
    }

    protected _createValueType(valueType: string, label: string, value: string) {
        if (!valueType) { valueType = 'string'; }
        let ret: ValueType = null;
        const vt = valueType.toLowerCase();
        if (vt !== 'object') {
            if (!label) { label = 'label'; }
            if (!value) { value = 'value'; }
        }
        switch (vt) {
            case 'string': ret = new ValueTypeString(label, value); break;
            case 'number': ret = new ValueTypeNumber(label, value); break;
            case 'object': ret = new ValueTypeObject(label, value); break;
        }
        return ret;
    }



    private set value(value: any) {
        const _value = this._valueType.setValue(this.options, value);
        this.formControl.setValue(_value);
    }
    private get value() {
        const value = this.formControl.value;
        if (this.useEmptyAsString && (value === undefined || value === null)) {
            return '';
        }
        if (!this.useEmptyAsString && (value === undefined || value === '')) {
            return null;
        }

        return this._valueType.getValue(this.formControl.value);
    }


    // 是否处于filter状态
    isFilterActive(): boolean {
        return this.value !== undefined && this.value !== '' && this.value !== null;
    }

    // 判断是否通过filter条件
    doesFilterPass(params: IDoesFilterPassParams): boolean {
        if (this.value === undefined || this.value === null || this.value === '') {
            return true;
        }

        if (this.component.colDef['doesFilterPass'] !== undefined) {
            return this.component.colDef['doesFilterPass'](this.component.valueGetter(params.node), this.value);
        }
        return this.value === this.component.valueGetter(params.node);
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

    onChange(newValue): void {
        this.component.filterChangedCallback();
    }

    // 开关 如有监听事件 可用该开关取消订阅
    ngOnDestroy() {
        this._hasDestroy = true;
    }
}
