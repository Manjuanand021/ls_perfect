import { Injectable } from '@angular/core';

import { ActiveApplicantHelper } from './active-applicant.helper';
import { ListItem } from 'life-core/model';
import { InsuredDTO } from 'ls-core/model';
import { ConvertUtil } from 'life-core/util/lang';
import { ApplicantHelper } from './applicant.helper';
@Injectable()
export class ApplicantListHelper {
    private _activeApplicantId: number;

    constructor(activeApplicantHelper: ActiveApplicantHelper) {
        activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
            this._activeApplicantId = activeApplicantId;
        });
    }

    public getApplicantList(applicants: InsuredDTO[], isApplicantIdPersonId: boolean = true): ListItem[] {
        const applicantList: ListItem[] = [];
        applicants.forEach(applicant => {
            const applicantName = ApplicantHelper.getApplicantFullName(applicant);
            const applicantId = isApplicantIdPersonId
                ? applicant.PersonId.toString()
                : applicant.PolicyPersonId.toString();
            applicantList.push(new ListItem(applicantName, applicantId));
        });
        return applicantList;
    }

    public getActiveApplicantIdOrDefault(applicants: InsuredDTO[]): number {
        return this._activeApplicantId != null ? this._activeApplicantId : ConvertUtil.toNumber(applicants[0].PersonId);
    }

    public getActiveApplicantOrDefault(applicants: InsuredDTO[]): InsuredDTO {
        const selectedApplicantId = this.getActiveApplicantIdOrDefault(applicants);
        return applicants.find(applicant => applicant.PersonId == selectedApplicantId);
    }
}
