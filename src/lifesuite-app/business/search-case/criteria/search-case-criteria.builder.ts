import { DateUtil } from 'life-core/util';

import { CompositeFilter, SimpleTextFilter, DateFilter } from 'ls-core/service';
import { PolicyByProductProxyDTO } from 'ls-core/model';

export class SearchCaseCriteriaBuilder {
    private _policyByProductProxyDTO: PolicyByProductProxyDTO;
    private _searchCaseCriteriaMethodsMap: {
        readonly [propertyName: string]: (filterCriteria: string) => SimpleTextFilter | DateFilter;
    };

    constructor() {
        this.setupSearchCaseCriteriaMethodsMap();
    }

    public buildSearchCaseCriteria(policyByProductProxyDTO: PolicyByProductProxyDTO): CompositeFilter {
        this._policyByProductProxyDTO = policyByProductProxyDTO;
        if (this._policyByProductProxyDTO) {
            const searchCaseCriteria = new CompositeFilter([]);
            Object.keys(this._policyByProductProxyDTO).forEach((searchCaseProperty: string) => {
                if (this.isFilterSelected(this._policyByProductProxyDTO[searchCaseProperty], searchCaseProperty)) {
                    const filterCreationHandler = this._searchCaseCriteriaMethodsMap[searchCaseProperty];
                    searchCaseCriteria.filters.push(filterCreationHandler(searchCaseProperty));
                }
            });
            return searchCaseCriteria;
        }
    }

    private setupSearchCaseCriteriaMethodsMap(): void {
        this._searchCaseCriteriaMethodsMap = {
            PolicyNumber: (filterCriteria: string) => this.getTextFilter('PolicyNumber', filterCriteria),
            InsuredLastName: (filterCriteria: string) => this.getTextFilter('InsuredLastName', filterCriteria),
            InsuredFirstName: (filterCriteria: string) => this.getTextFilter('InsuredFirstName', filterCriteria),
            InsuredTaxId: (filterCriteria: string) => this.getTextFilter('InsuredTaxId', filterCriteria),
            PlanCodeId: (filterCriteria: string) => this.getTextFilter('PlanCodeId', filterCriteria),
            AlternateCaseId: (filterCriteria: string) => this.getTextFilter('AlternateCaseId', filterCriteria),
            CaseGroupId: (filterCriteria: string) => this.getTextFilter('CaseGroupId', filterCriteria),
            ApplicantStatusShort: (filterCriteria: string) =>
                this.getTextFilter('ApplicantStatusShort', filterCriteria),
            InsuredBirthDate: (filterCriteria: string) => this.getDateFilter('InsuredBirthDate', filterCriteria),
            AddedDate: (filterCriteria: string) => this.getDateFilter('AddedDate', filterCriteria),
            ApplicantStatusDate: (filterCriteria: string) => this.getDateFilter('ApplicantStatusDate', filterCriteria),
            ReceiveDate: (filterCriteria: string) => this.getDateFilter('ReceiveDate', filterCriteria),
            ReopenDate: (filterCriteria: string) => this.getDateFilter('ReopenDate', filterCriteria),
            InsuredClientId: (filterCriteria: string) => this.getTextFilter('InsuredClientId', filterCriteria),
            CompanyCode: (filterCriteria: string) => this.getTextFilter('CompanyCode', filterCriteria),
            TeamId: (filterCriteria: string) => this.getTextFilter('TeamId', filterCriteria),
            UnderwriterId: (filterCriteria: string) => this.getTextFilter('UnderwriterId', filterCriteria),
            ServiceAssociateId: (filterCriteria: string) => this.getTextFilter('ServiceAssociateId', filterCriteria),
            ApplicationSourceType: (filterCriteria: string) =>
                this.getTextFilter('ApplicationSourceType', filterCriteria),
            CountryId: (filterCriteria: string) => this.getTextFilter('CountryId', filterCriteria),
            CountryStateId: (filterCriteria: string) => this.getTextFilter('CountryStateId', filterCriteria),
            MarketingCode: (filterCriteria: string) => this.getTextFilter('MarketingCode', filterCriteria),
            Priority: (filterCriteria: string) => this.getTextFilter('Priority', filterCriteria)
        };
    }

    private isFilterSelected(property: any, searchCaseProperty: string): boolean {
        return (
            property != undefined &&
            (property != '' || (property.maxDate != null || property.minDate != null)) &&
            searchCaseProperty !== '$type'
        );
    }

    private getDateFilter(filterField: string, filterCriteria: string): DateFilter {
        return new DateFilter(
            filterField,
            DateUtil.dateToString(this._policyByProductProxyDTO[filterCriteria].minDate),
            this.getMaxDate(filterCriteria)
        );
    }

    private getMaxDate(filterCriteria: string): string {
        return this._policyByProductProxyDTO[filterCriteria].maxDate
            ? DateUtil.dateToString(this._policyByProductProxyDTO[filterCriteria].maxDate)
            : DateUtil.dateToString(new Date());
    }

    private getTextFilter(filterField: string, filterCriteria: string): SimpleTextFilter {
        return new SimpleTextFilter(filterField, this._policyByProductProxyDTO[filterCriteria]);
    }
}
