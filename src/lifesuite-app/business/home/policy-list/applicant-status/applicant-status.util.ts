import { Injectable } from '@angular/core';
import { PolicyStatusCountsDTO, PolicyStatusCountDTO } from 'ls-core/model';
import { StatusCount } from './status-count';
import { PolicyStatusType, PolicyStatusLabelType } from '../policy-status-type';
import { I18n } from 'life-core/i18n';
import { ArrayUtil } from 'life-core/util/lang';

@Injectable()
export class ApplicantStatusUtil {
    private i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public getStatusCountList(statusCountsDTO: PolicyStatusCountsDTO): Array<StatusCount> {
        const statuses: Array<StatusCount> = [];
        if (statusCountsDTO && statusCountsDTO.statusTypeCounts) {
            statusCountsDTO.statusTypeCounts.forEach(status => {
                const statusCountDTO = status as PolicyStatusCountDTO;
                const applicantStatus = new StatusCount(
                    statusCountDTO.statusCountType,
                    statusCountDTO.agingRanges,
                    this.getStatusShortNameKey(statusCountDTO.statusCountType)
                );
                statuses.push(applicantStatus);
            });
        }

        return this.getSortedStatusCountList(statuses);
    }

    public getApplicantStatusShortName(statusType: number): string {
        const ApplicantStatusShortNamesByType: { [statusType: number]: string } = {
            [PolicyStatusType.NewBusiness]: this.i18n({
                value: 'NB',
                id: 'mywork.statuscount.label.newbusiness.short'
            }),
            [PolicyStatusType.Pending]: this.i18n({ value: 'PE', id: 'mywork.statuscount.label.pending.short' }),
            [PolicyStatusType.PendingMail]: this.i18n({
                value: 'PM',
                id: 'mywork.statuscount.label.pendingmail.short'
            }),
            [PolicyStatusType.FinalAct]: this.i18n({ value: 'FA', id: 'mywork.statuscount.label.finalaction.short' }),
            [PolicyStatusType.Hold]: this.i18n({ value: 'HD', id: 'mywork.statuscount.label.hold.short' }),
            [PolicyStatusType.ToBeIssued]: this.i18n({
                value: 'AP',
                id: 'mywork.statuscount.label.applicantstatuses.short'
            })
        };

        return ApplicantStatusShortNamesByType[statusType];
    }

    private getStatusShortNameKey(statusType: number): string {
        const ApplicantStatusShortNameKey: { [statusType: number]: PolicyStatusLabelType } = {
            [PolicyStatusType.Total]: PolicyStatusLabelType.Total_ShortForm,
            [PolicyStatusType.NewBusiness]: PolicyStatusLabelType.NewBusiness_ShortForm,
            [PolicyStatusType.Pending]: PolicyStatusLabelType.Pending_ShortForm,
            [PolicyStatusType.PendingMail]: PolicyStatusLabelType.PendingMail_ShortForm,
            [PolicyStatusType.FinalAct]: PolicyStatusLabelType.FinalAct_ShortForm,
            [PolicyStatusType.Hold]: PolicyStatusLabelType.Hold_ShortForm,
            [PolicyStatusType.ToBeIssued]: PolicyStatusLabelType.ToBeIssued_ShortForm
        };

        return ApplicantStatusShortNameKey[statusType];
    }

    public getApplicantStatusLabel(statusType: number): string {
        const ApplicantStatusLabel: { [statusType: number]: string } = {
            [PolicyStatusType.NewBusiness]: this.i18n({ value: 'New Bus', id: 'mywork.statuscount.label.newbusiness' }),
            [PolicyStatusType.Pending]: this.i18n({ value: 'Pending', id: 'mywork.statuscount.label.pending' }),
            [PolicyStatusType.PendingMail]: this.i18n({
                value: 'Pend Mail',
                id: 'mywork.statuscount.label.pendingmail'
            }),
            [PolicyStatusType.FinalAct]: this.i18n({ value: 'Final Act', id: 'mywork.statuscount.label.finalaction' }),
            [PolicyStatusType.Hold]: this.i18n({ value: 'Hold', id: 'mywork.statuscount.label.hold' }),
            [PolicyStatusType.ToBeIssued]: this.i18n({
                value: 'To Be Issued',
                id: 'mywork.statuscount.label.tobeissued'
            }),
            [PolicyStatusType.Total]: this.i18n({ value: 'Total', id: 'mywork.statuscount.label.total' })
        };

        return ApplicantStatusLabel[statusType];
    }

    private getSortedStatusCountList(statuses: any): Array<StatusCount> {
        const sortAs = [
            PolicyStatusType.NewBusiness,
            PolicyStatusType.Pending,
            PolicyStatusType.PendingMail,
            PolicyStatusType.FinalAct,
            PolicyStatusType.Hold,
            PolicyStatusType.ToBeIssued,
            PolicyStatusType.Total
        ];
        const sortCompareFunction = ArrayUtil.getSortCompareFunction(sortAs, 'statusType');
        return statuses.sort(sortCompareFunction);
    }
}
