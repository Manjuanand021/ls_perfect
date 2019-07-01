import { Injectable } from '@angular/core';

import { ApplicationInfoDTO, PolicyDTO } from 'ls-core/model';
import { ConvertUtil } from 'life-core/util/lang';
import { AppSession } from 'ls-core/session';
import { PolicyStatusCodes } from 'business/policy/shared/constant';
import { ApplicantListHelper } from '../applicant/applicant-list.helper';

@Injectable()
export class ApplicationCountersHelper {
    private _appSession: AppSession;
    private _applicantListHelper: ApplicantListHelper;

    constructor(appSession: AppSession, applicantListHelper: ApplicantListHelper) {
        this._appSession = appSession;
        this._applicantListHelper = applicantListHelper;
    }

    public incrementManualActionCounter(policy: PolicyDTO): void {
        if (policy.PolicyStatusCode == PolicyStatusCodes.PENDING) {
            this.changeManualActionCounter(this.getApplication(policy), 1);
        }
    }

    public decrementManualActionCounter(policy: PolicyDTO): void {
        if (policy.PolicyStatusCode == PolicyStatusCodes.PENDING) {
            this.changeManualActionCounter(this.getApplication(policy), -1);
        }
    }

    private getApplication(policy: PolicyDTO): ApplicationInfoDTO {
        const applicant = this._applicantListHelper.getActiveApplicantOrDefault(policy.Insureds_LazyLoad);
        return applicant && applicant.Applications_LazyLoad && applicant.Applications_LazyLoad.length > 0
            ? applicant.Applications_LazyLoad[0]
            : null;
    }

    private changeManualActionCounter(application: ApplicationInfoDTO, numberOfActions: number): void {
        if (!this._appSession.user || !application) return;
        if (this.isUnderwriter()) {
            if (application.UwCount == null) application.UwCount = 0;
            application.UwCount = this.addNumberOfActions(application.UwCount, numberOfActions);
        } else if (this.isServiceAssociate()) {
            if (application.CmCount == null) application.CmCount = 0;
            application.CmCount = this.addNumberOfActions(application.CmCount, numberOfActions);
        }
    }

    private isUnderwriter(): boolean {
        return !!this._appSession.user.IsUnderwriter;
    }

    private isServiceAssociate(): boolean {
        return !!this._appSession.user.IsServiceAssociate;
    }

    private addNumberOfActions(counter: Object, numberOfActions: number): number {
        return ConvertUtil.toNumber(counter) + numberOfActions;
    }
}
