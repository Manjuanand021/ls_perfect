import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabPolicyModule } from './tab/tab-policy.module';
import { WorksheetModule } from './worksheet/worksheet.module';
import { NotesModule } from './note/notes.module';
import { CaseModule } from './case/case.module';
import { RequirementModule } from './requirements/requirement.module';
import { EvidenceModule } from './evidence/evidence.module';
import { PolicyRoutingModule } from './policy-routing.module';
import { ApplicantModule } from './applicant/applicant.module';
import { OpenViewNotesHandler } from 'business/policy/shared';
import { PolicyQuickInfoPanelModule } from './policy-quick-info-panel';
import { RelatedCasesModule } from './related-cases/related-cases.module';
import { CaseDocumentsModule } from './documents';
import { CaseLogModule } from 'business/policy/case-log/case-log.module';
import { ScratchPadModule } from 'business/policy/scratch-pad/scratch-pad.module';
import { PolicyInSessionUpdater } from 'ls-core/session';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicyViewModelChangeManager } from 'business/policy/shared';
import { ViewModelChangeManager } from 'life-core/view-model';
import { RefreshPolicyHandler } from 'business/policy/shared/refresh-policy/refresh-policy.handler';
import { RefreshPolicyDataResolver } from 'business/policy/shared/refresh-policy/refresh-policy-data.resolver';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WorksheetModule,
        NotesModule,
        CaseModule,
        RequirementModule,
        EvidenceModule,
        TabPolicyModule,
        PolicyRoutingModule,
        ApplicantModule,
        PolicyQuickInfoPanelModule,
        RelatedCasesModule,
        CaseDocumentsModule,
        CaseLogModule,
        ScratchPadModule
    ],
    providers: [
        OpenViewNotesHandler,
        PolicyInSessionUpdater,
        SavePolicyDataDelegate,
        RefreshPolicyHandler,
        RefreshPolicyDataResolver,
        { provide: ViewModelChangeManager, useClass: PolicyViewModelChangeManager }
    ]
})
export class PolicyModule {}
