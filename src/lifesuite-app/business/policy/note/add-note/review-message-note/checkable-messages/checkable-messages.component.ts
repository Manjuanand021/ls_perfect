import { Component, Injector, Injectable, Input } from '@angular/core';

import {
    IDataGridOptions,
    DataGridColumns,
    IDataGridViewModel,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { ViewModel } from 'life-core/view-model';
import { ConvertUtil } from 'life-core/util/lang';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicyDTO, InsuredDTO, ReviewMessageDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { CheckableMessagesColumnsBuilder } from './checkable-messages-columns.builder';
import { ReviewMessagesType } from 'business/policy/worksheet/review-messages/review-messages-type';
import { ReviewMessagesNoteAuthorizationProvider } from '../review-message-note-authorization.provider';

@Component({
    selector: 'checkable-messages',
    templateUrl: './checkable-messages.component.html',
    providers: [
        PolicySubscriber,
        { provide: AuthorizationProvider, useClass: ReviewMessagesNoteAuthorizationProvider },
        CheckableMessagesColumnsBuilder
    ]
})
@Injectable()
export class CheckableMessagesComponent extends ViewModel<PolicyDataModel> implements IDataGridViewModel {
    @Input()
    public activeReviewMessage: ReviewMessageDTO;
    @Input()
    public selectedApplicantId: number;
    public gridOptions: IDataGridOptions;
    // private _policy: PolicyDTO;
    private _selectedMessages: ReviewMessageDTO[];
    private _gridColumnBuilder: CheckableMessagesColumnsBuilder;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        gridColumnBuilder: CheckableMessagesColumnsBuilder
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
        this._gridColumnBuilder = gridColumnBuilder;
    }

    public loadData(): Promise<void> {
        this.gridOptions = this.getGridOptions();
        return Promise.resolve();
    }

    public getGridOptions(): IDataGridOptions {
        const gridColumns: DataGridColumns = this.getGridColumns();
        return DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: gridColumns.getLayout(),
                rowData: this.getRowData(),
                enableColResize: true,
                domLayout: 'autoHeight',
                showTotal: true,
                checkboxColumn: true,
                rowSelection: 'multiple',
                getRowNodeId: function(data: any): string {
                    return data.ReviewMessageId;
                }
            },
            DataGridCommonOptions
        );
    }

    public getGridColumns(): DataGridColumns {
        const columnsBuilder = this._gridColumnBuilder;
        return columnsBuilder.build();
    }

    private getRowData(): any {
        return this.getCheckableMessages();
    }

    private getCheckableMessages(): Array<any> {
        const selectedApplicant = this.getSelectedApplicant();
        if (!selectedApplicant) return [];
        return selectedApplicant.ReviewMessages_LazyLoad.filter(message => {
            return (
                message.ReviewMessageId != this.activeReviewMessage.ReviewMessageId &&
                ConvertUtil.toNumber(message.MessageType) == ReviewMessagesType.CHECKABLE
            );
        });
    }

    private getSelectedApplicant(): InsuredDTO {
        return this.data.policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.selectedApplicantId);
    }

    public get selectedMessages(): ReviewMessageDTO[] {
        return this._selectedMessages;
    }

    public onRowSelected(event: Event): void {
        this._selectedMessages = this.gridOptions.api.getSelectedRows();
    }
}
