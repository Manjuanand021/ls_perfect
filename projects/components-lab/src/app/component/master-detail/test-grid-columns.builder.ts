import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { ListUtil } from 'life-core/util';
import { Countries } from './test-data';

@Injectable()
export class TestGridColumnsBuilder extends BaseGridColumnsBuilder {
    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: 'Country',
            field: 'country',
            width: 100,
            minWidth: 100,
            valueFormatter: function(params) {
                if (params.value == null) return '';
                return ListUtil.getLabelByValue(Countries, params.value);
            }
        });
        this.addColumn({
            headerName: 'Downloads',
            field: 'downloads',
            width: 100,
            minWidth: 100,
            cellClass: 'align-right',
            valueFormatter: function(params) {
                if (params.value == null || params.value == '') return params.value;
                return Number(params.value).toLocaleString();
            }
        });
        this.addColumn({
            headerName: 'Sales',
            field: 'sales',
            width: 150,
            minWidth: 100,
            cellClass: 'align-right',
            valueFormatter: function(params) {
                if (params.value == null || params.value == '') return params.value;
                return `$${Number(params.value).toLocaleString()}`;
            }
        });
        this.addColumn({
            headerName: 'Date',
            field: 'date',
            width: 150,
            minWidth: 100,
            valueFormatter: function(params) {
                if (params.value) return params.value.toLocaleDateString();
                return '';
            }
        });
        return this.columns;
    }
}
