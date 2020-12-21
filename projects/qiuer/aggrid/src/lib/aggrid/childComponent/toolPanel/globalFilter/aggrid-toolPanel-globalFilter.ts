import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IToolPanel, IToolPanelParams } from '@ag-grid-community/all-modules';
import { debounceTime } from 'rxjs/operators';
export interface GlobalFilterParams extends IToolPanelParams {
    parentComponent: any;
}
@Component({
    templateUrl: './aggrid-toolPanel-globalFilter.html',
    styleUrls: ['./aggrid-toolPanel-globalFilter.scss']
})

export class AggridToolPanelGlobalFilterComponent implements IToolPanel {
    public formControl: FormControl = new FormControl();
    private params: GlobalFilterParams;
    refresh(): void {
        throw new Error('Method not implemented.');
    }
    agInit(params: GlobalFilterParams): void {
        this.params = params;
        this.params.api.addEventListener('modelUpdated', this.test.bind(this));

        this.formControl.valueChanges.pipe(debounceTime(300)).subscribe(res => {
            this.params.parentComponent.filterValue = res;
        });
    }
    test() {
        console.log(this);
    }
}
