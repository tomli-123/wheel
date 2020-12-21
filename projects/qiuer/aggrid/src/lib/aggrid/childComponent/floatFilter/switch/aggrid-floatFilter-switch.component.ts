import { Component, OnDestroy } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel } from '@ag-grid-community/all-modules';

import { FormControl } from '@angular/forms';
import { AgFrameworkComponent } from '@ag-grid-community/angular';

export interface AggridFloatFilterSwitchParams extends IFloatingFilterParams {
    label: string;
}

@Component({
    templateUrl: './aggrid-floatFilter-switch.component.html'
})
export class AggridFloatFilterSwitchComponent implements IFloatingFilter, AgFrameworkComponent<AggridFloatFilterSwitchParams>, OnDestroy {

    private params: AggridFloatFilterSwitchParams;
    public _formControl: FormControl = new FormControl();
    public _label: string;
    get value() {
        return this._formControl.value;
    }

    agInit(params: AggridFloatFilterSwitchParams): void {
        this.params = params;
        if (this.params.label !== undefined) {
            this._label = this.params.label;
        }
        this._formControl.valueChanges.subscribe(res => {
            this.valueChanged(res);
        });
    }

    valueChanged(e) {
        this.params.parentFilterInstance((instance) => {
            instance.setModel({ value: this.value });
        });
    }


    onParentModelChanged(parentModel): void {
        const value = parentModel.value;

        this._formControl.setValue(value);
    }


    ngOnDestroy() {

    }
}
