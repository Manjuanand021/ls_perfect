import { Component, Injector, Injectable, Type } from '@angular/core';

import { OptionalSectionViewModel } from 'life-core/component/optional-section';
import { I18n } from 'life-core/i18n';

import { PolicySubscriber } from 'ls-core/session';

import { Identifiable, AddressDTO, AddressTypes, EmployerDTO, PhoneDTO, PhoneTypes } from 'ls-core/model';
import { EmployerInfoComponent } from './info/case-employer-info.component';
import { EmployerDataResolver } from './case-employer-data.resolver';

@Component({
    selector: 'case-employer',
    templateUrl: './case-employer.component.html',
    providers: [PolicySubscriber]
})
@Injectable()
export class EmployerComponent extends OptionalSectionViewModel<EmployerDTO> {
    private _employerResolver: EmployerDataResolver;
    constructor(injector: Injector, policySubscriber: PolicySubscriber, i18n: I18n, resolver: EmployerDataResolver) {
        super(injector);
        this.i18n = i18n;
        this._employerResolver = resolver;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
            if (this.data.policy.EmployerId) {
                this.resolveEmployerData();
            }
        });
    }

    private resolveEmployerData(): void {
        this._employerResolver.directResolve().then(result => {
            this.data.Employer = result;
            this.updateProperties();
        });
    }

    protected getItemComponentType(): Type<any> {
        return EmployerInfoComponent;
    }

    protected getItem(): EmployerDTO {
        return this.data.Employer;
    }

    protected executeCreateItem(): void {
        const employer = new EmployerDTO();
        employer.identifier = new Identifiable();
        employer.PersonId = this.data.policy.EmployerId || '';
        const businessAddress = new AddressDTO();
        businessAddress.AddressTypeCode = AddressTypes.BUSINESS;
        employer.Addresses_LazyLoad = [businessAddress];
        const workPhone = new PhoneDTO();
        workPhone.PhoneTypeCode = PhoneTypes.WORK;
        employer.Phones_LazyLoad = [workPhone];
        this.data.Employer = employer;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Employer', id: 'policy.case.employer.title' });
    }

    //fake item, no need to delete on server
    protected updateDeletedObjectArray(item: EmployerDTO): void {}

    protected executeRemoveItem(): void {
        this.data.Employer = null;
        this.data.policy.EmployerId = null;
        this.changeManager.setIsDirty(true);
    }
}
