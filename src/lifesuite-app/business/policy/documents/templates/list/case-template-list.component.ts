import { Component, Input, Injector } from '@angular/core';

import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';

import { PolicySubscriber } from 'ls-core/session';
import { LSFileProxyDTO } from 'ls-core/model';
import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';

import { BasePolicyGridViewModel } from 'business/policy/shared';
import { CaseTemplateListColumnsBuilder } from './case-template-list-columns.builder';

@Component({
    selector: 'template-list',
    templateUrl: './case-template-list.component.html',
    providers: [PolicySubscriber, CaseTemplateListColumnsBuilder, OpenURLDelegate]
})
export class CaseTemplateList extends BasePolicyGridViewModel<LSFileProxyDTO> {
    public isGenerateDocumentBtnDisabled: boolean;

    private _templateURL: string;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _caseTemplates: LSFileProxyDTO[];
    private _openURLDelegate: OpenURLDelegate;

    constructor(
        injector: Injector,
        caseTemplateListColumnsBuilder: CaseTemplateListColumnsBuilder,
        openURLDelegate: OpenURLDelegate
    ) {
        super(injector);
        this._gridColumnsBuilder = caseTemplateListColumnsBuilder;
        this._openURLDelegate = openURLDelegate;
    }

    @Input()
    public set caseTemplates(value: LSFileProxyDTO[]) {
        this._caseTemplates = value;
        this.refreshGrid();
    }

    public get caseTemplates(): LSFileProxyDTO[] {
        return this._caseTemplates;
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this.setTemplateUrl($event.data.FileNavURL);
        this.disableGenerateDocumentButton(false);
    }

    public onGenerateDocument(): void {
        this._openURLDelegate.openURL(this._templateURL);
    }

    protected setupData(): void {
        this.disableGenerateDocumentButton(true);
    }

    protected loadItems(): LSFileProxyDTO[] {
        return this._caseTemplates;
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
        this._templateURL = url;
    }

    private disableGenerateDocumentButton(disable: boolean): void {
        this.isGenerateDocumentBtnDisabled = disable;
    }
}
