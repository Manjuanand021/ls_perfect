import { ViewChild, Injector, Input, Component } from '@angular/core';

import { ItemListViewModel } from 'life-core/component/item-list';
import { ResolvedDataNames } from 'life-core/view-model';
import {
    ItemList,
    IItemListComponentResolver,
    IItem,
    CreateItemEventData,
    ItemListButton,
    ItemListButtonType
} from 'life-core/component/item-list';
import {
    DialogButton,
    DialogButtonType,
    ModalDialog,
    ConfirmDialog,
    DialogResult,
    DialogSize
} from 'life-core/component/dialog';
import { ButtonActionType } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';

import { CoverageDTO, PolicyCoverageDTO, PolicyDTO, BenefitDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BenefitComponentResolver } from './benefit-component.resolver';
import { AddBenefitComponent, AddBenefitListDataResolver } from './add-benefit';

@Component({
    selector: 'benefit-list',
    templateUrl: './benefit-list.component.html',
    providers: [PolicySubscriber]
})
export class BenefitListComponent extends ItemListViewModel<BenefitDTO> {
    @ViewChild(ItemList)
    public refItemList: ItemList<BenefitDTO>;
    @Input()
    public coverage: CoverageDTO;

    private _policyCoverage: PolicyCoverageDTO;
    private _policy: PolicyDTO;
    private _modalDialog: ModalDialog;
    private _confirmDialog: ConfirmDialog;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        confirmDialog: ConfirmDialog,
        i18n: I18n
    ) {
        super(injector);
        this.editModeOnly = true;
        this._modalDialog = modalDialog;
        this._confirmDialog = confirmDialog;
        policySubscriber.subscribe(this, p => {
            this.onPolicyUpdate(p);
        });
        this.i18n = i18n;
    }

    private onPolicyUpdate(policy: PolicyDTO): void {
        const reloading = !!this._policy;
        this._policy = policy;
        if (reloading) {
            this.reloadItems();
        }
    }

    protected getItemList(): ItemList<BenefitDTO> {
        return this.refItemList;
    }

    protected getItemComponentResolver(): IItemListComponentResolver<BenefitDTO> {
        const resolverHelper = new BenefitComponentResolver();
        return resolverHelper.getResolver(this.editModeOnly);
    }

    protected getItems(): Promise<IItem<BenefitDTO>[]> {
        const items: IItem<BenefitDTO>[] = [];
        this._policyCoverage = this._policy.PolicyCoverages_LazyLoad.find(
            coverage => coverage.PolicyCoverageId === this.coverage.PolicyCoverageId
        );
        if (!this._policyCoverage.Benefits_LazyLoad) {
            this._policyCoverage.Benefits_LazyLoad = [];
        }

        this._policyCoverage.Benefits_LazyLoad.forEach(benefit => {
            items.push(this.setupNewItem(benefit));
        });
        return Promise.resolve(items);
    }

    protected getButtons(): ItemListButton[] {
        return [
            new ItemListButton({
                type: ItemListButtonType.ADD,
                actionType: ButtonActionType.DataChange
            }),
            new ItemListButton({
                type: ItemListButtonType.DELETE,
                actionType: ButtonActionType.DataChange
            })
        ];
    }

    protected get itemDataIDPropertyName(): string {
        return 'BenefitId';
    }

    protected createItem(eventData: CreateItemEventData<BenefitDTO>): Promise<any> {
        return this.addBenefit();
    }

    private addBenefit(): Promise<any> {
        return this._modalDialog
            .open({
                view: AddBenefitComponent,
                data: this._policyCoverage,
                resolve: [
                    {
                        resolveName: ResolvedDataNames.listData,
                        resolverClass: AddBenefitListDataResolver,
                        context: this._policyCoverage
                    }
                ],
                title: this.i18n({ value: 'Select Benefit', id: 'applicant.coverage.benefit.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.ACCEPT }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                size: DialogSize.small
            })
            .then(dialogRef => {
                return dialogRef.result.then(result => {
                    return result.returnValue;
                });
            });
    }

    protected removeItem(item: IItem<BenefitDTO>): Promise<boolean> {
        return this.confirmBenefitRemoval(item).then(result => {
            const shouldRemove = result.buttonId == DialogButtonType.OK;
            if (shouldRemove) {
                return this.removeBenefit(item).then(result => {
                    return result;
                });
            }
            return Promise.resolve(shouldRemove);
        });
    }

    private confirmBenefitRemoval(item: IItem<BenefitDTO>): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Are you sure you want to delete the selected item?',
                id: 'policy.general.deletealertmsg'
            }),
            title: this.i18n({ value: 'Delete Benefit Confirmation', id: 'applicant.coverage.benefit.delete' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private removeBenefit(item: IItem<BenefitDTO>): Promise<boolean> {
        this._policyCoverage.Benefits_LazyLoad.splice(this._policyCoverage.Benefits_LazyLoad.indexOf(item.data), 1);
        return Promise.resolve(true);
    }
}
