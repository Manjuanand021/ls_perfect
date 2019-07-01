import { Component, Injector, Injectable, Input } from '@angular/core';
import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { CoverageDTO, AmendmentDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { LsInsuredAuthorizationProvider } from 'business/policy/worksheet/case-disp/insured/insured-authorization.provider';
import { AmendmentGridColumnsBuilder } from './amendment-grid-column.builder';
import { AmendmentItemFactory, AmendmentCreateItemParams } from './amendment-item-factory';
import { AmendmentDialogDataResolver } from './detail/amendment-dialog-data.resolver';
import { AmendmentDialogDetailEditor } from './detail/amendment-detail-editor';
import {
    DialogButton,
    DialogButtonType,
    ModalDialogParams,
    ModalDialog,
    CreateItemEventData,
    DialogResult
} from 'life-core/component';

export function rowManagementDelegateFactory(
    itemFactory: AmendmentItemFactory,
    dataManager: BaseDataManager<AmendmentDTO>
): RowManagementDelegate<AmendmentDTO> {
    return new RowManagementDelegate({
        itemName: 'Issue Request',
        itemIDPropertyName: 'CoveragePersonAmendmentId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<AmendmentDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: AmendmentDialogDetailEditor
    });
}

@Component({
    selector: 'amendment',
    templateUrl: './amendment.component.html',
    providers: [
        BaseDataManager,
        AmendmentItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [AmendmentItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        { provide: AuthorizationProvider, useClass: LsInsuredAuthorizationProvider },
        AmendmentGridColumnsBuilder
    ]
})
@Injectable()
export class AmendmentComponent extends BasePolicyMasterDetailViewModel<AmendmentDTO> {
    public _amendmentItemFactory: AmendmentItemFactory;
    @Input()
    public coverage: CoverageDTO;

    public coveragePersonId: number;
    private _modalDialog: ModalDialog;
    private _gridColumnBuilder: AmendmentGridColumnsBuilder;

    constructor(
        injector: Injector,
        modalDialog: ModalDialog,
        amendmentItemFactory: AmendmentItemFactory,
        gridColumnBuilder: AmendmentGridColumnsBuilder,
        i18n: I18n
    ) {
        super(injector);
        this._modalDialog = modalDialog;
        this._amendmentItemFactory = amendmentItemFactory;
        this._gridColumnBuilder = gridColumnBuilder;
        this.i18n = i18n;
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Issue Request', id: 'policy.worksheet.coverage.amendment.issueRequest' });
    }

    protected loadItems(): AmendmentDTO[] {
        return this.coverage.Amendments_LazyLoad;
    }

    private getCoveragePersonIdForNewIssueRequest(): Object {
        return this.coverage.CoveragePersonId;
    }

    protected getRowNodeId(data: AmendmentDTO): Object {
        return data.CoveragePersonAmendmentId;
    }

    protected getPopupDetailButtons(): MasterButton<AmendmentDTO>[] {
        // Add Master Button
        const addMasterButton = new MasterButton({ type: MasterButtonType.ADD });
        addMasterButton.handler = () => {
            this.addMasterButtonHandler();
        };

        // Edit Master Button
        const editMasterButton = new MasterButton({ type: MasterButtonType.EDIT });

        // Delete Master Button
        const deleteMasterButton = new MasterButton({ type: MasterButtonType.DELETE });

        return [addMasterButton, editMasterButton, deleteMasterButton];
    }

    protected getItemDetailDialogResolve(item: AmendmentDTO): DirectDataResolve[] {
        return [{ resolveName: 'listData', resolverClass: AmendmentDialogDataResolver, context: item }];
    }

    protected getItemDetailDialogButtonsForAddItems(): DialogButton[] {
        return [
            new DialogButton({
                type: DialogButtonType.ACCEPT_ADD,
                options: { isDefault: true },
                handler: (item: AmendmentDTO, dialogResult: DialogResult) => {
                    if (item) {
                        this.acceptAddButtonHandler(dialogResult);
                    }
                }
            }),
            // new DialogButton({ type: DialogButtonType.ACCEPT_ADD, label: DialogButtonLabels.button_accept }),
            new DialogButton({ type: DialogButtonType.ACCEPT }),
            new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
        ];
    }

    protected createItem(eventData?: CreateItemEventData<AmendmentDTO>): Promise<AmendmentDTO> {
        const amendmentDTO: AmendmentDTO = this.rowManagementDelegate.addNewRow({
            items: this.items,
            coveragePersonId: this.getCoveragePersonIdForNewIssueRequest()
        } as AmendmentCreateItemParams<AmendmentDTO>);
        return Promise.resolve(amendmentDTO);
    }

    private addMasterButtonHandler(): void {
        const amendmentDTO = new AmendmentDTO();
        amendmentDTO.CoveragePersonId = this.getCoveragePersonIdForNewIssueRequest();
        const addDialogParams: ModalDialogParams = {
            view: AmendmentDialogDetailEditor,
            resolve: this.getItemDetailDialogResolve(amendmentDTO),
            title: this.getCreateItemDialogTitle(),
            buttons: this.getItemDetailDialogButtonsForAddItems(),
            data: amendmentDTO
        };
        const self = this;
        this._modalDialog.open(addDialogParams).then(dialogRef => {
            dialogRef.result.then(result => {
                if (result.returnValue) {
                    self.addAmendment(result);
                }
            });
        });
    }

    private acceptAddButtonHandler(dialogResult: DialogResult): void {
        this.addAmendment(dialogResult);
    }

    private addAmendment(dialogResult: DialogResult): void {
        this.createItem().then(item => {
            Object.assign(item, dialogResult.returnValue);
            this.rowManagementDelegate.saveRow(item);
            this.changeManager.setIsDirty(dialogResult.dialogDirty);
        });
    }
}
