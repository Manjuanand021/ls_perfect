import { Component, Injector, Injectable, Type } from '@angular/core';

import { OptionalSectionViewModel } from 'life-core/component/optional-section';
import { I18n } from 'life-core/i18n';

import { PolicySubscriber } from 'ls-core/session';
import { AppSession } from 'ls-core/session/app-session';
import { Identifiable, AddressDTO, AddressTypes, AgencyDTO, PhoneDTO, PhoneTypes } from 'ls-core/model';

import { AgencyInfoComponent } from './agency-info.component';

@Component({
    selector: 'agency',
    templateUrl: './agency.component.html',
    providers: [PolicySubscriber]
})
@Injectable()
export class AgencyComponent extends OptionalSectionViewModel<AgencyDTO> {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this._appSession = appSession;
        this.updateProperties();
    }

    protected getItemComponentType(): Type<any> {
        return AgencyInfoComponent;
    }

    protected getItem(): AgencyDTO {
        return this._appSession.policyDTO.Agencies_LazyLoad && this._appSession.policyDTO.Agencies_LazyLoad.length > 0
            ? this._appSession.policyDTO.Agencies_LazyLoad[0]
            : this.data.AgencyData;
    }

    protected executeCreateItem(): void {
        const agency = new AgencyDTO();
        agency.identifier = new Identifiable();
        agency.PersonId =
            this._appSession.policyDTO.Agencies_LazyLoad && this._appSession.policyDTO.Agencies_LazyLoad.length > 0
                ? this._appSession.policyDTO.Agencies_LazyLoad[0].PersonId
                : null;
        const businessAddress = new AddressDTO();
        businessAddress.AddressTypeCode = AddressTypes.BUSINESS;
        agency.Addresses_LazyLoad = [businessAddress];
        const workPhone = new PhoneDTO();
        workPhone.PhoneTypeCode = PhoneTypes.WORK;
        agency.Phones_LazyLoad = [workPhone];
        this.data.AgencyData = agency;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Agency', id: 'policy.case.agency.title' });
    }

    protected executeRemoveItem(): void {
        this._appSession.policyDTO.Agencies_LazyLoad = [];
        this.data.AgencyData = null;
    }
}

export const componentName = 'Agency';
