import { MetadataUtil } from 'ls-core/util';
import { MetadataItem } from 'ls-core/model';
import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

const rxLabels = {
    DISPLAY_COLUMN2: 'DisplayCol2',
    DISPLAY_COLUMN3: 'DisplayCol3',
    COLUMN2_NAME_THERAPEUTIC: 'Therapeutic',
    COLUMN2_NAME_NATIONAL_DRUG_CODE: 'National Drug Code',
    COLUMN3_NAME_PRESCRIPTION_SIDE_EFFECTS: 'Prescription Side Effects',
    COLUMN3_NAME_INDICATIONS: 'Indications',
    RX_PROVIDER_MILLIMAN: 'Milliman'
};
@Injectable()
export class RxReportUtil {
    private i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public constructMetadatItemValue(list: MetadataItem[], column: string, providerName: string): string {
        const tempColumn = `${column}${providerName}`;
        return this.getReportProvider(list, tempColumn);
    }

    public checkIfDefaultProvider(list: MetadataItem[], value: string = 'Report Provider'): boolean {
        const reportProvider = this.getReportProvider(list, value);
        return reportProvider.toUpperCase() === rxLabels.RX_PROVIDER_MILLIMAN.toUpperCase() ? false : true;
    }

    public getReportProvider(list: MetadataItem[], value: string = 'Report Provider'): string {
        const reportProvider = MetadataUtil.getLabelByValue(list, value);
        return reportProvider.toUpperCase();
    }

    public getLabelForRxDetailGridColumn(list: MetadataItem[], isTherapeutic: boolean): string {
        const reportProvider = this.getReportProvider(list);
        if (isTherapeutic) {
            return this.constructMetadatItemValue(list, rxLabels.DISPLAY_COLUMN2, reportProvider) ===
                rxLabels.COLUMN2_NAME_THERAPEUTIC.toUpperCase()
                ? this.i18n({
                      value: 'Therapeutic',
                      id: 'policy.rx.detail.effects.gridheader.therapeutic'
                  })
                : this.i18n({
                      value: 'National Drug Code',
                      id: 'policy.rx.detail.effects.gridheader.nationaldrugcode'
                  });
        } else {
            return this.constructMetadatItemValue(list, rxLabels.DISPLAY_COLUMN3, reportProvider) ===
                rxLabels.COLUMN3_NAME_PRESCRIPTION_SIDE_EFFECTS.toUpperCase()
                ? this.i18n({
                      value: 'Prescription Side Effects',
                      id: 'policy.rx.detail.effects.gridheader.sideeffects'
                  })
                : this.i18n({
                      value: 'Indications',
                      id: 'policy.rx.detail.effects.gridheader.indications'
                  });
        }
    }
}
