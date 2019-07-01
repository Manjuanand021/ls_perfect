import { Component, Injector, Injectable, Type } from '@angular/core';

import { OptionalSectionViewModel } from 'life-core/component/optional-section';
import { I18n } from 'life-core/i18n';

import { PolicySubscriber } from 'ls-core/session';
import { Identifiable, AddressDTO, AddressTypes, AssociationDTO, PhoneDTO, PhoneTypes } from 'ls-core/model';

import { AssociationInfoComponent } from 'business/policy/case/association/case-association-info.component';
import { AssociationDataResolver } from './case-association-data.resolver';

@Component({
    selector: 'case-association',
    templateUrl: './case-association.component.html',
    providers: [PolicySubscriber]
})
@Injectable()
export class AssociationComponent extends OptionalSectionViewModel<AssociationDTO> {
    private _associationResolver: AssociationDataResolver;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        i18n: I18n,
        associationDataResolver: AssociationDataResolver
    ) {
        super(injector);
        this.i18n = i18n;
        this._associationResolver = associationDataResolver;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
            if (this.data.policy.AssociationCode) {
                this.resolveAssociationData();
            }
        });
    }

    private resolveAssociationData(): void {
        this._associationResolver.directResolve().then(result => {
            this.data.Association = result;
            this.updateProperties();
        });
    }

    protected getItemComponentType(): Type<any> {
        return AssociationInfoComponent;
    }

    protected getItem(): AssociationDTO {
        return this.data.Association;
    }

    protected executeCreateItem(): void {
        const association = new AssociationDTO();
        association.identifier = new Identifiable();
        association.CompanyCode = this.data.policy.AssociationCode || '';
        const businessAddress = new AddressDTO();
        businessAddress.AddressTypeCode = AddressTypes.BUSINESS;
        association.Addresses_LazyLoad = [businessAddress];
        const workPhone = new PhoneDTO();
        workPhone.PhoneTypeCode = PhoneTypes.WORK;
        association.Phones_LazyLoad = [workPhone];
        this.data.Association = association;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Association', id: 'policy.case.association.title' });
    }

    //fake item, no need to delete on server
    protected updateDeletedObjectArray(item: AssociationDTO): void {}

    protected executeRemoveItem(): void {
        this.data.policy.AssociationCode = null;
        this.data.Association = null;
        this.changeManager.setIsDirty(true);
    }
}
