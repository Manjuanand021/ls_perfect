import { Component, Injector } from '@angular/core';

import { DialogButtonType, DialogButton, ConfirmDialog, DialogResult } from 'life-core/component';
import { MessagingService } from 'life-core/messaging';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { PolicySubscriber, AppSession } from 'ls-core/session';
import { LSFileProxyDTO } from 'ls-core/model';
import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';

import { BasePolicyGridViewModel } from 'business/policy/shared';
import { CaseAttachmentChannels } from 'business/policy/documents/attachments/case-attachments.channel';
import { CaseDocumentsForAttachmentListColumnsBuilder } from './documents-for-attachment-columns.builder';
import { CaseDocumentsForAttachmentService } from './service-requests/case-documents-for-attachment.service';
import { CaseAttachmentsResponse } from './service-requests/case-documents-for-attachment.service';
import { MetadataUtil } from 'ls-core/util';
const FILE_SAVE_PROGRESS_STATUS = 1;
@Component({
    selector: 'documents-for-attachment',
    templateUrl: 'documents-for-attachment.component.html',
    providers: [
        PolicySubscriber,
        OpenURLDelegate,
        CaseDocumentsForAttachmentListColumnsBuilder,
        CaseDocumentsForAttachmentService
    ]
})
export class CaseDocumentsForAttachment extends BasePolicyGridViewModel<LSFileProxyDTO> {
    public disableAttachButton: boolean;
    public disableEditButton: boolean;
    public disableDeleteButton: boolean;
    public file: LSFileProxyDTO;

    private _confirmDialog: ConfirmDialog;
    private _appSession: AppSession;
    private _attachmentURL: string;
    private _messagingService: MessagingService;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _workInProgressList: LSFileProxyDTO[];
    private _caseDocumentsForAttachmentService: CaseDocumentsForAttachmentService;
    private _openURLDelegate: OpenURLDelegate;

    constructor(
        injector: Injector,
        caseDocumentsForAttachmentListColumnsBuilder: CaseDocumentsForAttachmentListColumnsBuilder,
        caseDocumentsForAttachmentService: CaseDocumentsForAttachmentService,
        confirmDialog: ConfirmDialog,
        appSession: AppSession,
        messagingService: MessagingService,
        openURLDelegate: OpenURLDelegate,
        i18n: I18n
    ) {
        super(injector);
        this._appSession = appSession;
        this._gridColumnsBuilder = caseDocumentsForAttachmentListColumnsBuilder;
        this._caseDocumentsForAttachmentService = caseDocumentsForAttachmentService;
        this._confirmDialog = confirmDialog;
        this._messagingService = messagingService;
        this._openURLDelegate = openURLDelegate;
        this.i18n = i18n;
    }

    public loadData(): Promise<void> {
        this.setResolvedData('caseAttachments');
        this.setResolvedMetaData();
        this._workInProgressList = this.data.caseAttachments.workInProgressList;
        this.gridOptions = this.getGridOptions();
        return Promise.resolve();
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this.file = $event.data;
        this.disableDeleteButton = false;
        this.setTemplateUrl(this.file.FileNavURL);
        this.disableEditAttachButtons(this.file != null && this.file.SaveInProgress == FILE_SAVE_PROGRESS_STATUS);
    }

    public editDocument(): void {
        this._openURLDelegate.openURL(this._attachmentURL);
    }

    public deleteDocument(): void {
        this.showDeleteDocumentConfirmDialog().then(dialogResult => {
            if (dialogResult.buttonId == DialogButtonType.OK) {
                this.onDeleteDocumentConfirmed();
            }
        });
    }

    public attachDocument(): void {
        this._caseDocumentsForAttachmentService
            .attachDocuments(this._appSession.policyId, this.file)
            .then((result: CaseAttachmentsResponse) => {
                if (result.success) {
                    this.publishAttachedFile();
                }
            });
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(CaseAttachmentChannels.AttachedDocument);
        super.ngOnDestroy();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: LSFileProxyDTO): any {
        return data.FileNavURL;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }

    protected setupData(): void {
        this.disableActionButtons();
        this.setGridRowCount();
    }

    protected loadItems(): LSFileProxyDTO[] {
        return this._workInProgressList;
    }

    private disableActionButtons(): void {
        this.disableDeleteButton = true;
        this.disableEditButton = true;
        this.disableAttachButton = true;
    }

    private setGridRowCount(): void {
        this.rowCount = this._workInProgressList.length;
    }

    private disableEditAttachButtons(disable: boolean): void {
        this.disableEditButton = disable;
        this.disableAttachButton = disable;
    }

    private showDeleteDocumentConfirmDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: MetadataUtil.getLabelByValue(this.listData['System Message'], 'AttachmentDeleteMessage'),
            title: this.i18n({ value: 'Confirm Document Removal', id: 'policy.case.document.attachmentDeleteHeader' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL })
            ]
        });
    }

    private onDeleteDocumentConfirmed(): any {
        this._caseDocumentsForAttachmentService
            .deleteDocuments(this._appSession.policyId, this.file)
            .then((result: CaseAttachmentsResponse) => {
                if (result.success) {
                    this.refreshDocumentsForAttachment();
                }
            });
    }

    private setTemplateUrl(url: string): void {
        this._attachmentURL = url;
    }

    private publishAttachedFile(): void {
        this._messagingService.publish(CaseAttachmentChannels.AttachedDocument, this.file);
        this.refreshDocumentsForAttachment();
    }

    private refreshDocumentsForAttachment(): void {
        this._workInProgressList.splice(this._workInProgressList.indexOf(this.file), 1);
        this.refreshGrid();
    }
}
