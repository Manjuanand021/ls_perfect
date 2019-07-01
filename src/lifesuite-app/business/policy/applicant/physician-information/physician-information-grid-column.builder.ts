import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { NamePattern, DateFormatter } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { ListDataItem } from 'ls-core/service';
import { LsPhoneNumberPipe, GetYesNoStringPipe, AddressUtil } from 'ls-core/util';
import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { AddressTypes, PhoneTypes, CountryCodes, MetadataItem } from 'ls-core/model';

@Injectable()
export class PhysicianInformationGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;
    private _dateFormatter: DateFormatter;
    constructor(
        lsCellFormatters: LsCellFormatters,
        lsCellComparators: LsCellComparators,
        dateFormatter: DateFormatter,
        i18n: I18n
    ) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this._dateFormatter = dateFormatter;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        let physicianInfoGridFieldsIntlMap: { [physicianInfoGridField: string]: string } = {
            [PhysicianInformationFields.FullName]: this.i18n({
                value: 'Name',
                id: 'policy.applicant.physicianInfo.name'
            }),
            [PhysicianInformationFields.IsPrimaryPhysician]: this.i18n({
                value: 'Primary',
                id: 'policy.applicant.physicianInfo.primary'
            }),
            [PhysicianInformationFields.IsPrimaryPhysician]: this.i18n({
                value: 'Address',
                id: 'policy.applicant.physicianInfo.address'
            }),
            [PhysicianInformationFields.IsPrimaryPhysician]: this.i18n({
                value: 'Phone',
                id: 'policy.applicant.physicianInfo.phone'
            }),
            [PhysicianInformationFields.Treatments]: this.i18n({
                value: 'Treatments',
                id: 'policy.applicant.physicianInfo.treatment'
            }),
            [PhysicianInformationFields.StillUnderTreatmentFlag]: this.i18n({
                value: 'Ongoing Treatments',
                id: 'policy.applicant.physicianInfo.ongoingtreatments'
            }),
            [PhysicianInformationFields.LastVisitDate]: this.i18n({
                value: 'Last Visit Date',
                id: 'policy.applicant.physicianInfo.lastvisitdate'
            }),
            [PhysicianInformationFields.VisitReason]: this.i18n({
                value: 'Last Visit Reason',
                id: 'policy.applicant.physicianInfo.lastvisitreason'
            }),
            [PhysicianInformationFields.Findings]: this.i18n({
                value: 'Findings',
                id: 'policy.applicant.physicianInfo.finddings'
            })
        };

        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.FullName],
            field: PhysicianInformationFields.FullName,
            width: 100,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.LastFirstAndMiddleInitial),
            autoHeight: true,
            tooltipField: PhysicianInformationFields.FullName,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.FullName]
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.IsPrimaryPhysician],
            field: PhysicianInformationFields.IsPrimaryPhysician,
            width: 100,
            valueFormatter: this.getYesNoString
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.FullAddress],
            field: PhysicianInformationFields.FullAddress,
            width: 200,
            valueFormatter: params => this.getFullAddress(params),
            autoHeight: true,
            tooltipField: PhysicianInformationFields.FullAddress
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.Phone],
            field: PhysicianInformationFields.Phone,
            width: 100,
            valueFormatter: this.formatPhone
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.Treatments],
            field: PhysicianInformationFields.Treatments,
            width: 100,
            autoHeight: true,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.Treatments]
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.StillUnderTreatmentFlag],
            field: PhysicianInformationFields.StillUnderTreatmentFlag,
            width: 150,
            valueFormatter: this.getYesNoString,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.StillUnderTreatmentFlag]
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.LastVisitDate],
            field: PhysicianInformationFields.LastVisitDate,
            width: 100,
            comparator: this._lsCellComparators.datetimeComparator,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.LastVisitDate],
            valueFormatter: params => this._dateFormatter.format(params.value)
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.VisitReason],
            field: PhysicianInformationFields.VisitReason,
            width: 100,
            autoHeight: true,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.VisitReason]
        });
        this.addColumn({
            headerName: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.Findings],
            field: PhysicianInformationFields.Findings,
            width: 100,
            autoHeight: true,
            headerTooltip: physicianInfoGridFieldsIntlMap[PhysicianInformationFields.Findings]
        });
        return this.columns;
    }

    private formatPhone(params: any): string {
        if (params.node.data.Phones_LazyLoad.length) {
            const businessPhone = params.node.data.Phones_LazyLoad.find(
                phone => phone.PhoneTypeCode == PhoneTypes.BUSINESS
            );
            if (businessPhone) {
                return new LsPhoneNumberPipe().transform(businessPhone);
            }
        }
        return '';
    }

    private getFullAddress(params: any): string {
        if (params.data.Addresses_LazyLoad && params.data.Addresses_LazyLoad.length > 0) {
            const businessAddress = AddressUtil.getAddress(params.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
            if (businessAddress.CountryId) {
                const stateName = this.getStateName(
                    businessAddress.CountryStateId,
                    params.context.listData[CountryCodes[businessAddress.CountryId]]
                );

                const countryName = this.getCountryName(
                    businessAddress.CountryId,
                    params.context.listData.SignedCountryId
                );
                return AddressUtil.getFullAddress(businessAddress, stateName, countryName);
            }
        }
        return '';
    }

    private getStateName(stateId: string, stateList: Array<MetadataItem>): string {
        return stateId ? stateList.find(state => state.value === stateId).label : '';
    }

    private getCountryName(countryId: string, countryList: Array<ListDataItem>): string {
        return countryId ? countryList.find(country => country.Id === countryId).value : '';
    }

    private getYesNoString(params: any): string {
        if (params) {
            return new GetYesNoStringPipe().transform(params.value);
        }
        return '';
    }
}

export const PhysicianInformationFields = {
    FullName: 'FullName',
    IsPrimaryPhysician: 'IsPrimaryPhysician',
    FullAddress: 'FullAddress',
    Phone: 'Phone',
    Treatments: 'Field1',
    StillUnderTreatmentFlag: 'Field2',
    LastVisitDate: 'Field5',
    VisitReason: 'Field4',
    Findings: 'Field3'
};
