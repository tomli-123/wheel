import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel } from '@ag-grid-community/all-modules';
import { ValueType, ValueTypeString, ValueTypeNumber, ValueTypeObject } from '../../haveOptionsValueType';
import { FormControl } from '@angular/forms';
import { AgFrameworkComponent } from '@ag-grid-community/angular';

export interface AggridFloatFilterSelectParams extends IFloatingFilterParams {
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
    templateUrl: './aggrid-floatFilter-select.component.html',
    styleUrls:['./aggrid-floatFilter-select.component.scss']
})
export class AggridFloatFilterSelectComponent implements IFloatingFilter, AgFrameworkComponent<AggridFloatFilterSelectParams>, OnDestroy {
    private component: any;
    private params: AggridFloatFilterSelectParams;
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

    @ViewChild('select', { static: true }) public select;

    agInit(params: AggridFloatFilterSelectParams): void {
        console.log(params);
        this.component = params;
        this.oldValue = this.component.value;
        this.params = this.component.column.colDef.floatingFilterComponentParams;
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
            console.log(res);
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


    // 向filter组件发射value对象
    onChange(e) {
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

    ngOnDestroy() {
    }
}
