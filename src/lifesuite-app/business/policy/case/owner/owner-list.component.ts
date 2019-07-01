import { Injector, Component, ViewChild } from '@angular/core';

import { ConfirmDialog, DialogButton, DialogButtonType, DialogResult } from 'life-core/component/dialog';
import {
    IItem,
    ItemListButton,
    ItemListButtonType,
    CreateItemEventData,
    ItemList,
    ItemListViewModel,
    IItemListComponentResolver
} from 'life-core/component/item-list';
import { ButtonActionType } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';

import { DefaultDataService, SetDefaultDataRequest } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { Identifiable, OwnerDTO, PolicyDTO, AddressTypes, PhoneTypes } from 'ls-core/model';
import { OwnerComponentResolverHelper } from './owner-component-resolver.helper';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

@Component({
    selector: 'owner-list',
    templateUrl: './owner-list.component.html',
    styleUrls: ['./owner-list.component.css'],
    providers: [PolicySubscriber]
})
export class OwnerListComponent extends ItemListViewModel<OwnerDTO> {
    public title: string = 'Owners';

    public policy: PolicyDTO;

    @ViewChild(ItemList)
    public refItemList: ItemList<OwnerDTO>;

    private _defaultDataService: DefaultDataService;

    private _confirmDialog: ConfirmDialog;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        defaultDataService: DefaultDataService,
        confirmDialog: ConfirmDialog,
        i18n: I18n
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.onPolicyUpdate(p);
        });
        this._defaultDataService = defaultDataService;
        this._confirmDialog = confirmDialog;
        this.editModeOnly = true;
        this.i18n = i18n;
        this.title = this.i18n({ value: 'Owners', id: 'policy.owner.title' });
    }

    private onPolicyUpdate(policy: PolicyDTO): void {
        const reloading = !!this.policy;
        this.policy = policy;
        if (reloading) {
            this.reloadItems();
        }
    }

    protected get itemDataIDPropertyName(): string {
        return 'PersonId';
    }

    protected getItemList(): ItemList<OwnerDTO> {
        return this.refItemList;
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
    protected getItems(): Promise<IItem<OwnerDTO>[]> {
        const items: IItem<OwnerDTO>[] = [];
        if (this.policy.Owners_LazyLoad == null) {
            this.policy.Owners_LazyLoad = [];
        }
        this.policy.Owners_LazyLoad.forEach(owner => {
            items.push(this.setupNewItem(owner));
        });
        return Promise.resolve(items);
    }

    protected getItemComponentResolver(): IItemListComponentResolver<OwnerDTO> {
        const resolverHelper = new OwnerComponentResolverHelper();
        return resolverHelper.getResolver(this.editModeOnly);
    }

    protected createItem(eventData: CreateItemEventData<OwnerDTO>): Promise<OwnerDTO> {
        const owner: OwnerDTO = new OwnerDTO();
        owner.identifier = new Identifiable();
        const defaultDataRequest = new SetDefaultDataRequest(this.policy, owner, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(owner, data.workingDTO as OwnerDTO);
            owner.PersonTypeId = 'Person';
            owner.isPrimaryInsured = false;
            this.setPrimaryOwner(owner);
            owner.Addresses_LazyLoad = [AddressUtil.createAddress(AddressTypes.RESIDENCE)];
            owner.Phones_LazyLoad = [PhoneUtil.createPhone(PhoneTypes.HOME), PhoneUtil.createPhone(PhoneTypes.WORK)];
            this.policy.Owners_LazyLoad.push(owner);
            return owner;
        });
    }

    protected setPrimaryOwner(newOwner: OwnerDTO): void {
        const primaryOwnerExists: boolean = this.policy.Owners_LazyLoad.some(owner => {
            return owner.SubRoleId == 'primary';
        });
        newOwner.SubRoleId = primaryOwnerExists ? null : newOwner.SubRoleId;
    }

    protected removeItem(item: IItem<OwnerDTO>): Promise<boolean> {
        return this.confirmDelete().then(result => {
            const isRemoved = result.buttonId == DialogButtonType.OK;
            if (isRemoved) {
                return this.executeRemove(item).then(result => {
                    return result;
                });
            }
            return Promise.resolve(isRemoved);
        });
    }

    private executeRemove(item: IItem<OwnerDTO>): Promise<boolean> {
        this.policy.Owners_LazyLoad.splice(this.policy.Owners_LazyLoad.indexOf(item.data), 1);
        return Promise.resolve(true);
    }

    private confirmDelete(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Are you sure you want to delete the selected item?',
                id: 'general.message.delete'
            }),
            title: this.i18n({ value: 'Delete Owner Confirmation', id: 'policy.case.owner.delete' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    protected getOwnerName(item: IItem<OwnerDTO>): string {
        const ownerName = `${item.data.FirstName} ${item.data.LastName}`;
        return item.data.LastName ? `owner ${ownerName}` : 'owner';
    }
}
