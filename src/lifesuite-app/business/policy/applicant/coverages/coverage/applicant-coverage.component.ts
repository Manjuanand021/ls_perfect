import { Component, Input, Injector, forwardRef } from '@angular/core';

import { AuthorizationProvider, AuthorizationProviderHost } from 'life-core/authorization';
import { FormLayoutConfig } from 'life-core/component/dynamic-form';

import { LsDynamicFormViewModel } from 'ls-core/component/dynamic-form';
import { CoverageDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { CoverageFormDataBuilder } from 'business/policy/shared/coverage-dynamic-form';
import { PlanApplicantCoverageFormFields } from 'business/policy/applicant/coverages/form';

import { ApplicantCoverageAuthorizationProvider } from './applicant-coverage-authorization.provider';
import { SectionAvailabilityHelper } from 'business/policy/shared';
import { LsRadioButtonValues } from 'ls-core/component/input';

@Component({
    selector: 'ls-applicant-coverage',
    templateUrl: './applicant-coverage.component.html',
    providers: [
        PolicySubscriber,
        { provide: AuthorizationProvider, useClass: ApplicantCoverageAuthorizationProvider },
        { provide: AuthorizationProviderHost, useExisting: forwardRef(() => ApplicantCoverageComponent) }
    ]
})
export class ApplicantCoverageComponent extends LsDynamicFormViewModel implements AuthorizationProviderHost {
    @Input() public coverage: CoverageDTO;
    @Input() public index: string;
    public formLayoutConfig: FormLayoutConfig = {
        fieldsPerRow: 4
    };
    public panelHeader: string;
    public showBenefitSection: boolean;
    public showBeneficiarySection: boolean;
    public showFundsSection: boolean;

    public DEFAULT_AMOUNT: number = 0;

    private _policy: PolicyDTO;
    private _planApplicantCoverageFormFields: PlanApplicantCoverageFormFields;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        planApplicantCoverageFormFields: PlanApplicantCoverageFormFields
    ) {
        super(injector);
        this._planApplicantCoverageFormFields = planApplicantCoverageFormFields;
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
    }

    public getAuthorizationProviderContext(): CoverageDTO {
        return this.coverage;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return super.loadData();
    }

    protected setupData(): void {
        this.setSectionsVisibility();
        this.setPanelHeader();
    }

    protected setFormFields(): Promise<void> {
        this.formFields = this.copyFormFields(
            this._planApplicantCoverageFormFields.get(this.coverage.PlanCodeId.toUpperCase())
        );
        return Promise.resolve();
    }

    protected setFormData(): void {
        this.setDefaultDataForCoverage();
        this.formData = CoverageFormDataBuilder.build(this._policy, this.coverage);
    }

    private setDefaultDataForCoverage(): void {
        this.coverage.Amount = this.coverage.Amount || this.DEFAULT_AMOUNT;
        this.coverage.OwnOcc = this.coverage.OwnOcc || LsRadioButtonValues.NO_NUMBER;
        this.coverage.PastCoverageIndicator = this.coverage.PastCoverageIndicator || LsRadioButtonValues.NO_NUMBER;
        this.coverage.PlannedPremium = this.coverage.PlannedPremium || this.DEFAULT_AMOUNT;
        this.coverage.WebQuotedClass = this.coverage.WebQuotedClass || this.DEFAULT_AMOUNT.toString();
        this.coverage.Cola = this.coverage.Cola || LsRadioButtonValues.NO_NUMBER;
        this.coverage.ExchangeFlag = this.coverage.ExchangeFlag || LsRadioButtonValues.NO_NUMBER;
    }

    private setSectionsVisibility(): void {
        const coverageLineOfBusiness = this.getCoverageLineOfBusiness();
        this.showBeneficiarySection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.coverage_section_configuration,
            coverageLineOfBusiness,
            CoverageSections.Beneficiary
        );
        this.showBenefitSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.coverage_section_configuration,
            coverageLineOfBusiness,
            CoverageSections.Benefit
        );
        this.showFundsSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.coverage_section_configuration,
            coverageLineOfBusiness,
            CoverageSections.Funds
        );
    }

    private getCoverageLineOfBusiness(): string {
        return this.getPlanCode().externalCode.toLowerCase();
    }

    private getPlanCode(): any {
        return this.listData.plan_code.find(plan => plan.value.toUpperCase() == this.coverage.PlanCodeId.toUpperCase());
    }
    private setPanelHeader(): void {
        this.panelHeader = this.getPlanCode().label;
    }
}

const CoverageSections = {
    Beneficiary: 'beneficiary',
    Benefit: 'benefit',
    Funds: 'funds'
};
