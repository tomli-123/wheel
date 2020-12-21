import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from '@ag-grid-community/all-modules';
import { IFilterAngularComp } from '@ag-grid-community/angular';
export interface AggridFilterSwitchParams extends IFilterParams {
    label: string;
}
@Component({
    templateUrl: './aggrid-filter-switch.component.html'
})
export class AggridFilterSwitchComponent implements IFilterAngularComp, AfterViewInit, OnDestroy {
    private params: AggridFilterSwitchParams;
    public _formControl: FormControl = new FormControl();
    public _label: string;

    private valueGetter: (rowNode: RowNode) => any;

    get value() {
        return this._formControl.value;
    }

    agInit(params: AggridFilterSwitchParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
        if (this.params.label !== undefined) {
            this._label = this.params.label;
        }

        this._formControl.valueChanges.subscribe(res => {
            this.onChange(res);
        });
    }

    isFilterActive(): boolean {
        return this.value;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        if (this.value === undefined || this.value === null || this.value === '' ) {
            return true;
        }

        if (this.params.colDef['doesFilterPass'] !== undefined) {
            return this.params.colDef['doesFilterPass'](this.valueGetter(params.node), this.value);
        }
        return this.value === this.valueGetter(params.node);
    }

    getModel(): any {
        return { value: this.value };
    }

    setModel(model: any): void {
        if (model.value !== this.value) {
            const value = model.value;
            this._formControl.setValue(value);
        }
    }


    ngAfterViewInit(): void {

    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }

    onChange(newValue): void {
        this.params.filterChangedCallback();
    }


    ngOnDestroy() {
    }
}
