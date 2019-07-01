import { Component, Injector, Injectable } from '@angular/core';
import { ViewModel } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { PolicyDTO } from 'ls-core/model/dto';
import { PolicySubscriber } from 'ls-core/session';
import { MetadataUtil } from 'ls-core/util';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { PolicyDataModel } from 'business/policy/shared/data-model';
import { ConvertUtil } from 'life-core/util/lang';

const CaseInfoSectionsIdMap: { [sectionName: string]: string } = {
    EmployerSection: 'CaseDisplayEmployer',
    AgencySection: 'CaseDisplayAgency',
    AgentSection: 'CaseDisplayAgent',
    OwnerSection: 'CaseDisplayOwner',
    PayorSection: 'CaseDisplayPayor',
    TPASection: 'CaseDisplayTPA',
    AssociationSection: 'CaseDisplayAssociation'
};
@Component({
    selector: 'case-info',
    templateUrl: './case-info.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }]
})
@Injectable()
export class CaseInfoComponent extends ViewModel<PolicyDataModel> {
    public sectionsVisibleMap: { [sectionName: string]: boolean };

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
        this.sectionsVisibleMap = {};
    }
    protected setupData(): void {
        this.setResolvedMetaData();
        this.setSectionsVisibility();
    }
    public setSectionsVisibility(): void {
        Object.keys(CaseInfoSectionsIdMap).forEach(key => {
            const isSectionVisible = MetadataUtil.getItemLabelByCode(
                this.listData['system'],
                CaseInfoSectionsIdMap[key]
            );
            this.sectionsVisibleMap[key] = isSectionVisible && ConvertUtil.toBoolean(isSectionVisible);
        });
    }
    public loadData(): Promise<void> {
        return Promise.resolve();
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
