import { Component, Injector } from '@angular/core';

import { MessagingService } from 'life-core/messaging';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';

import { PolicySubscriber } from 'ls-core/session';
import { LSFileProxyDTO } from 'ls-core/model';
import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';

import { BasePolicyGridViewModel } from 'business/policy/shared';
import { CaseAttachedDocumentsListColumnsBuilder } from './attached-documents-columns.builder';
import { CaseAttachmentChannels } from 'business/policy/documents/case-attachments.channel';

@Component({
    selector: 'attached-documents',
    templateUrl: 'attached-documents.component.html',
    providers: [PolicySubscriber, CaseAttachedDocumentsListColumnsBuilder, OpenURLDelegate]
})
export class CaseAttachedDocuments extends BasePolicyGridViewModel<LSFileProxyDTO> {
    public isViewBtnDisabled: boolean;

    private _messagingService: MessagingService;
    private _attachmentURL: string;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _attachedDocumentsList: LSFileProxyDTO[];
    private _openURLDelegate: OpenURLDelegate;

    constructor(
        injector: Injector,
        caseAttachedDocumentsListColumnsBuilder: CaseAttachedDocumentsListColumnsBuilder,
        messagingService: MessagingService,
        openURLDelegate: OpenURLDelegate
    ) {
        super(injector);
        this._gridColumnsBuilder = caseAttachedDocumentsListColumnsBuilder;
        this._messagingService = messagingService;
        this._openURLDelegate = openURLDelegate;
        this._attachedDocumentsList = [];
        this.registerHandlers();
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        if ($event.data.FileNavURL) {
            this.setTemplateUrl($event.data.FileNavURL);
            this.disableViewButton(false);
        }
    }

    public onViewButtonClick(): void {
        if (this._attachmentURL) {
            this._openURLDelegate.openURL(this._attachmentURL);
        }
    }

    public loadData(): Promise<void> {
        this.setResolvedData('caseAttachments');
        this._attachedDocumentsList = this.data.caseAttachments.attachementList;
        this.gridOptions = this.getGridOptions();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.disableViewButton(true);
        this.rowCount = this._attachedDocumentsList.length;
    }

    protected loadItems(): LSFileProxyDTO[] {
        return this._attachedDocumentsList;
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

    private setTemplateUrl(url: string): void {
        this._attachmentURL = url;
    }

    private disableViewButton(disable: boolean): void {
        this.isViewBtnDisabled = disable;
    }

    private registerHandlers(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribe(CaseAttachmentChannels.AttachedDocument, attachedDocument => {
                this._attachedDocumentsList.push(attachedDocument);
                this.refreshGrid();
            })
        );
    }
}
