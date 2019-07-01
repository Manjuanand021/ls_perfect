import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

@Injectable()
export class FundsListGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'applicant.coverage.funds.name' }),
            field: FundsList.Name,
            width: 50,
            valueFormatter: this.getFundValueByCode
        });
        this.addColumn({
            headerName: this.i18n({ value: '%Allocation', id: 'applicant.coverage.funds.allocation' }),
            field: FundsList.Allocation,
            width: 50
        });
        return this.columns;
    }

    private getFundValueByCode(params: any): string {
        if (params.node.data.FundCode) {
            const fund = params.context.listData.FundCode.find(item => item.Id === params.node.data.FundCode);
            return fund.value;
        }
        return '';
    }
}

const FundsList = {
    Name: 'FundCode',
    Allocation: 'PercentAllocation'
};
