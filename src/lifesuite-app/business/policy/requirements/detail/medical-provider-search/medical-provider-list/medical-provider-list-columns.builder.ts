import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { ProviderSearchTypes } from 'ls-core/model';
import { I18n } from 'life-core/i18n';

const MedicalProviderGridFields = {
    LastName: 'LastName',
    MiddleName: 'MiddleName',
    FirstName: 'FirstName',
    Company: 'Company',
    AddressLine1: 'AddressLine1',
    AddressCity: 'AddressCity',
    AddressState: 'AddressState',
    Zip: 'Zip',
    Phone: 'Phone',
    GovtID: 'GovtID'
};

@Injectable()
export class MedicalProviderListColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(searchType: string): DataGridColumns {
        this.resetColumns();
        this.getMedicalProviderListGridColumns(searchType);
        return this.columns;
    }

    private getMedicalProviderListGridColumns(searchType: string): void {
        const filterButtonParams: any = { applyButton: true, clearButton: true };
        const isFacilitySearchCriteria = searchType === ProviderSearchTypes.FACILITY_NAME;

        if (!isFacilitySearchCriteria) {
            this.addColumn({
                headerName: this.i18n({ value: 'Last Name', id: 'policy.requirement.providersearch.lastname' }),
                filter: 'text',
                field: MedicalProviderGridFields.LastName,
                filterParams: filterButtonParams
            });
            this.addColumn({
                headerName: this.i18n({ value: 'Middle Name', id: 'policy.requirement.providersearch.middlename' }),
                filter: 'text',
                field: MedicalProviderGridFields.MiddleName,
                filterParams: filterButtonParams
            });
            this.addColumn({
                headerName: this.i18n({ value: 'First Name', id: 'policy.requirement.providersearch.firstname' }),
                filter: 'text',
                field: MedicalProviderGridFields.FirstName,
                filterParams: filterButtonParams
            });
        }
        this.addColumn({
            headerName: this.i18n({ value: 'Organization', id: 'policy.requirement.providersearch.company' }),
            filter: 'text',
            field: MedicalProviderGridFields.Company,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Address', id: 'policy.requirement.providersearch.address' }),
            filter: 'text',
            field: MedicalProviderGridFields.AddressLine1,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({ value: 'City', id: 'policy.requirement.providersearch.city' }),
            filter: 'text',
            field: MedicalProviderGridFields.AddressCity,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({ value: 'State', id: 'policy.requirement.providersearch.state' }),
            filter: 'text',
            field: MedicalProviderGridFields.AddressState,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Zip', id: 'policy.requirement.providersearch.zip' }),
            filter: 'text',
            field: MedicalProviderGridFields.Zip,
            filterParams: filterButtonParams
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Phone', id: 'policy.requirement.providersearch.phone' }),
            filter: 'text',
            field: MedicalProviderGridFields.Phone,
            filterParams: filterButtonParams
        });
        if (!isFacilitySearchCriteria) {
            this.addColumn({
                headerName: this.i18n({ value: 'NPI', id: 'policy.requirement.providersearch.npi' }),
                filter: 'text',
                field: MedicalProviderGridFields.GovtID,
                filterParams: filterButtonParams
            });
        }
    }
}
