import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

export interface AggridViewSliderParams {
    min?: number;
    max?: number;
    step?: number;
    color?: string;
}
@Component({
    styleUrls: ['./aggrid-view-slider.component.scss'],
    templateUrl: './aggrid-view-slider.component.html'
})
export class AggridViewSliderComponent implements ICellRendererAngularComp {
    public params: any;
    public cellRendererParams: AggridViewSliderParams;
    public formControl: FormControl = new FormControl();
    min: number;
    max: number;
    step: number;
    color: string;
    agInit(params: any): void {
        this.params = params;
        this.min = params.colDef.cellRendererParams.min || 0;
        this.max = params.colDef.cellRendererParams.max || 0;
        this.step = params.colDef.cellRendererParams.step || 1;
        this.color = params.colDef.cellRendererParams.color || 'accent';
        this.formControl.setValue(params.value || 0);
        this.formControl.valueChanges.subscribe(res => {
            this.onValueChange(res);
        });

    }
    refresh(params): boolean {
        return false;
    }

    onValueChange(value) {
        if (this.params.colDef.cellRendererResultEvent !== undefined) {
            this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data, value, this);
        }
        this.nodeValue = this.value;
    }

    public set nodeValue(value) {
        this.params.node.setDataValue(this.params.column.colId, this.value);
    }

    public set value(value: number) {
        this.formControl.setValue(value);
    }
    public get value() {
        return this.formControl.value;
    }
    getValue(): any {
        return this.value;
    }
}
