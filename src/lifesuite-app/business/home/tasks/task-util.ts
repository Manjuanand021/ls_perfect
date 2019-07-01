import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';
import { TaskFilterType } from './filter/task-filter-type';

@Injectable()
export class TaskUtil {
    public i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public getTaskTypeCountLabel(filterType: string): string {
        const TaskTypeCountLabel: { [filterType: string]: string } = {
            [TaskFilterType.Inbox]: this.i18n({ value: 'Inbox', id: 'tasks.count.label.inbox' }),
            [TaskFilterType.Outbox]: this.i18n({ value: 'Outbox', id: 'tasks.count.label.outbox' }),
            [TaskFilterType.PendingMail]: this.i18n({
                value: "Req Rec'd",
                id: 'tasks.count.label.requirementrecevied'
            }),
            [TaskFilterType.ReqToOrder]: this.i18n({ value: 'Req to Order', id: 'tasks.count.label.reqtoorder' }),
            [TaskFilterType.PastDueUWReq]: this.i18n({
                value: 'Past Due UW Req',
                id: 'tasks.count.label.pastdueuwreq'
            }),
            [TaskFilterType.CaseMgrRevMsg]: this.i18n({ value: 'Case Mgr Rev Msg', id: 'tasks.count.label.revmsg' }),
            [TaskFilterType.Diary]: this.i18n({ value: 'Diary', id: 'tasks.count.label.diary' }),
            [TaskFilterType.PastDuePreIssue]: this.i18n({
                value: 'Past Due Pre Issue',
                id: 'tasks.count.label.pastduepreiss'
            }),
            [TaskFilterType.PastDuePostIssue]: this.i18n({
                value: 'Past Due Post Issue',
                id: 'tasks.count.label.pastduepostiss'
            }),
            [TaskFilterType.ImgRecd]: this.i18n({ value: 'Img Recd', id: 'tasks.count.label.images' }),
            [TaskFilterType.MIB2Yr]: this.i18n({ value: 'MIB 2Yr', id: 'tasks.count.label.mibtwoyr' })
        };
        return TaskTypeCountLabel[filterType];
    }

    public getTaskTypeGridTitle(filterType: string): string {
        const TaskTypeGridTitle: { [filterType: string]: string } = {
            [TaskFilterType.Inbox]: this.i18n({ value: 'Inbox', id: 'tasks.title.inbox' }),
            [TaskFilterType.Outbox]: this.i18n({ value: 'Outbox', id: 'tasks.title.outbox' }),
            [TaskFilterType.PendingMail]: this.i18n({
                value: 'Requirement Received',
                id: 'tasks.title.requirementrecevied'
            }),
            [TaskFilterType.ReqToOrder]: this.i18n({ value: 'Requirements to Order', id: 'tasks.title.reqtoorder' }),
            [TaskFilterType.PastDueUWReq]: this.i18n({
                value: 'Past Due Underwriting Requirements',
                id: 'tasks.title.pastdueuwreq'
            }),
            [TaskFilterType.CaseMgrRevMsg]: this.i18n({
                value: 'Case Manager Review Messages',
                id: 'tasks.title.revmsg'
            }),
            [TaskFilterType.Diary]: this.i18n({ value: 'Diary Activity', id: 'tasks.title.diary' }),
            [TaskFilterType.PastDuePreIssue]: this.i18n({
                value: 'Past Due Pre Issue Requirements',
                id: 'tasks.title.pastduepreiss'
            }),
            [TaskFilterType.PastDuePostIssue]: this.i18n({
                value: 'Past Due Post Issue Requirements',
                id: 'tasks.title.pastduepostiss'
            }),
            [TaskFilterType.ImgRecd]: this.i18n({ value: 'Image Received', id: 'tasks.title.images' }),
            [TaskFilterType.MIB2Yr]: this.i18n({ value: 'MIB 2Yr', id: 'tasks.title.mibtwoyr' })
        };
        return TaskTypeGridTitle[filterType];
    }
}
