import { Component, Injector, Injectable, Type } from '@angular/core';

import { OptionalSectionViewModel } from 'life-core/component/optional-section';
import { I18n } from 'life-core/i18n';

import { PolicySubscriber } from 'ls-core/session';
import { Identifiable, AddressDTO, AddressTypes, TPADTO, PhoneDTO, PhoneTypes } from 'ls-core/model';

import { TPAInfoComponent } from './info/tpa-info.component';

import { TPADataResolver } from './tpa-data.resolver';

@Component({
    selector: 'tpa',
    templateUrl: './tpa.component.html',
    providers: [PolicySubscriber]
})
@Injectable()
export class TPAComponent extends OptionalSectionViewModel<TPADTO> {
    private _tpaResolver: TPADataResolver;
    constructor(injector: Injector, policySubscriber: PolicySubscriber, i18n: I18n, resolver: TPADataResolver) {
        super(injector);
        this.i18n = i18n;
        this._tpaResolver = resolver;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
            if (this.isTPAExist()) {
                this.resolveTPAData();
            }
        });
    }

    protected getItemComponentType(): Type<any> {
        return TPAInfoComponent;
    }

    protected getItem(): TPADTO {
        return this.data.TPA;
    }

    private resolveTPAData(): void {
        this._tpaResolver.directResolve().then(result => {
            this.data.TPA = result;
            this.updateProperties();
        });
    }

    protected executeCreateItem(): void {
        const tpa = new TPADTO();
        tpa.identifier = new Identifiable();
        tpa.TpaCode = this.data.policy.TpaCode || '';
        const businessAddress = new AddressDTO();
        businessAddress.AddressTypeCode = AddressTypes.BUSINESS;
        tpa.Addresses_LazyLoad = [businessAddress];
        const workPhone = new PhoneDTO();
        workPhone.PhoneTypeCode = PhoneTypes.WORK;
        tpa.Phones_LazyLoad = [workPhone];
        this.data.TPA = tpa;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Third Party Administrator', id: 'policy.case.tpa.title' });
    }

    //fake item, no need to delete on server
    protected updateDeletedObjectArray(item: TPADTO): void {}

    protected executeRemoveItem(): void {
        this.data.TPA = null;
        this.data.policy.TpaCode = null;
        this.changeManager.setIsDirty(true);
    }

    private isTPAExist(): boolean {
        return this.data.policy.TpaCode;
    }
}
