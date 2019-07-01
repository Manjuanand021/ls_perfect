import { Injectable } from '@angular/core';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { ListUtil } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';
import { ListDataUtil } from 'ls-core/service/list-data';

import { RequirementIconHelper } from './requirement-icon.helper';
import { CompareResult, compare } from 'life-core/util/lang';
import { RowNode } from 'ag-grid-community';

@Injectable()
export class RequirementGridColumnsBuilder extends BaseGridColumnsBuilder {
    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;

        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.addColumn({
            headerName: this.i18n({ value: 'Alert', id: 'policy.requirement.gridheader.alert' }),
            field: [RequirementGridFields.ClosedDisposition, RequirementGridFields.FollowupDate].toString(),
            width: 50,
            minWidth: 50,
            cellRenderer: this.getAlertIcon,
            comparator: this.compareAlertStatus
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Note', id: 'policy.requirement.gridheader.note' }),
            field: RequirementGridFields.NoteId,
            width: 50,
            minWidth: 50,
            cellRenderer: this.getNoteIcon
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Matched', id: 'policy.requirement.gridheader.matched' }),
            field: RequirementGridFields.SupportsMatch,
            width: 50,
            minWidth: 50,
            cellRenderer: this.getMatchUnmatchIcon
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Requirement', id: 'policy.requirement.gridheader.requirement' }),
            field: RequirementGridFields.RequirementCode,
            width: 200,
            valueFormatter: function(params: any): string {
                return ListDataUtil.getLabelFromListDataById(params.context.listData.Requirement, params.value);
            }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Applicant', id: 'policy.requirement.gridheader.applicant' }),
            field: RequirementGridFields.PolicyPersonId,
            width: 120,
            valueFormatter: function(params: any): string {
                return ListUtil.getLabelByValue(params.context.applicantListOptions, params.value);
            }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Status', id: 'policy.requirement.gridheader.status' }),
            field: RequirementGridFields.ClosedDisposition,
            width: 80,
            valueFormatter: function(params: any): string {
                return ListUtil.getLabelByValue(params.context.listData.RequirementStatus, ((params.value == null || params.value == '') ? "O" : params.value));
            }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Added', id: 'policy.requirement.gridheader.added' }),
            field: RequirementGridFields.AddedDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Ordered', id: 'policy.requirement.gridheader.ordered' }),
            field: RequirementGridFields.OrderedDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Received', id: 'policy.requirement.gridheader.received' }),
            field: RequirementGridFields.ReceivedDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Final Disposition', id: 'policy.requirement.gridheader.finaldisposition' }),
            field: RequirementGridFields.ClosedDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Follow Up Date', id: 'policy.requirement.gridheader.followupdate' }),
            field: RequirementGridFields.FollowupDate,
            width: 80,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            comparator: this._lsCellComparators.datetimeComparator
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Assigned To', id: 'policy.requirement.gridheader.assignedto' }),
            field: RequirementGridFields.OrderedBy,
            width: 100,
            minWidth: 100,
            valueFormatter: function(params: any): string {
                let result: string;
                let assignToId: any;
                if (params.value == null || params.value == 'Home Office') return '';
                switch (params.value.toUpperCase()) {
                    case 'HO - UNDERWRITER':
                        assignToId = params.context.policy.UnderwriterId;
                        result = assignToId
                            ? ListUtil.getLabelByValue(params.context.listData.underwriter, assignToId)
                            : '';
                        break;
                    case 'TEAM':
                        assignToId = params.context.policy.TeamId;
                        result = assignToId ? ListUtil.getLabelByValue(params.context.listData.team, assignToId) : '';
                        break;
                    case 'HO - CASE MANAGER':
                        assignToId = params.context.policy.ServiceAssociateId;
                        result = assignToId
                            ? ListUtil.getLabelByValue(params.context.listData.service_associate, assignToId)
                            : '';
                        break;
                    default:
                        result = params.value;
                }
                return result;
            }
        });
        return this.columns;
    }

    private getMatchUnmatchIcon(params: any): string {
        return RequirementIconHelper.getMatchUnmatchIcon(params.data);
    }

    private getNoteIcon(params: any): string {
        return RequirementIconHelper.getNoteIcon(params.data);
    }

    private getAlertIcon(params: any): string {
        return RequirementIconHelper.getAlertIcon(params.data);
    }

    private compareAlertStatus(alert1: any, alert2: any, node1: RowNode, node2: RowNode): number {
        const alertIconData2 = RequirementIconHelper.getAlertIcon(node2.data) === '' ? 0 : 1;
        const alertIconData1 = RequirementIconHelper.getAlertIcon(node1.data) === '' ? 0 : 1;
        return alertIconData1 > alertIconData2
            ? CompareResult.greater
            : alertIconData1 < alertIconData2
            ? CompareResult.less
            : CompareResult.equal;
    }
}

export const RequirementGridFields = {
    RequirementCode: 'RequirementCode',
    PolicyPersonId: 'PolicyPersonId',
    ClosedDisposition: 'ClosedDisposition',
    AddedDate: 'AddedDate',
    OrderedDate: 'OrderedDate',
    ReceivedDate: 'ReceivedDate',
    ClosedDate: 'ClosedDate',
    FollowupDate: 'FollowupDate',
    OrderedBy: 'OrderedBy',
    NoteId: 'NoteId',
    RequirementInformationId: 'RequirementInformationId',
    SupportsMatch: 'supportsMatch'
};
