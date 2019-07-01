import { Injector, Component, Type } from '@angular/core';

import { I18n } from 'life-core/i18n';

import { PolicySubscriber, AppSession } from 'ls-core/session';
import { Identifiable, PayorDTO, PolicyDTO, AddressTypes, AddressDTO } from 'ls-core/model';
import { OptionalSectionViewModel } from 'life-core/component/optional-section';
import { PayorInfoComponent } from 'business/policy/case/payor/payor-info.component';

@Component({
    selector: 'payor-list',
    templateUrl: './payor-list.component.html',
    styleUrls: ['payor-list.component.css'],
    providers: [PolicySubscriber]
})
export class PayorListComponent extends OptionalSectionViewModel<PayorDTO> {
    public policy: PolicyDTO;

    private _appSession: AppSession;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, i18n: I18n, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
        this.i18n = i18n;
    }

    protected setupData(): void {
        this.updateProperties();
    }

    protected getItemComponentType(): Type<any> {
        return PayorInfoComponent;
    }

    protected getItem(): PayorDTO {
        return this._appSession.policyDTO.Payors_LazyLoad && this._appSession.policyDTO.Payors_LazyLoad.length > 0
            ? this._appSession.policyDTO.Payors_LazyLoad[0]
            : null;
    }

    protected executeRemoveItem(): void {
        this._appSession.policyDTO.Payors_LazyLoad = [];
    }

    protected executeCreateItem(): void {
        const payorDTO = new PayorDTO();
        payorDTO.identifier = new Identifiable();
        payorDTO.isPrimaryInsured = false;
        payorDTO.PersonTypeId = 'Person';
        payorDTO.PolicyPersonId = this.data.policy.PolicyPersonId || '';
        const residentAddress = new AddressDTO();
        residentAddress.AddressTypeCode = AddressTypes.RESIDENCE;
        payorDTO.Addresses_LazyLoad = [residentAddress];
        this._appSession.policyDTO.Payors_LazyLoad = [payorDTO];
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Payor', id: 'policy.case.payor.title' });
    }
}
