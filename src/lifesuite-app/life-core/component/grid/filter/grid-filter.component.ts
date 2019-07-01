import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';

import { ListItem } from 'life-core/model';
import { LfInputComponent } from 'life-core/component/input';
import { I18n } from 'life-core/i18n';
import { GridFilter, GridFilteringType } from './model/grid-filter.model';
import { IGridFilterParams } from './model/grid-filter-params';

export abstract class GridFilterComponent<T> implements IFilterAngularComp {
    protected params: IGridFilterParams;
    protected valueGetter: (rowNode: RowNode) => any;
    /**
     * filteringType: Filtering type such as 'equals' and 'greaterThan'. List defined in GridFilteringType.
     */
    public filteringType: string;
    public filteringTypeList: Array<ListItem>;
    /**
     * filterValue: For single filter it's the filtering value, else it's the filtering from value
     */
    public filterValue: T;
    /**
     * filterToValue: The filtering to value. Only applies to non-single filter
     */
    public filterToValue?: T;
    @ViewChild('form')
    public form: NgForm;
    public isSingleFilter: boolean = true;
    public filterValueLabel: string;
    public messages: Array<string>;
    private _originalModel: GridFilter;
    protected gridFilteringTypeLabelMap: { readonly [key: string]: string };
    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public agInit(params: IGridFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
        this.setupGridFilteringTypeLabelMap();
        this.filteringTypeList = this.getFilteringTypeList();
        this.saveFilterModel();
    }

    protected abstract get filterInput(): LfInputComponent<T>;

    public getFilteringTypeList(): Array<ListItem> {
        // override in child classes if need to provide filteringTypeList
        return null;
    }

    public getDefaultFilteringType(): string {
        // override in child classes to provide default filtering type
        return null;
    }

    public isFilterActive(): boolean {
        return this.filterValue !== null && this.filterValue !== undefined;
    }

    public abstract doesFilterPass(params: IDoesFilterPassParams): boolean;

    public abstract getModel(): GridFilter;

    public abstract setModel(model: any): void;

    public afterGuiAttached(params?: IAfterGuiAttachedParams): void {
        this.messages = [];
        this.setDefaultValues();
        this.setIsSingleFilter();
        this.setFilterInputLabel();
        setTimeout(() => {
            this.filterInput.setFocus();
        });
    }

    private setDefaultValues(): void {
        if (!this.filteringType) {
            this.filteringType = this.getDefaultFilteringType();
        }
    }

    private setIsSingleFilter(): void {
        this.isSingleFilter = this.filteringType != GridFilteringType.InRange;
    }

    private setFilterInputLabel(): void {
        this.filterValueLabel =
            this.filteringType == GridFilteringType.InRange
                ? this.i18n({ value: 'From:', id: 'component.grid.filter.label.from' })
                : this.i18n({ value: 'Value:', id: 'component.grid.filter.label.value' });
    }

    public onFilteringTypeChange(): void {
        this.setIsSingleFilter();
        this.setFilterInputLabel();
    }

    public onApplyClick(): void {
        if (this.form.invalid) {
            this.showInvalidDataMessage();
        } else {
            this.saveFilterModel();
            this.params.filterChangedCallback();
            this.closeFilterMenu();
        }
    }

    private showInvalidDataMessage(): void {
        this.messages = [];
        this.messages.push(this.invalidDataMessage);
    }

    private saveFilterModel(): void {
        this._originalModel = this.getModel();
    }

    public onClearClick(): void {
        const isFilterValueSet: boolean = this.isFilterActive();
        this.form.resetForm();
        this.saveFilterModel();
        if (isFilterValueSet) {
            this.params.filterChangedCallback();
        }
        this.closeFilterMenu();
    }

    public onCancelClick(): void {
        if (this.form.dirty && this._originalModel) {
            this.restoreFilterModel();
        }
        this.closeFilterMenu();
    }

    private restoreFilterModel(): void {
        this.setModel(this._originalModel);
    }

    private closeFilterMenu(): void {
        // ag-grid doesn't provide an API to close the filter menu yet. A feature request is
        // currently in backlog. See issue # AG-144 in https://www.ag-grid.com/ag-grid-pipeline/.
        // Below is a temporary workaround
        document.documentElement.click();
    }

    private get invalidDataMessage(): string {
        return this.i18n({ value: 'Data is missing or invalid.', id: 'component.grid.filter.invalidvalue' });
    }

    private setupGridFilteringTypeLabelMap(): void {
        this.gridFilteringTypeLabelMap = {
            equals: this.i18n({ value: 'Equal', id: 'component.grid.filter.type.equal' }),
            // notEqual: 'Not Equal',
            // lessThan: 'Less Than',
            lessThanOrEqual: this.i18n({
                value: 'Less Than Or Equal',
                id: 'component.grid.filter.type.ltorequal'
            }),
            // greaterThan: 'Greater Than',
            greaterThanOrEqual: this.i18n({
                value: 'Greater Than Or Equal',
                id: 'component.grid.filter.type.gtorequal'
            }),
            startsWith: this.i18n({ value: 'Starts With', id: 'component.grid.filter.type.startswith' }),
            inRange: this.i18n({ value: 'In Range', id: 'component.grid.filter.type.inrange' })
        };
    }
}
