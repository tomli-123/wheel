import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

export interface AggridViewIconParams {
    icon?: string;
    tip?: string;
    disabled?: boolean;
}
@Component({
    selector: 'row-icon',
    styleUrls: ['./aggrid-view-icon.component.scss'],
    templateUrl: './aggrid-view-icon.component.html'
})
export class AggridViewIconComponent implements ICellRendererAngularComp {
    public params: any;
    public cellRendererParams: AggridViewIconParams;
    public icon: string;
    public tip: string;
    public disabled: boolean;
    public componentResultEvent: string;
    agInit(params: any): void {
        this.params = params;
        if (params.colDef.cellRendererParams !== undefined) {
            this.cellRendererParams = params.colDef.cellRendererParams;

            this.icon = this.cellRendererParams.icon || '';

            this.tip = this.cellRendererParams.tip || '';

            if (params.valueFormatted !== undefined  && params.valueFormatted !== null) {
                this.disabled = params.valueFormatted;
            } else {
                this.disabled = this.cellRendererParams.disabled || false;
            }

        }

    }
    onColumnIconClick() {
        if (this.params.colDef.cellRendererResultEvent !== undefined) {
            this.params.context._parent.onViewComponentChange(this.params.colDef.cellRendererResultEvent, this.params.data);
        }

    }
    refresh(): boolean {
        return false;
    }
}
