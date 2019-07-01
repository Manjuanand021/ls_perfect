import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataCollectionNames, CoverageDTO, InsuredDTO } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { NTree } from 'ls-core/service/load-bypk';

import { BasePolicyDataResolver, ApplicantListHelper } from 'business/policy/shared';
import { ApplicantCoveragesFieldsLoader } from './coverages/form';
import { ApplicantInfoDataInitializer } from 'business/policy/applicant/applicant-info-data.initializer';

@Injectable()
export class ApplicantInfoDataResolver extends BasePolicyDataResolver {
    private _applicantCoveragesFieldsLoader: ApplicantCoveragesFieldsLoader;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        applicantListHelper: ApplicantListHelper,
        applicantCoveragesFieldsLoader: ApplicantCoveragesFieldsLoader
    ) {
        super(injector);
        this._applicantCoveragesFieldsLoader = applicantCoveragesFieldsLoader;
        this._applicantListHelper = applicantListHelper;
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        return super.resolveData(route, state);
    }

    protected resolveAdditionalData(): Promise<any> {
        return super.resolveAdditionalData().then(result => {
            return this.loadFormFields().then(_ => {
                this.initData();
                return Promise.resolve(this.resolvedData);
            });
        });
    }

    private initData(): void {
        if (this.resolvedData && this.resolvedData.Insureds_LazyLoad) {
            const applicantInfoDataInitializer = new ApplicantInfoDataInitializer(this.getActiveApplicant());
            applicantInfoDataInitializer.initializeData();
        }
    }

    private getActiveApplicant(): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(this.resolvedData.Insureds_LazyLoad);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.PolicyCoverages, this.getCoverageLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Requirements, this.getRequirementLazyLoadTree());
        return this.lazyDataLoader.batchLoad(request);
    }

    private getLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            insuredDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Phones,
                DataCollectionNames.RelatedPolicies,
                DataCollectionNames.Medication,
                DataCollectionNames.MedicalConditions
            ]);
            const coveragesNode = insuredDTOLoadTree.AddChild(DataCollectionNames.Coverages);
            {
                coveragesNode.AddChildren([
                    DataCollectionNames.ImpairmentRestrictions,
                    DataCollectionNames.Amendments,
                    DataCollectionNames.Reinsurers,
                    DataCollectionNames.WorksheetRows,
                    DataCollectionNames.Beneficiaries,
                    DataCollectionNames.FundAllocations
                ]);
            }
            const applicationsNode = insuredDTOLoadTree.AddChild(DataCollectionNames.Applications);
            {
                applicationsNode.AddChildren([DataCollectionNames.TobaccoUses, DataCollectionNames.FamilyHistories]);
            }
            const partyRelationsNode = insuredDTOLoadTree.AddChild(DataCollectionNames.Relations);
            {
                partyRelationsNode.AddChildren([DataCollectionNames.Addresses, DataCollectionNames.Phones]);
            }
        }
        return insuredDTOLoadTree;
    }

    private getCoverageLazyLoadTree(): NTree<string> {
        const coveragesDTOLoadTree = new NTree<string>(DataCollectionNames.PolicyCoverages);
        {
            const benefitsNode = coveragesDTOLoadTree.AddChild(DataCollectionNames.Benefits);
            {
                benefitsNode.AddChildren([DataCollectionNames.BenefitParties]);
            }
        }
        return coveragesDTOLoadTree;
    }

    private loadFormFields(): Promise<void> {
        return this._applicantCoveragesFieldsLoader.load(this.getAllInsuredCoverages(), this.policy);
    }

    private getAllInsuredCoverages(): Array<CoverageDTO> {
        const coverages: Array<CoverageDTO> = [];
        this.policy.Insureds_LazyLoad.forEach(insured => {
            coverages.push(...insured.Coverages_LazyLoad);
        });
        return coverages;
    }

    private getRequirementLazyLoadTree(): NTree<string> {
        const requirementDTOLoadTree = new NTree<string>(DataCollectionNames.Requirements);
        {
            requirementDTOLoadTree.AddChildren([DataCollectionNames.EvidenceStatuses]);
        }

        return requirementDTOLoadTree;
    }
}
