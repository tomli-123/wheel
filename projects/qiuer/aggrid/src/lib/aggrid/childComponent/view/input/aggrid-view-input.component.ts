import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
export interface AggridEditorInputParams {
    label?: string; // 标题
    type?: string; // 输入框值类型
    defaultValue?: any; // 默认值
    disabled?: boolean; // 禁用的, 默认是启用
    required?: boolean; // [校验类]必须的, 值必须填写
    pattern?: string; // [校验类]正则表达式
}

@Component({
    styleUrls: ['./aggrid-view-input.component.scss'],
    templateUrl: './aggrid-view-input.component.html'
})
export class AggridViewInputComponent implements ICellRendererAngularComp {
    @ViewChild('input', { static: true }) input: any;
    private params: any;
    private oldValue: any;
    public _formControl: FormControl = new FormControl();
    public label: string;
    public _required: boolean;
    public _pattern: string;
    public _valueType: string;


    agInit(params: any): void {
        this.params = params;
        // console.log('value%%%', params);
        if (params.valueFormatted !== null && params.valueFormatted !== undefined) {
            this.oldValue = params.valueFormatted;
            this._formControl.setValue(params.valueFormatted);
        } else {
            this.oldValue = params.value || null;
            this._formControl.setValue(params.value || null);
        }
        if (params.colDef.cellRendererParams !== undefined) {
            this.label = params.colDef.cellRendererParams.label || '';
            this._required = params.colDef.cellRendererParams.required || false;
            this._pattern = params.colDef.cellRendererParams.pattern || null;
            if (params.colDef.cellRendererParams.type !== undefined) {
                switch (params.colDef.cellRendererParams.type) {
                    case 'string': this._valueType = 'string'; break;
                    case 'number': this._valueType = 'number'; break;
                    case 'password': this._valueType = 'password'; break;
                    case 'email': this._valueType = 'email'; break;
                    default: this._valueType = 'string'; break;
                }
            }

        } else {
            this.label = '';
            this._required = false;
            this._pattern = null;
            this._valueType = 'string';
        }
        // console.log('value%%%%', this.getValue());
    }

    onInputChange(value) {
        if (this.params.colDef.cellRendererResultEvent !== undefined) {
            this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data, value, this);
        }
        this.nodeValue = value;
    }
    valuechange(event): void {
        // console.log('key%%%', event);
        this.onInputChange(event.target.value);
    }
    get value() {
        // console.log(this._formControl.status);
        if (this._formControl.status === 'INVALID') {
            return this.oldValue;
        }
        const value = this._formControl.value;

        return value;
    }

    public set nodeValue(value) {
        console.dir(this.params.node);
        this.params.node.setDataValue(this.params.column.colId, this.value);
    }

    getValue(): any {
        return this.value;
    }

    refresh(params): boolean {
        return false;
    }
}
