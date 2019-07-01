import { Component, Injector } from '@angular/core';
import { LabDTO, LabResultDTO, LabCommentDTO, CustomerLabReportProxyModel } from 'ls-core/model';
import { DetailViewModel } from 'life-core/component/master-detail';
import { ValueUtil } from 'life-core/util/lang';

@Component({
    selector: 'lab-detail',
    templateUrl: './lab-detail.component.html'
})
export class LabDetailComponent extends DetailViewModel<LabDTO> {
    public labName: string;

    public insuranceType: string = '';

    public labResultData: LabResultDTO[];

    public labCommentData: LabCommentDTO[];

    public customerLabReportData: Array<CustomerLabReportProxyModel>;

    public lastFoodDateTime: string;

    public dateTimeCollected: string;

    constructor(injector: Injector) {
        super(injector);
    }

    private get labDetail(): LabDTO {
        return this.data;
    }

    public setModel(model: any): void {
        this.setContext(model);
    }

    private setContext(context: LabDTO): void {
        this.data = context;
        this.setInsuranceType();
        this.setLabData();
    }

    private setLabData(): void {
        this.lastFoodDateTime = this.concatValues(this.data.LastFood, this.data.LastFoodTime);
        this.dateTimeCollected = this.concatValues(this.data.TestDate.dateAsString, this.data.TimeCollected);
    }

    private concatValues(value1: any, value2: any): string {
        return ValueUtil.getValueOrEmptyString(value1).concat(' ', ValueUtil.getValueOrEmptyString(value2));
    }

    private setInsuranceType(): void {
        if (this.labDetail) {
            if (this.labDetail.InsTypeLife === 'L') {
                this.insuranceType = 'Life';
            } else if (this.labDetail.InsTypeHealth === 'H') {
                this.insuranceType = 'Health';
            } else if (this.labDetail.InsTypeDisability === 'D') {
                this.insuranceType = 'Disability';
            }

            // appending group or individual
            if (this.labDetail.InsTypeGroup === 'G') {
                this.insuranceType += ' Group';
            } else if (this.labDetail.InsTypeIndividual === 'I') {
                this.insuranceType += ' Individual';
            }
        }
    }
}
