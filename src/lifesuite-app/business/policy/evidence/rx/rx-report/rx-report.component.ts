import { Component, Injector } from '@angular/core';

import { TertiaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { NameUtil } from 'life-core/util';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, InsuredDTO, RXReportProxy } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { ApplicantListHelper } from 'business/policy/shared';
import { RxReportPolicyDataModel } from 'business/policy/shared/data-model';
import { RxReportUtil } from './rx-report-util';
import { ArrayUtil } from 'life-core/util/lang';

@Component({
    selector: 'rx-report',
    templateUrl: './rx-report.component.html',
    providers: [PolicySubscriber]
})
export class RxReportComponent extends TertiaryTabHostViewModel<RxReportPolicyDataModel> {
    public applicant: InsuredDTO;
    public firstRxReportItem: RXReportProxy;
    public fullName: string;
    public prescriptionData: RXReportProxy[] = [];
    public physicianData: RXReportProxy[] = [];
    public isClientScoreFieldVisible: boolean;
    private _applicantListHelper: ApplicantListHelper;
    private _rxReportUtil: RxReportUtil;

    constructor(
        injector: Injector,
        applicantListHelper: ApplicantListHelper,
        policySubscriber: PolicySubscriber,
        rxReportUtil: RxReportUtil
    ) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        this._rxReportUtil = rxReportUtil;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this.data.policy.Insureds_LazyLoad);
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedData('rxReports', 'rxReports');
        this.setApplicant();
        this.setupRxReports();
        this.setFullName();
        this.setClientScoreFlag();
        return Promise.resolve();
    }

    private setupRxReports(): void {
        this.firstRxReportItem = this.data.rxReports.length > 0 ? this.data.rxReports[0] : new RXReportProxy();
        ArrayUtil.addAutoItemId(this.data.rxReports, 'RXReportProxyId');
        this.setPrescriptionData();
        this.setPhysicianData();
    }

    private setPrescriptionData(): void {
        const prescriptionSet = new Set<string>();
        this.data.rxReports.forEach(prescription => {
            if (prescription.DrugName && !prescriptionSet.has(prescription.DrugName)) {
                prescriptionSet.add(prescription.DrugName);
                this.prescriptionData.push(prescription);
            }
        });
    }

    private setPhysicianData(): void {
        const physicianSet = new Set<string>();
        this.data.rxReports.forEach(physician => {
            if (physician.PhyscianName && !physicianSet.has(physician.PhyscianName)) {
                physicianSet.add(physician.PhyscianName);
                this.physicianData.push(physician);
            }
        });
    }

    private setFullName(): void {
        this.fullName = NameUtil.getFullNameWithMiddleInitial({
            firstName: this.firstRxReportItem.InsuredFirstName,
            lastName: this.firstRxReportItem.InsuredLastName
        });
    }

    private setClientScoreFlag(): void {
        this.isClientScoreFieldVisible = this._rxReportUtil.checkIfDefaultProvider(this.listData['RxReport']);
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
