import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IToolPanel, IToolPanelParams } from '@ag-grid-community/all-modules';
import { debounceTime } from 'rxjs/operators';
export interface ContainerParams extends IToolPanelParams {
    parentComponent: any;
    metadata: any;
}
@Component({
    templateUrl: './aggrid-toolPanel-container.html',
    styleUrls: ['./aggrid-toolPanel-container.scss']
})

export class AggridToolPanelContainerComponent implements IToolPanel {
    public formControl: FormControl = new FormControl();
    private params: ContainerParams;
    public metadata = [];
    public parentComponent: any;
    refresh(): void {
        throw new Error('Method not implemented.');
    }
    agInit(params: ContainerParams): void {
        this.params = params;
        this.metadata = params.metadata;
        this.parentComponent = params.parentComponent;
        console.log(this.metadata);
    }
}
