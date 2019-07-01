import { Component, ViewChild } from '@angular/core';
import { IDoesFilterPassParams } from 'ag-grid-community';

import { DateUtil } from 'life-core/util';
import { ListItem } from 'life-core/model';
import { LfInputDate, LfInputComponent } from 'life-core/component/input';
import { I18n } from 'life-core/i18n';
import { GridFilter, DateGridFilter, GridFilteringType } from '../model/grid-filter.model';
import { GridFilterComponent } from '../grid-filter.component';
import { FilterUtil } from '../filter.util';

@Component({
    selector: 'date-filter',
    templateUrl: './date-filter.component.html'
})
export class DateFilterComponent extends GridFilterComponent<Date> {
    @ViewChild('filterDate')
    protected input: LfInputDate;

    constructor(i18n: I18n) {
        super(i18n);
        this.i18n = i18n;
    }

    protected get filterInput(): LfInputComponent<Date> {
        return this.input;
    }

    public getFilteringTypeList(): Array<ListItem> {
        return [
            new ListItem(this.gridFilteringTypeLabelMap[GridFilteringType.Equals], GridFilteringType.Equals),
            new ListItem(
                this.gridFilteringTypeLabelMap[GridFilteringType.GreaterThanOrEqual],
                GridFilteringType.GreaterThanOrEqual
            ),
            new ListItem(
                this.gridFilteringTypeLabelMap[GridFilteringType.LessThanOrEqual],
                GridFilteringType.LessThanOrEqual
            ),
            new ListItem(this.gridFilteringTypeLabelMap[GridFilteringType.InRange], GridFilteringType.InRange)
        ];
    }

    public getDefaultFilteringType(): string {
        return GridFilteringType.InRange;
    }

    public doesFilterPass(params: IDoesFilterPassParams): boolean {
        // This function only applies to in-memory grid, not server grid
        return FilterUtil.passFilter<Date>(
            this.filteringType,
            this.valueGetter(params.node),
            this.filterValue,
            this.filterToValue
        );
    }

    public getModel(): GridFilter {
        return new DateGridFilter(
            this.filteringType,
            DateUtil.dateToString(this.filterValue),
            DateUtil.dateToString(this.filterToValue)
        );
    }

    public setModel(model: DateGridFilter): void {
        this.filteringType = model ? model.type : null;
        this.filterValue = model ? DateUtil.stringToDate(model.dateFrom) : null;
        this.filterToValue = model ? DateUtil.stringToDate(model.dateTo) : null;
    }
}
