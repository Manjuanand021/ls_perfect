import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns, GridFilterFrameworkComponentType } from 'life-core/component/grid';
import { MessagingService } from 'life-core/messaging';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters } from 'ls-core/component/grid';
import { BisOkDocDTO } from 'ls-core/model/dto/bis-ok-doc.dto';
import { SortOrderTypes } from 'ls-core/model/const/sort-order-types';

import { TaskFilterType } from '../filter';
import { TaskListIconHelper } from './task-list-icon.helper';
import { TaskListImageService } from 'business/home/tasks/task-list/task-list-image.service';
import { TaskListChannels } from 'business/home/tasks/task-list-channels';

enum TaskListFields {
    DiaryDate = 'DiaryDate',
    PolicyNumber = 'PolicyNumber',
    InsuredNameFull = 'InsuredNameFull',
    AuthorName = 'AuthorName',
    Topic = 'Topic',
    IsNew = 'IsNew',
    ReferredToName = 'ReferredToName',
    RequirementName = 'RequirementName',
    FollowupDate = 'FollowupDate',
    ServiceAssociateName = 'ServiceAssociateName',
    ReceiveDate = 'ReceiveDate',
    InsuredName = 'InsuredName',
    UnderwriterName = 'UnderwriterName',
    LastUpdateDate = 'LastUpdateDate',
    LinkUrl = 'LinkUrl',
    ApplicantName = 'ApplicantName',
    ReviewMessageText = 'ReviewMessageText',
    CaseManagerName = 'CaseManagerName',
    ReceivedDate = 'ReceivedDate',
    UnderwriterNameShort = 'UnderwriterNameShort'
}

@Injectable()
export class TaskListColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _taskListImageService: TaskListImageService;
    private _messagingService: MessagingService;

    constructor(
        lsCellFormatters: LsCellFormatters,
        taskListImageService: TaskListImageService,
        messagingService: MessagingService,
        i18n: I18n
    ) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._taskListImageService = taskListImageService;
        this._messagingService = messagingService;
        this.i18n = i18n;
    }

    public build(taskFilterType: string): DataGridColumns {
        this.resetColumns();
        switch (taskFilterType) {
            case TaskFilterType.Outbox: {
                this.getOutboxColumns();
                break;
            }
            case TaskFilterType.ReqToOrder: {
                this.getRequirementToOrderColumns();
                break;
            }
            case TaskFilterType.PastDueUWReq:
            case TaskFilterType.PastDuePreIssue:
            case TaskFilterType.PastDuePostIssue: {
                this.getPastDueReqGridColumns();
                break;
            }
            case TaskFilterType.MIB2Yr: {
                this.getMIB2YrGridColumns();
                break;
            }
            case TaskFilterType.CaseMgrRevMsg: {
                this.getCaseMgrRevMsgGridColumns();
                break;
            }
            case TaskFilterType.Diary: {
                this.getDiaryActivityGridColumns();
                break;
            }
            case TaskFilterType.ImgRecd: {
                this.getImgReceivedGridColumns();
                break;
            }
            case TaskFilterType.PendingMail: {
                this.getRequirementRecdGridColumns();
                break;
            }
            case TaskFilterType.Inbox:
            default: {
                this.getInboxColumns();
                break;
            }
        }
        return this.columns;
    }

    private getInboxColumns(): void {
        this.addColumn({
            headerName: '',
            cellRenderer: TaskListIconHelper.getIcon,
            width: 20,
            suppressFilter: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Diary Date', id: 'tasks.inbox.gridheader.diarydate' }),
            field: TaskListFields.DiaryDate,
            width: 40,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.InsuredNameFull,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Author', id: 'tasks.inbox.gridheader.author' }),
            field: TaskListFields.AuthorName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Subject', id: 'tasks.inbox.gridheader.subject,' }),
            field: TaskListFields.Topic,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter,
            tooltipField: TaskListFields.Topic
        });
    }

    private getOutboxColumns(): void {
        this.addColumn({
            headerName: '',
            cellRenderer: TaskListIconHelper.getIcon,
            width: 20,
            suppressFilter: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Diary Date', id: 'tasks.inbox.gridheader.diarydate' }),
            field: TaskListFields.DiaryDate,
            width: 40,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.InsuredNameFull,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Referred To', id: 'tasks.outbox.gridheader.referredto' }),
            field: TaskListFields.ReferredToName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Subject', id: 'tasks.inbox.gridheader.subject,' }),
            field: TaskListFields.Topic,
            width: 100,
            filter: GridFilterFrameworkComponentType.TextFilter,
            tooltipField: TaskListFields.Topic
        });
    }

    private getRequirementToOrderColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.InsuredNameFull,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({
                value: 'Requirement Message',
                id: 'tasks.reqtoorder.gridheader.requirementmessage'
            }),
            field: TaskListFields.RequirementName,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
    }

    // Renaming method name as it is commonly used for multiple filters
    private getPastDueReqGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Follow Up Date/Time', id: '' }),
            field: TaskListFields.FollowupDate,
            width: 40,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: (params): any => this._lsCellFormatters.dateCellFormatter(params, 'short'),
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.InsuredNameFull,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Requirement Type', id: 'tasks.pastdue.gridheader.requirementtype' }),
            field: TaskListFields.RequirementName,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case Manager', id: 'tasks.pastdue.gridheader.casemanager' }),
            field: TaskListFields.ServiceAssociateName,
            width: 70,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
    }

    private getMIB2YrGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Received Date', id: '' }),
            field: TaskListFields.ReceiveDate,
            width: 40,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: (params): any => this._lsCellFormatters.dateCellFormatter(params, 'short'),
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant Name', id: 'tasks.mibtwoyr.gridheader.applicantname' }),
            field: TaskListFields.InsuredName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Underwriter', id: 'tasks.mibtwoyr.gridheader.underwriter' }),
            field: TaskListFields.UnderwriterName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
    }

    private getCaseMgrRevMsgGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.ApplicantName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Review Message', id: 'tasks.revmsg.gridheader.reviewmessage' }),
            field: TaskListFields.ReviewMessageText,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter,
            tooltipField: TaskListFields.ReviewMessageText
        });

        this.addColumn({
            headerName: this.i18n({ value: 'Case Manager', id: 'tasks.revmsg.gridheader.casemanager' }),
            field: TaskListFields.CaseManagerName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
    }

    private getDiaryActivityGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Diary Date', id: 'tasks.inbox.gridheader.diarydate' }),
            field: TaskListFields.DiaryDate,
            width: 40,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'tasks.inbox.gridheader.applicant' }),
            field: TaskListFields.InsuredNameFull,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Subject', id: 'tasks.inbox.gridheader.subject,' }),
            field: TaskListFields.Topic,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter,
            tooltipField: TaskListFields.Topic
        });
    }

    private getImgReceivedGridColumns(): void {
        this.addColumn({
            headerName: '',
            field: TaskListFields.IsNew,
            width: 10,
            cellRenderer: TaskListIconHelper.getIconForImgReceived,
            suppressFilter: true
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Date', id: 'tasks.images.gridheader.lastupdatedate' }),
            field: TaskListFields.LastUpdateDate,
            width: 30,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 30,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Link', id: 'tasks.images.gridheader.docurl' }),
            field: TaskListFields.LinkUrl,
            width: 80,
            suppressFilter: true
        });
        this.addColumn({
            headerName: '',
            field: '',
            width: 7,
            cellRenderer: TaskListIconHelper.getDeleteIconForImgReceived,
            onCellClicked: this.onDeleteButtonClicked.bind(this),
            suppressFilter: true
        });
    }

    private onDeleteButtonClicked(params: any): void {
        if (params.data) {
            const bisOkDocDTO: BisOkDocDTO = params.data;
            this._taskListImageService.deleteTaskListImage(bisOkDocDTO);
            this._messagingService.publish(TaskListChannels.TaskCountsChanged);
        }
    }

    private getRequirementRecdGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Received Date', id: 'tasks.mibtwoyr.gridheader.receivedate' }),
            field: TaskListFields.ReceivedDate,
            width: 40,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            filter: GridFilterFrameworkComponentType.DateFilter,
            sort: SortOrderTypes.Ascending
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Case #', id: 'tasks.inbox.gridheader.casenumber' }),
            field: TaskListFields.PolicyNumber,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant Name', id: 'tasks.mibtwoyr.gridheader.applicantname' }),
            field: TaskListFields.InsuredName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Requirement Type', id: 'tasks.pastdue.gridheader.requirementtype' }),
            field: TaskListFields.RequirementName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Underwriter', id: 'tasks.mibtwoyr.gridheader.underwriter' }),
            field: TaskListFields.UnderwriterNameShort,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Service Associate', id: 'tasks.pastdue.gridheader.casemanager' }),
            field: TaskListFields.ServiceAssociateName,
            width: 40,
            filter: GridFilterFrameworkComponentType.TextFilter
        });
    }
}
