import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel } from '@ag-grid-community/all-modules';
import { AgFrameworkComponent } from '@ag-grid-community/angular';
export interface AggridFloatFilterSliderParams extends IFloatingFilterParams {
    min?: number;
    max?: number;
    step?: number;
    color?: string;
}
@Component({
    styleUrls: ['./aggrid-floatFilter-slider.component.scss'],
    templateUrl: './aggrid-floatFilter-slider.component.html'
})
export class AggridFloatFilterSliderComponent implements IFloatingFilter, AgFrameworkComponent<AggridFloatFilterSliderComponent>, OnDestroy {
    private params: AggridFloatFilterSliderParams;
    public formControl: FormControl = new FormControl();
    min: number;
    max: number;
    step: number;
    color: string;
    agInit(params: any): void {
        this.params = params;
        this.min = params.min || 0;
        this.max = params.max || 0;
        this.step = params.step || 1;
        this.color = params.color || 'accent';
        this.formControl.valueChanges.subscribe(res => {
            this.onValueChange(res);
        });

    }

    onValueChange(value) {
        this.params.parentFilterInstance((instance) => {
            instance.setModel({ value: this.value });
        });
    }
    onParentModelChanged(parentModel): void {
        const value = parentModel.value;
        this.formControl.setValue(value);
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
    // 开关 如有监听事件 可用该开关取消订阅
    ngOnDestroy() {

    }
}
