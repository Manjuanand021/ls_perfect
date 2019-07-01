import { Component, ViewChild } from '@angular/core';
import { IDoesFilterPassParams } from 'ag-grid-community';

import { LfInputText, LfInputComponent } from 'life-core/component/input';
import { I18n } from 'life-core/i18n';
import { GridFilter, TextGridFilter } from '../model/grid-filter.model';
import { TextFilterOptionExt, IGridFilterParams } from './../model/grid-filter-params';
import { GridFilterComponent } from '../grid-filter.component';

@Component({
    selector: 'text-filter',
    templateUrl: './text-filter.component.html'
})
export class TextFilterComponent extends GridFilterComponent<string> {
    @ViewChild('filterText')
    protected input: LfInputText;
    public filterRegExp: RegExp;

    constructor(i18n: I18n) {
        super(i18n);
    }

    public agInit(params: IGridFilterParams): void {
        super.agInit(params);
        if (this.params.filterOptionExt) {
            this.filterRegExp = (<TextFilterOptionExt>this.params.filterOptionExt).regExp;
            this.filteringType = (<TextFilterOptionExt>this.params.filterOptionExt).filterType;
        }
    }

    protected get filterInput(): LfInputComponent<string> {
        return this.input;
    }

    public isFilterActive(): boolean {
        return super.isFilterActive() && this.filterValue !== '';
    }

    public doesFilterPass(params: IDoesFilterPassParams): boolean {
        // This function only applies to in-memory grid
        return (
            this.valueGetter(params.node)
                .toString()
                .toLowerCase()
                .indexOf(this.filterValue.toLowerCase()) >= 0
        );
    }

    public getModel(): GridFilter {
        return new TextGridFilter(this.filteringType, this.filterValue);
    }

    public setModel(model: any): void {
        this.filteringType = model ? model.type : null;
        this.filterValue = model ? model.filter : '';
    }
}
