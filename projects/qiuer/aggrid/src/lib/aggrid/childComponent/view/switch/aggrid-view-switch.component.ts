import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
export interface AggridViewSwitchParams {
    disabled?: Function;
}
@Component({
    selector: 'row-switch',
    styleUrls: ['./aggrid-view-switch.component.scss'],
    templateUrl: './aggrid-view-switch.component.html'
})
export class AggridViewSwitchComponent implements ICellRendererAngularComp {
    public params: any;
    public _formControl: FormControl = new FormControl();
    public cellRendererParams: AggridViewSwitchParams;
    public componentResultEvent: string;
    agInit(params: any): void {
        this.params = params;
        if (params.valueFormatted !== undefined && params.valueFormatted !== null) {
            this._formControl.setValue(params.valueFormatted);
        } else {
            this._formControl.setValue(params.value);
        }
        this._formControl.valueChanges.subscribe(res => {
            this.onSwitchChange(res);
        });
    }
    onSwitchChange(value) {
        if (this.params.colDef.cellRendererResultEvent !== undefined) {
            this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data, value);
        }
    }
    refresh(): boolean {
        return false;
    }
}
