import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { RequirementComponent } from './requirement.component';
import { TabViewRequirementDetailComponent } from './detail/tab/tab-view-requirement-detail.component';
import { RequirementDetailBasicInfo } from './detail/requirement-detail-basic-info.component';
import { RequirementDetailProvidersInfo } from './detail/requirement-detail-providers-info.component';
import { CreateRequirementDetail } from './create-requirement-detail';
import { RequirementDataResolver } from './requirement-data.resolver';
import { RequirementMetaDataResolver } from './requirement-meta-data.resolver';
import { RequirementListDataResolver } from './requirement-list-data.resolver';
import {
    MedicalProviderSearchComponent,
    MedicalSearchMetaDataResolver,
    MedicalProviderListComponent,
    PhysicianNameComponent,
    PhysicianFacilityNameComponent,
    PhysicianAssociatedWithFacilityComponent,
    RequirementDetailProvidersInfoMetaDataResolver
} from './detail';
import { RequirementHistoryComponent, RequirementHistoryMetaDataResolver } from 'business/policy/requirements/history';
import { RequirementMatchComponent } from 'business/policy/requirements/match';
import { EvidenceStatusListComponent } from 'business/policy/requirements/history/evidence-status-list';
import { SaveMatchRequirementDataDelegate } from './save-match-requirement-data.delegate';
import { SaveUnmatchRequirementDataDelegate } from './save-unmatch-requirement-data.delegate';
import { RequirementDeactivateGuard } from './requirement-deactivate.guard';
import { RequirementTypes } from 'business/policy/requirements/requirement.type';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        RequirementComponent,
        TabViewRequirementDetailComponent,
        RequirementDetailBasicInfo,
        RequirementDetailProvidersInfo,
        CreateRequirementDetail,
        MedicalProviderSearchComponent,
        MedicalProviderListComponent,
        PhysicianNameComponent,
        PhysicianFacilityNameComponent,
        PhysicianAssociatedWithFacilityComponent,
        RequirementHistoryComponent,
        RequirementMatchComponent,
        EvidenceStatusListComponent
    ],
    providers: [
        RequirementDataResolver,
        RequirementMetaDataResolver,
        RequirementListDataResolver,
        MedicalSearchMetaDataResolver,
        SaveMatchRequirementDataDelegate,
        SaveUnmatchRequirementDataDelegate,
        RequirementHistoryMetaDataResolver,
        RequirementDeactivateGuard,
        RequirementTypes,
        RequirementDetailProvidersInfoMetaDataResolver
    ],
    entryComponents: [
        TabViewRequirementDetailComponent,
        CreateRequirementDetail,
        MedicalProviderSearchComponent,
        MedicalProviderListComponent,
        PhysicianNameComponent,
        PhysicianFacilityNameComponent,
        PhysicianAssociatedWithFacilityComponent,
        RequirementHistoryComponent,
        RequirementMatchComponent,
        EvidenceStatusListComponent
    ]
})
export class RequirementModule {}
