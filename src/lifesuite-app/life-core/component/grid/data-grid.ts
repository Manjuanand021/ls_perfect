import {
    Component,
    ViewEncapsulation,
    ViewContainerRef,
    ElementRef,
    ComponentFactoryResolver,
    OnDestroy,
    Renderer2
} from '@angular/core';

import { AgGridNg2, Ng2FrameworkFactory, Ng2FrameworkComponentWrapper } from 'ag-grid-angular';
import { GridReadyEvent } from 'ag-grid-community';
import { IDataGridColumn } from './model/data-grid-column.model';
import { IDataGridOptions } from './options/data-grid-options';

@Component({
    selector: 'data-grid',
    template:
        '<div *ngIf="dataGridOptions.showTotal" i18n="@@policy.addreviewmessage.grid.total">Total: {{rowCount}}</div>',
    styleUrls: ['./data-grid.css'],
    providers: [Ng2FrameworkFactory, Ng2FrameworkComponentWrapper],
    encapsulation: ViewEncapsulation.None
})
export class DataGrid extends AgGridNg2 implements OnDestroy {
    public rowCount: number;

    private _elementRef: ElementRef<HTMLElement>;
    private _renderer: Renderer2;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        viewContainerRef: ViewContainerRef,
        ng2FrameworkFactory: Ng2FrameworkFactory,
        frameworkComponentWrapper: Ng2FrameworkComponentWrapper,
        componentFactoryResolver: ComponentFactoryResolver,
        renderer: Renderer2
    ) {
        super(elementRef, viewContainerRef, ng2FrameworkFactory, frameworkComponentWrapper, componentFactoryResolver);
        this._elementRef = elementRef;
        this._renderer = renderer;
    }

    public ngAfterContentInit(): void {
        this.overrideGridEvents();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.sizeColumnsToFit();
        this.setCssClass();
    }

    private overrideGridEvents(): void {
        this.overrideOnGridReady();
        this.overrideOnRowDataChanged();
        this.overrideOnGridSizeChanged();
    }

    protected overrideOnGridSizeChanged(): void {
        this.gridOptions.onGridSizeChanged = () => this.sizeColumnsToFit();
    }

    protected overrideOnGridReady(): void {
        const saveOnGridReady = this.gridOptions.onGridReady;
        this.gridOptions.onGridReady = (event: GridReadyEvent) => {
            if (saveOnGridReady) saveOnGridReady(event);
            this.customOnGridReady();
        };
    }

    protected customOnGridReady(): void {
        this.updateRowCount();
    }

    protected overrideOnRowDataChanged(): void {
        const saveOnRowDataChanged = this.gridOptions.onRowDataChanged;
        this.gridOptions.onRowDataChanged = (event?: any) => {
            if (saveOnRowDataChanged) saveOnRowDataChanged(event);
            this.customOnRowDataChanged(event);
        };
    }

    protected customOnRowDataChanged(event: any): void {
        this.updateRowCount();
    }

    private updateRowCount(): void {
        if (this.gridOptions.api) {
            this.rowCount = this.gridOptions.api.getModel().getRowCount();
        }
    }

    protected sizeColumnsToFit(): void {
        if (this.gridOptions.api) {
            this.gridOptions.api.sizeColumnsToFit();
        }
    }

    protected setCssClass(): void {
        if (this.dataGridOptions.gridClass) {
            this._renderer.addClass(this._elementRef.nativeElement, this.dataGridOptions.gridClass);
        }
    }

    public get dataGridOptions(): IDataGridOptions {
        return this.gridOptions as IDataGridOptions;
    }

    public refreshGrid(): void {
        this.gridOptions.api.purgeInfiniteCache(); // this refreshes the grid to again call getRows() in data source
    }

    public rebuildGrid(columns: Array<IDataGridColumn>): void {
        this.api.setColumnDefs(columns);
        this.api.sizeColumnsToFit();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.gridOptions.onGridReady = undefined;
        this.gridOptions.onRowDataChanged = undefined;
        this.gridOptions.onGridSizeChanged = undefined;
        this.gridOptions.onCellFocused = undefined;
    }
}
