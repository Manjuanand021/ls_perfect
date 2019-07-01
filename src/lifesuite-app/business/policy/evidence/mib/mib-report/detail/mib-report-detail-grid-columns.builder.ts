import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { NamePattern } from 'life-core/util';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { I18n } from 'life-core/i18n';

const MIBReportDetailGridFields = {
    Name: 'FirstName',
    BirthDate: 'BirthDate',
    HitsOrTry: 'ReplyType',
    Case: 'PolicyNumber',
    BirthPlace: 'PlaceOfBirth',
    InquiryDate: 'InquiryDate'
};

@Injectable()
export class MIBReportDetailGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'policy.mib.gridheader.name' }),
            field: MIBReportDetailGridFields.Name,
            width: 100,
            valueFormatter: (params: any) =>
                this._lsCellFormatters.nameCellFormatter(params, NamePattern.FirstAndLastName)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Birth Date', id: 'policy.mib.gridheader.birthdate' }),
            field: MIBReportDetailGridFields.BirthDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Hit or Try', id: 'policy.mib.gridheader.hitortry' }),
            field: MIBReportDetailGridFields.HitsOrTry,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case', id: 'policy.mib.gridheader.case' }),
            field: MIBReportDetailGridFields.Case,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Birth Place', id: 'policy.mib.gridheader.birthplace' }),
            field: MIBReportDetailGridFields.BirthPlace,
            width: 200
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Inquiry Date', id: 'policy.mib.gridheader.inquirydate' }),
            field: MIBReportDetailGridFields.InquiryDate,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        return this.columns;
    }
}
