import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, CellFormatters } from 'life-core/component/grid';
import { ListUtil } from 'life-core/util';
import { ListItem } from 'life-core/model';
import { I18n } from 'life-core/i18n';

import { GetYesNoStringPipe } from 'ls-core/util';

@Injectable()
export class BenefitGridColumnsBuilder extends BaseGridColumnsBuilder {
    public static benefitTypeList: Array<ListItem>;
    private _cellFormatters: CellFormatters;

    constructor(cellFormatters: CellFormatters, i18n: I18n) {
        super();
        this._cellFormatters = cellFormatters;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        let benefitGridFieldsIntlMap: { [benefitGridField: string]: string } = {
            [BenefitGridFields.BenefitName]: this.i18n({
                value: 'Benefit',
                id: 'policy.worksheet.coverage.benefit.benefitName'
            }),
            [BenefitGridFields.Amount]: this.i18n({
                value: 'Amount',
                id: 'policy.worksheet.coverage.benefit.amount'
            }),
            [BenefitGridFields.ReinsuranceFlag]: this.i18n({
                value: 'Reinsurance',
                id: 'policy.worksheet.coverage.benefit.reinsurance'
            }),
            [BenefitGridFields.CoverageStatusLabel]: this.i18n({
                value: 'Disposition',
                id: 'policy.worksheet.coverage.benefit.disposition'
            }),
            [BenefitGridFields.ReasonText]: this.i18n({
                value: 'Disposition Reason',
                id: 'policy.worksheet.coverage.benefit.dispositionReason'
            }),
            [BenefitGridFields.PermTableRating]: this.i18n({
                value: 'Table Rating',
                id: 'policy.worksheet.coverage.benefit.tableRating'
            }),
            [BenefitGridFields.PermTableReason]: this.i18n({
                value: 'Reason',
                id: 'policy.worksheet.coverage.benefit.tableRatingReason'
            }),
            [BenefitGridFields.PermFlatExtraAmount]: this.i18n({
                value: 'Perm. Flat Extra',
                id: 'policy.worksheet.coverage.benefit.permFlatExtra'
            }),
            [BenefitGridFields.TempFlatExtraAmount]: this.i18n({
                value: 'Temp. Flat Extra',
                id: 'policy.worksheet.coverage.benefit.tempFlatExtra'
            }),

            [BenefitGridFields.TempFlatExtraPeriod]: this.i18n({
                value: 'Temp. Flat Extra Duration',
                id: 'policy.worksheet.coverage.benefit.tempFlatExtraDuration'
            })
        };
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.BenefitName],
            field: BenefitGridFields.BenefitName,
            width: 90,
            valueFormatter: this.getBenefitName,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.BenefitName]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.Amount],
            field: BenefitGridFields.Amount,
            valueFormatter: this._cellFormatters.currencyCellFormatter,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.Amount]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.ReinsuranceFlag],
            field: BenefitGridFields.ReinsuranceFlag,
            width: 90,
            valueFormatter: this.getYesNoString,
            autoHeight: true,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.ReinsuranceFlag]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.CoverageStatusLabel],
            field: BenefitGridFields.CoverageStatusLabel,
            width: 90,
            valueFormatter: this.getDispositionLabel,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.CoverageStatusLabel]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.ReasonText],
            field: BenefitGridFields.ReasonText,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.ReasonText]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.PermTableRating],
            field: BenefitGridFields.PermTableRating,
            width: 90,
            valueFormatter: this.getTableRatings,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.PermTableRating]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.PermTableReason],
            field: BenefitGridFields.PermTableReason,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.PermTableReason]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.PermFlatExtraAmount],
            field: BenefitGridFields.PermFlatExtraAmount,
            valueFormatter: this._cellFormatters.currencyCellFormatter,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.PermFlatExtraAmount]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.TempFlatExtraAmount],
            field: BenefitGridFields.TempFlatExtraAmount,
            valueFormatter: this._cellFormatters.currencyCellFormatter,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.TempFlatExtraAmount]
        });
        this.addColumn({
            headerName: benefitGridFieldsIntlMap[BenefitGridFields.TempFlatExtraPeriod],
            field: BenefitGridFields.TempFlatExtraPeriod,
            width: 90,
            headerTooltip: benefitGridFieldsIntlMap[BenefitGridFields.TempFlatExtraPeriod]
        });
        return this.columns;
    }

    private getYesNoString(params: any): string {
        return new GetYesNoStringPipe().transform(params.node.data.ReinsuranceFlag);
    }

    private getBenefitName(params: any): string {
        if (params.node.data.BenefitId) {
            return ListUtil.getLabelByValue(
                params.context.listData.benefit_type,
                params.node.data.BenefitId.toString()
            );
        }
        return '';
    }

    private getDispositionLabel(params: any): string {
        if (params.node.data.CoverageStatus) {
            const coverageStatusDropdownList: ListItem[] = ListUtil.convertToListItems(
                params.context.listData.CoverageStatus
            );
            return ListUtil.getLabelByValue(coverageStatusDropdownList, params.node.data.CoverageStatus);
        }
        return '';
    }

    private getTableRatings(params: any): string {
        if (params.node.data.PermTableRating) {
            const tableRatingList: ListItem[] = ListUtil.convertToListItems(params.context.listData.PermTableRating);
            return ListUtil.getLabelByValue(tableRatingList, params.node.data.PermTableRating);
        }
    }
}

export const BenefitGridFields = {
    BenefitName: 'BenefitName',
    Amount: 'Amount',
    ReinsuranceFlag: 'ReinsuranceFlag',
    CoverageStatusLabel: 'CoverageStatusLabel',
    ReasonText: 'ReasonText',
    PermTableRating: 'PermTableRating',
    PermTableReason: 'PermTableReason',
    PermFlatExtraAmount: 'PermFlatExtraAmount',
    TempFlatExtraAmount: 'TempFlatExtraAmount',
    TempFlatExtraPeriod: 'TempFlatExtraPeriod'
};
