import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
export interface AggridViewButtonParams {
    label?: string;
    icon?: string;
    tip?: string;
    shape?: string; // 按钮形状 rectangle: 方形   circle： 大圆  mini-circle: 小圆  basic：基本按钮  stroked：轻触按钮  flat：扁平化按钮 icon:图标形
    disabled?: boolean;
    stopPropagation?: boolean; // 是否阻止冒泡事件 默认是true
    onClick?: string;
}
@Component({
    styleUrls: ['./aggrid-view-button.component.scss'],
    templateUrl: './aggrid-view-button.component.html'
})
export class AggridViewButtonComponent implements ICellRendererAngularComp {
    public params: any;
    public cellRendererParams: AggridViewButtonParams[];
    agInit(params: any): void {
        this.params = params;
        this.cellRendererParams = [];
        const cellRendererParams = params.colDef.cellRendererParams || [];
        for (const i of cellRendererParams) {
            const renderParam: AggridViewButtonParams = {};
            renderParam.label = i.label || '';
            renderParam.icon = i.icon;
            renderParam.onClick = i.onClick;
            renderParam.tip = i.tip || '';
            switch (i.shape) {
                case 'rectangle': renderParam.shape = 'mat-raised-button'; break;
                case 'circle': renderParam.shape = 'mat-fab'; break;
                case 'mini-circle': renderParam.shape = 'mat-mini-fab'; break;
                case 'basic': renderParam.shape = 'mat-button'; break;
                case 'stroked': renderParam.shape = 'mat-stroked-button'; break;
                case 'flat': renderParam.shape = 'mat-flat-button'; break;
                case 'icon': renderParam.shape = 'mat-icon-button'; break;
                default: renderParam.shape = 'mat-raised-button'; break;
            }
            renderParam.disabled = i.disabled || false;
            if (i.stopPropagation !== undefined) {
                renderParam.stopPropagation = !!params.stopPropagation;
            } else {
                renderParam.stopPropagation = true;
            }
            this.cellRendererParams.push(renderParam);
        }
    }
    onColumnButtonClick(e, item) {
        if (item.stopPropagation) {
            e.stopPropagation();
        }

        if (item.onClick !== undefined) {
            this.params.context._parent.onViewComponentChange(item.onClick, this.params.data);
        }

    }
    refresh(): boolean {
        return false;
    }
    // 改变单元格的值
    set nodeValue(value: any) {
        this.params.node.setValue(value);
    }
}
