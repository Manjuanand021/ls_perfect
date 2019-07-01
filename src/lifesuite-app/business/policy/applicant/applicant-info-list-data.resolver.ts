import { Injector, Injectable } from '@angular/core';

import { AppSession } from 'ls-core/session/app-session';
import {
    AddressDTO,
    ApplicationInfoDTO,
    TobaccoUseDTO,
    InsuredDTO,
    RelatedPolicyDTO,
    FamilyHistoryDTO,
    BeneficiaryDTO,
    FundAllocationDTO,
    BenefitDTO,
    PolicyDTO
} from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListMap } from 'life-core/model';
import { ObjectUtil } from 'life-core/util/lang';

import { ApplicantListHelper } from 'business/policy/shared';
import { ApplicantInfoListDataInitializer } from './applicant-info-list-data.initializer';

@Injectable()
export class ApplicantInfoListDataResolver extends BaseListDataResolver {
    private _appSession: AppSession;
    private _applicantListHelper: ApplicantListHelper;

    constructor(injector: Injector, appSession: AppSession, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._appSession = appSession;
        this._applicantListHelper = applicantListHelper;
    }

    protected loadData(): Promise<ListMap<ListDataItem>> {
        this.initListData();
        return super.loadData();
    }

    private initListData(): void {
        const applicantInfoListInitializer = new ApplicantInfoListDataInitializer(this.getActiveApplicant());
        applicantInfoListInitializer.initializeData();
    }

    private getActiveApplicant(): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
    }

    protected getListsDataRequest(): ListsDataRequest {
        const applicant = ObjectUtil.createObjectOfType<InsuredDTO>(
            this.getActiveApplicant(),
            InsuredDTO
        ) as InsuredDTO;

        const applicationInfo = ObjectUtil.createObjectOfType<ApplicationInfoDTO>(
            applicant.Applications_LazyLoad[0],
            ApplicationInfoDTO
        ) as ApplicationInfoDTO;

        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(applicant);

        this.addApplicantInformationDataListRequestItems(applicant, applicationInfo, listDataRequestBuilder);
        this.addPersonalInfoDataListRequestItems(applicant, applicationInfo, listDataRequestBuilder);
        this.addFinancialDataListRequestItems(applicationInfo, listDataRequestBuilder);
        this.addPhysicianInformationDataListRequestItems(listDataRequestBuilder);
        this.addOtherInsuranceCasesDataListRequestItems(listDataRequestBuilder);
        this.addFamilyHistoryListRequestItems(listDataRequestBuilder);
        this.addBeneficiaryListRequestItems(listDataRequestBuilder);
        this.addFundsListRequestItems(listDataRequestBuilder);
        this.addBenefitListRequestItems(listDataRequestBuilder);
        return listDataRequestBuilder.getRequest();
    }

    // Applicant Info
    private addApplicantInformationDataListRequestItems(
        applicant: InsuredDTO,
        applicationInfo: ApplicationInfoDTO,
        listDataRequestBuilder: ListDataRequestBuilder
    ): void {
        const addressInfo = ObjectUtil.createObjectOfType<AddressDTO>(
            applicant.Addresses_LazyLoad[0],
            AddressDTO
        ) as AddressDTO;

        listDataRequestBuilder.addListRequestItem(applicant, 'Title');
        listDataRequestBuilder.addListRequestItem(applicant, 'Suffix');
        listDataRequestBuilder.addListRequestItem(applicant, 'preferredPhoneTypeCode');
        listDataRequestBuilder.addListRequestItem(applicant, 'SignedCountryId');
        listDataRequestBuilder.addListRequestItem(applicant, 'SignedStateId');
        listDataRequestBuilder.addListRequestItem(applicant, 'applicantSignatureType');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'DriversLicenseCountryId');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'DriversLicenseState');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'DriversLicenseStatus');
        listDataRequestBuilder.addListRequestItem(addressInfo, 'CountryId');
    }

    // Coverages

    // Personal Information
    private addPersonalInfoDataListRequestItems(
        applicant: InsuredDTO,
        applicationInfo: ApplicationInfoDTO,
        listDataRequestBuilder: ListDataRequestBuilder
    ): void {
        const tobaccoUseInfo = ObjectUtil.createObjectOfType<TobaccoUseDTO>(
            applicant.Applications_LazyLoad[0].TobaccoUses_LazyLoad[0],
            TobaccoUseDTO
        ) as TobaccoUseDTO;

        listDataRequestBuilder.addListRequestItem(applicant, 'Sex');
        listDataRequestBuilder.addListRequestItem(applicant, 'MaritalStatus');
        listDataRequestBuilder.addListRequestItem(tobaccoUseInfo, 'TobaccoUseId');
        listDataRequestBuilder.addListRequestItem(tobaccoUseInfo, 'TobaccoTypeId');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'CitizenshipType');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'CitizenshipCountryId');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'ResidenceCountry');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'BirthCountry');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'BirthState');
    }

    // Financial Data
    private addFinancialDataListRequestItems(
        applicationInfo: ApplicationInfoDTO,
        listDataRequestBuilder: ListDataRequestBuilder
    ): void {
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'BusinessType');
        listDataRequestBuilder.addListRequestItem(applicationInfo, 'Occupation');
    }

    // Physician Information
    private addPhysicianInformationDataListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        // These _addressInfo lists are already loaded in addApplicantInformationDataListRequestItems().
        // Should this use partyRelation.Addresses_LazyLoad?
        //listDataRequestBuilder.addListRequestItem(this._addressInfo, 'CountryId');
        //listDataRequestBuilder.addListRequestItem(this._addressInfo, 'CountryStateId');
    }

    //Other Insurance Cases and Policy
    private addOtherInsuranceCasesDataListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const relatedPolicy: RelatedPolicyDTO = new RelatedPolicyDTO();
        listDataRequestBuilder.addListRequestItem(relatedPolicy, 'Status');
        listDataRequestBuilder.addListRequestItem(relatedPolicy, 'LineOfBusiness');
        listDataRequestBuilder.addListRequestItem(relatedPolicy, 'PurposeOfCoverage');
        listDataRequestBuilder.addListRequestItem(relatedPolicy, 'ReplacementType');
    }

    private addBenefitListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const planCodes = new Array();
        this.policy.PolicyCoverages_LazyLoad.forEach(coverage => {
            if (planCodes.indexOf(coverage.PlanCodeId) < 0) {
                planCodes.push(coverage.PlanCodeId);
            }
        });
        let benefit: BenefitDTO;
        planCodes.forEach(code => {
            benefit = new BenefitDTO();
            benefit.Note = code;
            listDataRequestBuilder.setRootDTO(this.policy);
            listDataRequestBuilder.addListRequestItem(benefit, 'BenefitId_' + code);
        });
    }

    // Familiy History
    public addFamilyHistoryListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const familyHistoryDTO = new FamilyHistoryDTO();
        listDataRequestBuilder.addListRequestItem(familyHistoryDTO, 'FamhistRelationshipCode');
        listDataRequestBuilder.addListRequestItem(familyHistoryDTO, 'LivingStatus');
    }
    // Other Sections
    //	...
    public addBeneficiaryListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const beneficiaryDTO = new BeneficiaryDTO();
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'PersonTypeId');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'RelationshipToInsuredCode');
        listDataRequestBuilder.addListRequestItem(beneficiaryDTO, 'BeneficiaryType');
    }

    public addFundsListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const fundAllocationDTO = new FundAllocationDTO();
        listDataRequestBuilder.addListRequestItem(fundAllocationDTO, 'FundAllocationId');
        listDataRequestBuilder.addListRequestItem(fundAllocationDTO, 'FundCode');
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
