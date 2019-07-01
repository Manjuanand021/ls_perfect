import { Injectable } from '@angular/core';
import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { PhoneUtil, LsPhoneNumberPipe } from 'ls-core/util';
import { PhoneTypes, MetadataItem } from 'ls-core/model';
import { RxReportUtil } from '../rx-report-util';
import { I18n } from 'life-core/i18n';

@Injectable()
export class PhysicianGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _rxReportUtil: RxReportUtil;

    constructor(i18n: I18n, rxReportUtil: RxReportUtil) {
        super();
        this.i18n = i18n;
        this._rxReportUtil = rxReportUtil;
    }

    public build(rxReport: MetadataItem[]): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Name', id: 'policy.rx.detail.physicians.gridheader.name' }),
            field: PhysicianDetailFields.PhyscianName,
            tooltipField: PhysicianDetailFields.PhyscianName,
            width: 60
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Address', id: 'policy.rx.detail.physicians.gridheader.address' }),
            field: PhysicianDetailFields.PhyscianAddress,
            width: 60,
            tooltipField: PhysicianDetailFields.PhyscianAddress
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Pharmacy Id', id: 'policy.rx.detail.physicians.gridheader.pharmacyid' }),
            field: PhysicianDetailFields.PharmacyId,
            width: 100,
            hide: this._rxReportUtil.checkIfDefaultProvider(rxReport)
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Phone', id: 'policy.rx.detail.physicians.gridheader.phone' }),
            field: PhysicianDetailFields.PhyscianPhone,
            valueFormatter: this.formatPhone,
            width: 100
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Speciality', id: 'policy.rx.detail.physicians.gridheader.speciality' }),
            field: PhysicianDetailFields.PhyscianSpecialty,
            width: 100
        });
        return this.columns;
    }

    private formatPhone(params: any): string {
        if (params.value) {
            return new LsPhoneNumberPipe().transform(
                PhoneUtil.convertPhoneStringToObject(params.value, PhoneTypes.WORK)
            );
        }
        return '';
    }
}

const PhysicianDetailFields = {
    PhyscianName: 'PhyscianName',
    PhyscianAddress: 'PhyscianAddress',
    PharmacyId: 'PharmacyId',
    PhyscianPhone: 'PhyscianPhone',
    PhyscianSpecialty: 'PhyscianSpecialty'
};
