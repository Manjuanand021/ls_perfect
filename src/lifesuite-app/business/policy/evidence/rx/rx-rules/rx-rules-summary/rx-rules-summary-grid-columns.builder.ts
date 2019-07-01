import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class RxRulesSummaryColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Rate Class', id: 'policy.rx.rules.gridheader.rateclass' }),
            field: RxRulesSummaryFields.RulesIndex,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Decision', id: 'policy.rx.rules.gridheader.decision' }),
            field: RxRulesSummaryFields.RulesLevel,
            width: 70
        });

        return this.columns;
    }
}

export const RxRulesSummaryFields = {
    RulesIndex: 'RulesIndex',
    RulesLevel: 'RulesLevel'
};
