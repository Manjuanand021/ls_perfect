import { CompositeFilter, NumericFilter, BooleanFilter } from 'ls-core/service';

import { SummaryFilterModel } from 'business/home/summary/filter';

export class RecentlyAccessedCasesFilterBuilder {
    private _summaryFilterModel: SummaryFilterModel;

    public buildFilter(summaryFilterModel: SummaryFilterModel): CompositeFilter {
        this._summaryFilterModel = summaryFilterModel;
        const filter = new CompositeFilter([]);
        filter.filters.push(this.getCasesFilter());
        if (this.isUserSelected()) filter.filters.push(this.getUserFilter());
        if (this.isTeamSelected()) filter.filters.push(this.getTeamFilter());
        return filter;
    }

    private getCasesFilter(): BooleanFilter {
        return new BooleanFilter('PrimaryInsuredFlag', true);
    }

    private isUserSelected(): boolean {
        return this._summaryFilterModel.selectedUser != undefined && this._summaryFilterModel.selectedUser != 0;
    }

    private isTeamSelected(): boolean {
        return this._summaryFilterModel.selectedTeam != undefined && this._summaryFilterModel.selectedTeam != 0;
    }

    private getUserFilter(): NumericFilter {
        return new NumericFilter(
            'RfUserId',
            this._summaryFilterModel.selectedUser,
            this._summaryFilterModel.selectedUser
        );
    }

    private getTeamFilter(): NumericFilter {
        return new NumericFilter(
            'TeamId',
            this._summaryFilterModel.selectedTeam,
            this._summaryFilterModel.selectedTeam
        );
    }
}
