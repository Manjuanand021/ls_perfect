import { Component, Injector, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { IGridColumnsBuilder, DataGridColumns, DataGrid } from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm';
import { MedicalProviderProxyDTO } from 'ls-core/model';
import { MedicalProviderListColumnsBuilder } from './medical-provider-list-columns.builder';

@Component({
    selector: 'medical-provider-list',
    templateUrl: './medical-provider-list.component.html',
    providers: [PolicySubscriber, MedicalProviderListColumnsBuilder]
})
export class MedicalProviderListComponent extends BasePolicyGridViewModel<MedicalProviderProxyDTO> {
    @Output() public onRowSelect = new EventEmitter<MedicalProviderProxyDTO>();

    @ViewChild(DataGrid) public refDataGrid: DataGrid;

    private _gridColumnsBuilder: MedicalProviderListColumnsBuilder;

    private _providerList: MedicalProviderProxyDTO[];

    private _searchType: string;

    constructor(injector: Injector, gridColumnsBuilder: MedicalProviderListColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public get providerList(): MedicalProviderProxyDTO[] {
        return this._providerList;
    }

    @Input() public set providerList(value: MedicalProviderProxyDTO[]) {
        this._providerList = value;
        this.refreshGrid();
    }

    public get searchType(): string {
        return this._searchType;
    }

    @Input() public set searchType(value: string) {
        this._searchType = value;
        if (this.refDataGrid.api) {
            this.refDataGrid.rebuildGrid(this.getGridColumns().getLayout());
        }
    }

    public loadData(): Promise<void> {
        return super.loadData();
    }

    public getGridColumns(): DataGridColumns {
        return this._gridColumnsBuilder.build(this.searchType);
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this.onRowSelect.emit($event.data);
    }

    public getRowSelectionType(): string {
        return 'single';
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): MedicalProviderProxyDTO[] {
        return this.providerList;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getRowNodeId(data: MedicalProviderProxyDTO) {
        return data.ClientID;
    }
}
