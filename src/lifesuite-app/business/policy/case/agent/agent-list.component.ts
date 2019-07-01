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
import { Identifiable, AgentDTO, PolicyDTO, AddressTypes, PhoneTypes, PartyTypes } from 'ls-core/model';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

import { AgentComponentResolverHelper } from './agent-component-resolver.helper';

@Component({
    selector: 'case-agent-list',
    templateUrl: './agent-list.component.html',
    styleUrls: ['./agent-list.component.css'],
    providers: [PolicySubscriber]
})
export class AgentListComponent extends ItemListViewModel<AgentDTO> {
    public title: string = 'Agent';
    public policy: PolicyDTO;
    @ViewChild(ItemList)
    public refItemList: ItemList<AgentDTO>;
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
    }

    protected get itemDataIDPropertyName(): string {
        return 'PersonId';
    }

    protected getItemList(): ItemList<AgentDTO> {
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

    protected getItems(): Promise<IItem<AgentDTO>[]> {
        const items: IItem<AgentDTO>[] = [];
        if (this.policy.Agents_LazyLoad == null) {
            this.policy.Agents_LazyLoad = [];
        }
        this.policy.Agents_LazyLoad.forEach(agent => {
            items.push(this.setupNewItem(agent));
        });
        return Promise.resolve(items);
    }

    protected getItemComponentResolver(): IItemListComponentResolver<AgentDTO> {
        const resolverHelper = new AgentComponentResolverHelper();
        return resolverHelper.getResolver(this.editModeOnly);
    }

    protected createItem(eventData: CreateItemEventData<AgentDTO>): Promise<AgentDTO> {
        const agent: AgentDTO = new AgentDTO();
        agent.identifier = new Identifiable();
        const defaultDataRequest = new SetDefaultDataRequest(this.policy, agent, '');
        this.policy.Agents_LazyLoad.push(agent);

        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(agent, data.workingDTO as AgentDTO);
            agent.PersonTypeId = PartyTypes.PERSON;
            agent.Addresses_LazyLoad = [AddressUtil.createAddress(AddressTypes.BUSINESS)];
            agent.Phones_LazyLoad = [PhoneUtil.createPhone(PhoneTypes.WORK), PhoneUtil.createPhone(PhoneTypes.FAX)];
            return agent;
        });
    }

    protected removeItem(item: IItem<AgentDTO>): Promise<boolean> {
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

    protected getAgentName(item: IItem<AgentDTO>): string {
        const agentName = `${item.data.FirstName} ${item.data.LastName}`;
        return item.data.LastName ? `agent ${agentName}` : 'agent';
    }

    private executeRemove(item: IItem<AgentDTO>): Promise<boolean> {
        this.policy.Agents_LazyLoad.splice(this.policy.Agents_LazyLoad.indexOf(item.data), 1);
        return Promise.resolve(true);
    }

    private confirmDelete(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Are you sure you want to delete the selected item?',
                id: 'general.message.delete'
            }),
            title: this.i18n({ value: 'Delete Agent Confirmation', id: 'policy.case.agent.delete' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private onPolicyUpdate(policy: PolicyDTO): void {
        const reloading = !!this.policy;
        this.policy = policy;
        if (reloading) {
            this.reloadItems();
        }
    }
}
