import { Component, Injector, Type } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { IComponentResolver, ComponentMap, ComponentResolver } from 'life-core/util';

import { BeneficiaryDTO, PartyTypes } from 'ls-core/model';

import { BeneficiaryPersonComponent } from './type/person/beneficiary-person.component';
import { BeneficiaryEstateComponent } from './type/estate/beneficiary-estate.component';
import { BeneficiaryCompanyComponent } from './type/company/beneficiary-company.component';
import { BeneficiaryPartnershipComponent } from './type/partnership/beneficiary-partnership.component';
import { BeneficiaryType } from '../beneficiary-item-factory';
import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

const IndicatorTypes = {
    IrrevocableIndicator: -1,
    RevocableIndicator: 0
};

@Component({
    selector: 'beneficiary-detail-editor',
    templateUrl: './beneficiary-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
export class BeneficiaryDialogDetailEditor extends BasePolicyDialogDetailViewModel<BeneficiaryDTO> {
    public itemComponentType: Type<any>;
    private _componentMapResolver: IComponentResolver<string>;

    constructor(injector: Injector) {
        super(injector);
        this._componentMapResolver = this.getComponentMapResolver();
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.setComponentType();
        this.setIrrevocableIndicator();
        return Promise.resolve();
    }

    public onPartyTypeChange(type: any): void {
        this.form.reset({
            irrevocableFlag: IndicatorTypes.RevocableIndicator,
            benefitType: BeneficiaryType.DeathBenefit,
            beneficiaryType: BeneficiaryType.Primary,
            partyType: type.value
        });
        this.setItemComponentType(type.value);
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(PartyTypes.PERSON, BeneficiaryPersonComponent);
        componentMap.add(PartyTypes.ESTATE, BeneficiaryEstateComponent);
        componentMap.add(PartyTypes.TRUST, BeneficiaryEstateComponent);
        componentMap.add(PartyTypes.COMPANY, BeneficiaryCompanyComponent);
        componentMap.add(PartyTypes.PARTNERSHIP, BeneficiaryPartnershipComponent);
        return new ComponentResolver<string>(componentMap);
    }

    private setItemComponentType(type: string): void {
        this.itemComponentType = this._componentMapResolver.resolve(type);
    }

    private setComponentType(): void {
        if (!this.data.PersonTypeId) {
            this.setItemComponentType(PartyTypes.PERSON);
        } else {
            this.setItemComponentType(this.data.PersonTypeId);
        }
    }

    private setIrrevocableIndicator(): void {
        this.data.IrrevokableIndicator =
            this.data.IrrevokableIndicator == IndicatorTypes.IrrevocableIndicator
                ? IndicatorTypes.IrrevocableIndicator
                : IndicatorTypes.RevocableIndicator;
    }
}
