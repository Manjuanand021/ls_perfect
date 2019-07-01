import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { MetadataItem } from 'ls-core/model';
import { RxReportUtil } from '../rx-report-util';
import { I18n } from 'life-core/i18n';

@Injectable()
export class RxDetailGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _rxReportUtil: RxReportUtil;

    constructor(i18n: I18n, rxReportUtil: RxReportUtil) {
        super();
        this.i18n = i18n;
        this._rxReportUtil = rxReportUtil;
    }

    public build(rxReport: MetadataItem[]): DataGridColumns {
        const columnLabelForTherapeutic = this._rxReportUtil.getLabelForRxDetailGridColumn(rxReport, true);
        const columnLabelForIndications = this._rxReportUtil.getLabelForRxDetailGridColumn(rxReport, false);

        this.addColumn({
            headerName: this.i18n({ value: 'Drug Name', id: 'policy.rx.detail.effects.gridheader.drugname' }),
            field: RxDetailFields.DrugName,
            width: 60,
            tooltipField: RxDetailFields.DrugName
        });
        this.addColumn({
            headerName: columnLabelForTherapeutic,
            field: RxDetailFields.Therapeutic,
            width: 60
        });
        this.addColumn({
            headerName: columnLabelForIndications,
            field: RxDetailFields.Indications,
            width: 100,
            tooltipField: RxDetailFields.Indications
        });
        return this.columns;
    }
}

const RxDetailFields = {
    DrugName: 'DrugName', //
    Therapeutic: 'Therapeutic', // 'policy.rx.detail.effects.gridheader.therapeutic'
    Indications: 'Indications' // 'policy.rx.detail.effects.gridheader.indications'
};
