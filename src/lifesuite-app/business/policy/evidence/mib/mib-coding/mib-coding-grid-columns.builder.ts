import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { MetadataUtil } from 'ls-core/util';
import { MIBCodingDTO } from 'ls-core/model';

import { MIBCodingValidationResultIconHelper } from './mib-coding-validation-result-icon.helper';
import { I18n } from 'life-core/i18n';

const MIBCodingGridFields = {
    MibCodes: 'MibCodes',
    AddedBy: 'AddedBy',
    DateAdded: 'DateAdded',
    MibValidationResult: 'MibValidationResult',
    MibTranslationResult: 'MibTranslationResult'
};

@Injectable()
export class MIBCodingGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(isMIBEVTEnabled: boolean): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'MIB Code', id: 'policy.mib.submitted.codes.gridheader.mibcode' }),
            field: MIBCodingGridFields.MibCodes,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Valid', id: 'policy.mib.submitted.codes.gridheader.valid' }),
            field: MIBCodingGridFields.MibValidationResult,
            cellRenderer: this.getIcon,
            width: 60,
            hide: !isMIBEVTEnabled,
            onCellClicked: (params: any) => this.onValidIconClick(params)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Message', id: 'policy.mib.submitted.codes.gridheader.message' }),
            field: MIBCodingGridFields.MibTranslationResult,
            width: 300,
            hide: !isMIBEVTEnabled,
            autoHeight: true,
            tooltipField: MIBCodingGridFields.MibTranslationResult
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created By', id: 'policy.mib.submitted.codes.gridheader.createdby' }),
            field: MIBCodingGridFields.AddedBy,
            width: 170,
            valueFormatter: this.getUserName
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.mib.submitted.codes.gridheader.createdon' }),
            field: MIBCodingGridFields.DateAdded,
            width: 100,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        return this.columns;
    }

    private getIcon(params: any): string {
        return MIBCodingValidationResultIconHelper.getIcon(params.data.MibValidationResult);
    }

    private getUserName(params: any): string {
        if (params.data.AddedBy) {
            return MetadataUtil.getItemLabelByCode(params.context.listData.aus_users, params.data.AddedBy);
        }
        return '';
    }

    private onValidIconClick(params: any): void {
        if (params.data) {
            const mibCode: MIBCodingDTO = params.data;
            params.context.onValidateIconClick(mibCode);
        }
    }
}
