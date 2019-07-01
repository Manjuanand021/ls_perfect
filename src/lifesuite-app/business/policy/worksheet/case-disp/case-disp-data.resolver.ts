import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames, CoverageDTO } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { NTree } from 'ls-core/service/load-bypk';
import { BasePolicyDataResolver } from 'business/policy/shared';
import { WorksheetCoverageFormFieldsLoader } from 'business/policy/worksheet/case-disp/coverage/form';

@Injectable()
export class CaseDispositionDataResolver extends BasePolicyDataResolver {
    private _worksheetCoverageFormFieldsLoader: WorksheetCoverageFormFieldsLoader;

    constructor(injector: Injector, worksheetCoverageFormFieldsLoader: WorksheetCoverageFormFieldsLoader) {
        super(injector);
        this._worksheetCoverageFormFieldsLoader = worksheetCoverageFormFieldsLoader;
    }

    protected resolveAdditionalData(): Promise<any> {
        return super.resolveAdditionalData().then(result => {
            return this.loadFormFields().then(_ => {
                return Promise.resolve(this.resolvedData);
            });
        });
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.PolicyCoverages, this.getCoverageLazyLoadTree());
        return this.lazyDataLoader.batchLoad(request);
    }

    private getLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            const coveragesNode = insuredDTOLoadTree.AddChild(DataCollectionNames.Coverages);
            {
                coveragesNode.AddChildren([
                    DataCollectionNames.ImpairmentRestrictions,
                    DataCollectionNames.Amendments,
                    DataCollectionNames.Reinsurers,
                    DataCollectionNames.WorksheetRows
                ]);
            }

            insuredDTOLoadTree.AddChildren([DataCollectionNames.Medication, DataCollectionNames.MedicalConditions]);
        }

        return insuredDTOLoadTree;
    }

    private getCoverageLazyLoadTree(): NTree<string> {
        const policyCoveragesDTOLoadTree = new NTree<string>(DataCollectionNames.PolicyCoverages);
        {
            policyCoveragesDTOLoadTree.AddChild(DataCollectionNames.Benefits);
        }
        return policyCoveragesDTOLoadTree;
    }

    private loadFormFields(): Promise<void> {
        return this._worksheetCoverageFormFieldsLoader.load(this.getAllInsuredCoverages(), this.policy);
    }

    private getAllInsuredCoverages(): Array<CoverageDTO> {
        const coverages: Array<CoverageDTO> = [];
        this.policy.Insureds_LazyLoad.forEach(insured => {
            coverages.push(...insured.Coverages_LazyLoad);
        });
        return coverages;
    }
}
