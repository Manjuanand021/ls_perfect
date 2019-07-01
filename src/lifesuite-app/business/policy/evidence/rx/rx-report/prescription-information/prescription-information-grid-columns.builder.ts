import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { MetadataItem } from 'ls-core/model';

import { RxReportUtil } from '../rx-report-util';

@Injectable()
export class PrescriptionInformationGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;
    private _rxReportUtil: RxReportUtil;

    constructor(
        lsCellFormatters: LsCellFormatters,
        lsCellComparators: LsCellComparators,
        i18n: I18n,
        rxReportUtil: RxReportUtil
    ) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
        this._rxReportUtil = rxReportUtil;
    }

    public build(rxReport: MetadataItem[]): DataGridColumns {
        const isDefaultProvider = this._rxReportUtil.checkIfDefaultProvider(rxReport);

        let prescriptionGridFieldsIntlMap: { [prescriptionGridField: string]: string } = {
            [PrescriptionInformationDetailFields.DrugName]: this.i18n({
                value: 'Rx and Dosage',
                id: 'policy.rx.detail.prescriptions.gridheader.rx'
            }),
            [PrescriptionInformationDetailFields.DrugPriority]: this.i18n({
                value: 'Drug Priority',
                id: 'policy.rx.detail.prescriptions.gridheader.drugpriority'
            }),
            [PrescriptionInformationDetailFields.DrugWeight]: this.i18n({
                value: 'Drug Weight',
                id: 'policy.rx.detail.prescriptions.gridheader.drugweight'
            }),
            [PrescriptionInformationDetailFields.NbrFillsDrugName]: this.i18n({
                value: '# Fills',
                id: 'policy.rx.detail.prescriptions.gridheader.NbrFillsDrugName'
            }),
            [PrescriptionInformationDetailFields.PhyscianName]: this.i18n({
                value: 'Physician Name',
                id: 'policy.rx.detail.prescriptions.gridheader.physicianname'
            }),
            [PrescriptionInformationDetailFields.FillDate]: this.i18n({
                value: 'Prescription Fill Date',
                id: 'policy.rx.detail.prescriptions.gridheader.date'
            }),
            [PrescriptionInformationDetailFields.Quantity]: this.i18n({
                value: 'Quantity',
                id: 'policy.rx.detail.prescriptions.gridheader.quantity'
            }),
            [PrescriptionInformationDetailFields.TotalRefillsAllowed]: this.i18n({
                value: 'Total Refills Allowed',
                id: 'policy.rx.detail.prescriptions.gridheader.refills'
            }),
            [PrescriptionInformationDetailFields.DaysSupply]: this.i18n({
                value: 'Number of Days',
                id: 'policy.rx.detail.prescriptions.gridheader.days'
            })
        };
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugName],
            field: PrescriptionInformationDetailFields.DrugName,
            width: 60,
            tooltipField: PrescriptionInformationDetailFields.DrugName,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugName]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugPriority],
            field: PrescriptionInformationDetailFields.DrugPriority,
            width: 60,
            hide: isDefaultProvider,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugPriority]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugWeight],
            field: PrescriptionInformationDetailFields.DrugWeight,
            width: 60,
            hide: isDefaultProvider,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DrugWeight]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.NbrFillsDrugName],
            field: PrescriptionInformationDetailFields.NbrFillsDrugName,
            width: 60,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.NbrFillsDrugName]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.PhyscianName],
            field: PrescriptionInformationDetailFields.PhyscianName,
            width: 100,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.PhyscianName]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.FillDate],
            field: PrescriptionInformationDetailFields.FillDate,
            width: 100,
            valueFormatter: (params): any => this._lsCellFormatters.dateCellFormatter(params, 'short'),
            comparator: this._lsCellComparators.datetimeComparator,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.FillDate]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.Quantity],
            field: PrescriptionInformationDetailFields.Quantity,
            width: 60,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.Quantity]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.TotalRefillsAllowed],
            field: PrescriptionInformationDetailFields.TotalRefillsAllowed,
            width: 60,
            hide: !isDefaultProvider,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.TotalRefillsAllowed]
        });
        this.addColumn({
            headerName: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DaysSupply],
            field: PrescriptionInformationDetailFields.DaysSupply,
            width: 100,
            headerTooltip: prescriptionGridFieldsIntlMap[PrescriptionInformationDetailFields.DaysSupply]
        });
        return this.columns;
    }
}

const PrescriptionInformationDetailFields = {
    DrugName: 'DrugName',
    DrugPriority: 'DrugPriority',
    DrugWeight: 'DrugWeight',
    NbrFillsDrugName: 'NbrFillsDrugName',
    PhyscianName: 'PhyscianName',
    FillDate: 'FillDate',
    Quantity: 'Quantity',
    TotalRefillsAllowed: 'TotalRefillsAllowed',
    DaysSupply: 'DaysSupply'
};
