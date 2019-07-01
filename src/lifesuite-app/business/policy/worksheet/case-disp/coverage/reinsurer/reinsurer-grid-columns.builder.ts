import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { ListDataUtil } from 'ls-core/service/list-data';
import { GetYesNoStringPipe } from 'ls-core/util';
import { I18n } from 'life-core/i18n';

const ReinsurerGridFields = {
    CompanyCode: 'CompanyCode',
    TreatyType: 'TreatyType',
    CessionNumber: 'CessionNumber',
    ReinsuranceType: 'ReinsuranceType',
    RetentionAmount: 'RetentionAmount',
    ReinsuranceAmount: 'ReinsuranceAmount',
    AdbReinsuredAmount: 'AdbReinsuredAmount',
    Placed: 'Placed',
    ReinsurerRateClass: 'ReinsurerRateClass',
    ReinsurerTableRating: 'ReinsurerTableRating'
};

@Injectable()
export class ReinsurerGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        let reinsurerGridFieldsIntlMap: { [reinsurerGridField: string]: string } = {
            [ReinsurerGridFields.CompanyCode]: this.i18n({
                value: 'Reinsurer',
                id: 'policy.worksheet.coverage.reinsurer.reinsurer'
            }),

            [ReinsurerGridFields.TreatyType]: this.i18n({
                value: 'Treaty Type',
                id: 'policy.worksheet.coverage.reinsurer.treatytype'
            }),
            [ReinsurerGridFields.CessionNumber]: this.i18n({
                value: 'Cession',
                id: 'policy.worksheet.coverage.reinsurer.cessionnumber'
            }),
            [ReinsurerGridFields.ReinsuranceType]: this.i18n({
                value: 'Reinsurance Type',
                id: 'policy.worksheet.coverage.reinsurer.reinsurancetype'
            }),
            [ReinsurerGridFields.RetentionAmount]: this.i18n({
                value: 'Retention Amount',
                id: 'policy.worksheet.coverage.reinsurer.retentionamount'
            }),
            [ReinsurerGridFields.ReinsuranceAmount]: this.i18n({
                value: 'Reinsurance Amount',
                id: 'policy.worksheet.coverage.reinsurer.reinsuranceamount'
            }),
            [ReinsurerGridFields.AdbReinsuredAmount]: this.i18n({
                value: 'ADB Reinsurance Amount',
                id: 'policy.worksheet.coverage.adbreinsuredamount.reinsurer'
            }),
            [ReinsurerGridFields.Placed]: this.i18n({
                value: 'Placed?',
                id: 'policy.worksheet.coverage.reinsurer.placed'
            }),

            [ReinsurerGridFields.ReinsurerRateClass]: this.i18n({
                value: 'Reinsurer Risk Class',
                id: 'policy.worksheet.coverage.reinsurerrateclass.reinsurer'
            }),
            [ReinsurerGridFields.ReinsurerTableRating]: this.i18n({
                value: 'Reinsurer Table Rating',
                id: 'policy.worksheet.coverage.reinsurer.reinsurertablerating'
            })
        };
        let reinsurerGridFieldsValueFormatterIntlMap: { [reinsurerGridField: string]: (params: any) => string } = {
            [ReinsurerGridFields.CompanyCode]: this.getReinsurer,
            [ReinsurerGridFields.TreatyType]: this.getTreatyType,
            [ReinsurerGridFields.RetentionAmount]: params => this.getAmount(params),
            [ReinsurerGridFields.ReinsuranceAmount]: params => this.getAmount(params),
            [ReinsurerGridFields.AdbReinsuredAmount]: params => this.getAmount(params),
            [ReinsurerGridFields.Placed]: this.getYesNoString,
            [ReinsurerGridFields.ReinsurerRateClass]: this.getReinsurerRateClass,
            [ReinsurerGridFields.ReinsurerTableRating]: this.getReinsurerTableRating
        };
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.CompanyCode],
            field: ReinsurerGridFields.CompanyCode,
            width: 60,
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.CompanyCode],
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.CompanyCode],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.CompanyCode]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.TreatyType],
            field: ReinsurerGridFields.TreatyType,
            width: 60,
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.TreatyType],
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.TreatyType],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.TreatyType]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.CessionNumber],
            field: ReinsurerGridFields.CessionNumber,
            tooltipField: ReinsurerGridFields.CessionNumber,
            width: 50,
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.CessionNumber]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsuranceType],
            field: ReinsurerGridFields.ReinsuranceType,
            width: 100,
            tooltipField: ReinsurerGridFields.ReinsuranceType,
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsuranceType]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.RetentionAmount],
            field: ReinsurerGridFields.RetentionAmount,
            width: 100,
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.RetentionAmount],
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.RetentionAmount],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.RetentionAmount]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsuranceAmount],
            field: ReinsurerGridFields.ReinsuranceAmount,
            width: 100,
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsuranceAmount],
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsuranceAmount],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsuranceAmount]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.AdbReinsuredAmount],
            field: ReinsurerGridFields.AdbReinsuredAmount,
            width: 100,
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.AdbReinsuredAmount],
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.AdbReinsuredAmount],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.AdbReinsuredAmount]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.Placed],
            field: ReinsurerGridFields.Placed,
            width: 40,
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.Placed],
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.Placed],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.Placed]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsurerRateClass],
            field: ReinsurerGridFields.ReinsurerRateClass,
            width: 100,
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsurerRateClass],
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsurerRateClass],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsurerRateClass]
        });
        this.addColumn({
            headerName: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsurerTableRating],
            field: ReinsurerGridFields.ReinsurerTableRating,
            width: 120,
            valueFormatter: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsurerTableRating],
            tooltip: reinsurerGridFieldsValueFormatterIntlMap[ReinsurerGridFields.ReinsurerTableRating],
            headerTooltip: reinsurerGridFieldsIntlMap[ReinsurerGridFields.ReinsurerTableRating]
        });
        return this.columns;
    }

    private getReinsurer(params: any): string {
        return ListDataUtil.getValueFromListDataById(params.context.listData.Reinsurer, params.node.data.CompanyCode);
    }

    private getAmount(params: any): string {
        if (params.value == null) params.value = 0;
        return this._cellFormatters.currencyCellFormatter(params);
    }

    private getReinsurerRateClass(params: any): string {
        return ListDataUtil.getValueFromListDataById(
            params.context.listData.RateClassApproved,
            params.node.data.ReinsurerRateClass
        );
    }

    private getReinsurerTableRating(params: any): string {
        return ListDataUtil.getValueFromListDataById(
            params.context.listData.PermTableRating,
            params.node.data.ReinsurerTableRating
        );
    }

    private getTreatyType(params: any): string {
        return ListDataUtil.getLabelFromListDataById(
            params.context.listData.ReinsurerTreatyType,
            params.node.data.TreatyType
        );
    }

    private getYesNoString(params: any): string {
        return new GetYesNoStringPipe().transform(params.node.data.Placed);
    }
}
