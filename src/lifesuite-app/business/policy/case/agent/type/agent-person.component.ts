import { Component, Injector } from '@angular/core';

import { AddressDTO, AddressTypes, PhoneDTO, PhoneTypes, AgentDTO, Identifiable } from 'ls-core/model';
import { AddressUtil, PhoneUtil } from 'ls-core/util';
import { AgentTypeComponent } from './agent-type.component';
import { AgentDataResolver } from './agent-data.resolver';

@Component({
    selector: 'agent-person',
    templateUrl: './agent-person.component.html'
})
export class AgentPersonComponent extends AgentTypeComponent {
    public businessAddress: AddressDTO;
    public workNumber: PhoneDTO;
    public faxNumber: PhoneDTO;
    public agentDataExist: boolean;
    public activeAgentNumber: string;
    private _agentResolver: AgentDataResolver;

    constructor(injector: Injector, agentDataResolver: AgentDataResolver) {
        super(injector);
        this._agentResolver = agentDataResolver;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.setLazyLoadProperties();
        this.activeAgentNumber = this.data.AgentNumber;
        return Promise.resolve();
    }

    public onAgentNumberBlur(event: any): void {
        if (!this.isDataChanged(event)) {
            return;
        }
        if (event.currentTarget.value) {
            this.updateAgentDataByAgentNumber();
        } else {
            this.setupNewAgent();
        }
    }

    private setupNewAgent(): void {
        this.setupAgentData(new AgentDTO());
    }
    private isDataChanged(event: any): boolean {
        return event.currentTarget.value != this.data.AgentNumber;
    }
    private setLazyLoadProperties(): void {
        if (!this.data.Addresses_LazyLoad) {
            this.data.Addresses_LazyLoad = new Array<AddressDTO>();
        }
        if (!this.data.Phones_LazyLoad) {
            this.data.Phones_LazyLoad = new Array<PhoneDTO>();
        }

        AddressUtil.addAddressIfNotFound(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
        this.businessAddress = AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
        PhoneUtil.addPhoneIfNotFound(this.data.Phones_LazyLoad, PhoneTypes.WORK);
        this.workNumber = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.WORK);
        PhoneUtil.addPhoneIfNotFound(this.data.Phones_LazyLoad, PhoneTypes.FAX);
        this.faxNumber = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.FAX);
    }

    private agentDataExistCheck(): any {
        return !!this.data.PersonId;
    }

    private updateAgentDataByAgentNumber(): void {
        this._agentResolver.activeAgentNumber = this.activeAgentNumber;
        this._agentResolver.directResolve().then(result => {
            if (result == null || !result.PersonId) {
                this.resetEmptyAgentData(this.data);
            }
            this.setupAgentData(result);
            this.setFocusOn();
        });
    }

    private resetEmptyAgentData(agent: AgentDTO): void {
        if(agent != null)
        {
            agent.PersonId = null;
            agent.PartyId = null;
            agent.FirmName = '';
            agent.FirstName = '';
            agent.LastName = '';
            agent.MiddleName = '';
            agent.ProducerType = null;
            agent.TaxId = '';
            agent.Addresses_LazyLoad = null;
            agent.Phones_LazyLoad = null;
            agent.EmailAddress = '';
            agent.RoutingNumber = '';
            agent.CommissionOption = '';
            agent.CommissionSplit = null;
            agent.CommissionPct = '';
            agent.Level5Code = '';
            agent.Suffix = '';
            this.setLazyLoadProperties();
        }
    }
    private setupAgentData(agent: AgentDTO): void {
        this.changeManager.deleteObject(this.data);       
        Object.assign(this.data, agent);
        this.data.identifier = new Identifiable();
        this.data.AgentNumber = this.activeAgentNumber;
        this.setLazyLoadProperties();
        this.agentDataExist = this.agentDataExistCheck();
    }

    private setFocusOn(): void {
        const formInput = this.getFormInputs().find(formInput => formInput.control.name.startsWith("agentNumber_"));
        formInput.control.setFocus();
    }
}
