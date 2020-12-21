import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
export interface AggridEditorInputParams {
    label?: string; // 标题
    position?: string;  // 复选框相对文本的位置(before、after),默认为after
    tip?: string; // 提示信息(显示为一个'问号'), 内容可以换行
}

@Component({
    styleUrls: ['./aggrid-view-checkbox.component.scss'],
    templateUrl: './aggrid-view-checkbox.component.html'
})
export class AggridViewCheckboxComponent implements ICellRendererAngularComp {
    @ViewChild('input', { static: true }) input: any;
    private params: any;
    public _formControl: FormControl = new FormControl();
    public label: string;
    public tip: string;
    public _position: string;


    agInit(params: any): void {
        this.params = params;
        // console.log('value%%%', params);
        this._formControl.setValue(params.value || null);
        if (params.colDef.cellRendererParams !== undefined) {
            this.label = params.colDef.cellRendererParams.label || '';
            this._position = params.colDef.cellRendererParams.position || 'after';
            this.tip = params.colDef.cellRendererParams.tip;
        } else {
            this.label = '';
            this._position = 'after';
        }

        this._formControl.valueChanges.subscribe(res => {
            this.onValueChange(res);
        });
    }

    onValueChange(value) {
        if (this.params.colDef.cellRendererResultEvent !== undefined) {
            this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data, value, this);
        }
        this.nodeValue = this.value;
    }

    public set nodeValue(value) {
        console.dir(this.params.node);
        this.params.node.setDataValue(this.params.column.colId, this.value);
    }

    public set value(value: boolean) {
        this._formControl.setValue(value);
    }
    public get value() {
        return this._formControl.value;
    }
    getValue(): any {
        return this.value;
    }

    refresh(params): boolean {
        return true;
    }
}
