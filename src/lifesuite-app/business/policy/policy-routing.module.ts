import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { ResetFormDeactivateGuard, CanDeactivateGuard } from 'life-core/view-model/validation';
import { RoutePath } from 'life-core/routing';
import { LsRoutePath } from 'ui/routing';
import { LsResolveUtil } from 'ls-core/routing';

// POLICY TAB
import { TabPolicyComponent } from 'business/policy/tab/tab-policy.component';
import { BasePolicyDataResolver, TabPolicyDataResolver } from 'business/policy/shared';

// Worksheet
import { TabViewWorksheetComponent } from 'business/policy/worksheet/tab/tabview-worksheet.component';
import {
    CaseDispositionComponent,
    CaseDispositionDataResolver,
    CaseDispositionListDataResolver,
    CaseDispositionMetaDataResolver
} from 'business/policy/worksheet/case-disp';
import { ReviewMessagesComponent } from 'business/policy/worksheet/review-messages/review-messages.component';
import { ReviewMessagesDataResolver } from 'business/policy/worksheet/review-messages/review-messages-data.resolver';

import {
    DebitCreditComponent,
    DebitCreditDataResolver,
    DebitCreditMetaDataResolver
} from 'business/policy/worksheet/debit-credit';

// Notes
import { CaseNotesComponent, UWNotesComponent, NotesDataResolver, NotesMetaDataResolver } from 'business/policy/note';

// CaseInfo
import { CaseInfoComponent, CaseDataResolver, CaseListDataResolver, CaseMetaDataResolver } from 'business/policy/case/';

// Requirement
import {
    RequirementComponent,
    RequirementDataResolver,
    RequirementMetaDataResolver,
    RequirementListDataResolver
} from 'business/policy/requirements';

// Documents
import {
    CaseDocumentsComponent,
    CaseAttachmentsMetaDataResolver,
    CaseAttachmentsResolver,
    CaseAttachmentsComponent,
    CaseTemplatesMetaDataResolver
} from './documents';

// Evidence

import {
    EvidenceComponent,
    EvidenceDataResolver,
    EvidenceInfoDataInitializer,
    LabTabComponent,
    LabDataResolver,
    RxTabComponent,
    RxReportDataResolver,
    RxReportMetaDataResolver,
    RxReportLazyDataResolver,
    RxReportComponent,
    RxRulesComponent,
    RxOtherMedicationTabComponent,
    RxOtherMedicationMetaDataResolver,
    MIBTabComponent,
    MIBReportComponent,
    MIBCodingTabComponent,
    MIBReportDataResolver,
    MIBCodingDataResolver,
    MIBCodingMetaDataResolver,
    MVRTabComponent,
    ParamedicalTabComponent,
    ParamedicalDataResolver,
    TabViewEvidenceComponent,
    VelogicaDataResolver,
    VelogicaTabComponent,
    EvidenceMetaDataResolver
} from 'business/policy/evidence';

// Applicant
import { ApplicantInfoComponent } from 'business/policy/applicant/applicant-info.component';
import { ApplicantInfoDataResolver } from 'business/policy/applicant/applicant-info-data.resolver';
import { ApplicantInfoListDataResolver } from 'business/policy/applicant/applicant-info-list-data.resolver';
import { ApplicantDetailComponent } from 'business/policy/applicant/applicant-detail/applicant-detail.component';
import { MVRDataResolver } from 'business/policy/evidence/mvr';
import { RelatedCasesComponent } from 'business/policy/related-cases/';
import { RelatedCasesDataResolver } from 'business/policy/related-cases/related-cases-data.resolver';
import { MedicalConditionTabComponent } from 'business/policy/evidence/medical-condition//medical-condition-tab.component';
import { MedicalConditionDataResolver } from 'business/policy/evidence/medical-condition/medical-condition-data.resolver';
import { MedicalConditionMetaDataResolver } from 'business/policy/evidence/medical-condition/medical-condition-meta-data.resolver';
import { CaseTemplatesComponent } from 'business/policy/documents';
import { ApplicantMetaDataResolver } from 'business/policy/applicant/applicant-meta-data.resolver';
import {
    RequirementDetailBasicInfo,
    RequirementDetailProvidersInfo,
    RequirementDetailProvidersInfoMetaDataResolver
} from 'business/policy/requirements/detail';

const DefaultPolicyRoute: Route = {
    path: '',
    redirectTo: LsRoutePath.Worksheet,
    pathMatch: 'prefix'
};

// WORKSHEET
const WorksheetCaseDispRoute: Route = {
    path: LsRoutePath.CaseDisp,
    component: CaseDispositionComponent,
    resolve: {
        data: CaseDispositionDataResolver,
        listData: CaseDispositionListDataResolver,
        metaData: CaseDispositionMetaDataResolver
    }
};

const WorksheetReviewMessagesRoute: Route = {
    path: LsRoutePath.ReviewMessages,
    component: ReviewMessagesComponent,
    resolve: {
        data: ReviewMessagesDataResolver
    }
};

const WorksheetDebitCreditRoute: Route = {
    path: LsRoutePath.DebitCredit,
    component: DebitCreditComponent,
    resolve: {
        data: DebitCreditDataResolver,
        metaData: DebitCreditMetaDataResolver
    }
};

const PolicyWorksheetRoute: Route = {
    path: LsRoutePath.Worksheet,
    component: TabViewWorksheetComponent,
    resolve: LsResolveUtil.getDataResolver(BasePolicyDataResolver),
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard],
    children: [WorksheetCaseDispRoute, WorksheetReviewMessagesRoute, WorksheetDebitCreditRoute]
};
const PolicyWorksheetRouteRefresh: Route = {
    path: `${LsRoutePath.Worksheet}/${RoutePath.Refresh}`,
    component: TabViewWorksheetComponent,
    resolve: LsResolveUtil.getDataResolver(BasePolicyDataResolver),
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard],
    children: [WorksheetCaseDispRoute, WorksheetReviewMessagesRoute, WorksheetDebitCreditRoute]
};

// NOTES
const PolicyCaseNotesRoute: Route = {
    path: LsRoutePath.CaseNotes,
    component: CaseNotesComponent,
    resolve: {
        data: NotesDataResolver,
        metaData: NotesMetaDataResolver
    },
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyCaseNotesRouteRefresh: Route = {
    path: `${LsRoutePath.CaseNotes}/${RoutePath.Refresh}`,
    component: CaseNotesComponent,
    resolve: {
        data: NotesDataResolver,
        metaData: NotesMetaDataResolver
    },
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

const PolicyUWNotesRoute: Route = {
    path: LsRoutePath.UWNotes,
    component: UWNotesComponent,
    resolve: {
        data: NotesDataResolver,
        metaData: NotesMetaDataResolver
    },
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyUWNotesRouteRefresh: Route = {
    path: `${LsRoutePath.UWNotes}/${RoutePath.Refresh}`,
    component: UWNotesComponent,
    resolve: {
        data: NotesDataResolver,
        metaData: NotesMetaDataResolver
    },
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

// CASE
const CaseInfoRoute: Route = {
    // Setup CaseListDataResolver in the child route because
    // it depends on some data preloaded in the parent route.
    path: '',
    component: CaseInfoComponent,
    resolve: { listData: CaseListDataResolver, metaData: CaseMetaDataResolver },
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

const PolicyCaseRoute: Route = {
    path: LsRoutePath.Case,
    resolve: { data: CaseDataResolver },
    children: [CaseInfoRoute]
};
const PolicyCaseRouteRefresh: Route = {
    path: `${LsRoutePath.Case}/${RoutePath.Refresh}`,
    resolve: { data: CaseDataResolver },
    children: [CaseInfoRoute]
};

// REQUIREMENTS
const RequirementBasicInfoRoute: Route = {
    path: LsRoutePath.RequirementBasicInfo,
    component: RequirementDetailBasicInfo
};

const RequirementProvidersInfoRoute: Route = {
    path: LsRoutePath.RequirementProvidersInfo,
    component: RequirementDetailProvidersInfo,
    resolve: LsResolveUtil.getMetaDataResolver(RequirementDetailProvidersInfoMetaDataResolver)
};

const PolicyRequirementsRoute: Route = {
    path: LsRoutePath.Requirements,
    component: RequirementComponent,
    resolve: {
        data: RequirementDataResolver,
        metaData: RequirementMetaDataResolver,
        listData: RequirementListDataResolver
    },
    children: [RequirementBasicInfoRoute, RequirementProvidersInfoRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyRequirementsRouteRefresh: Route = {
    path: `${LsRoutePath.Requirements}/${RoutePath.Refresh}`,
    component: RequirementComponent,
    resolve: {
        data: RequirementDataResolver,
        listData: RequirementListDataResolver,
        metaData: RequirementMetaDataResolver
    },
    children: [RequirementBasicInfoRoute, RequirementProvidersInfoRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

// EVIDENCE
// Lab
const EvidenceLabRoute: Route = {
    path: LsRoutePath.Lab,
    component: LabTabComponent,
    resolve: LsResolveUtil.getDataResolver(LabDataResolver)
};

// Paramedical
const EvidenceParamedicalRoute: Route = {
    path: LsRoutePath.Paramedical,
    component: ParamedicalTabComponent,
    resolve: { data: ParamedicalDataResolver }
};

// Medical Condition
const EvidenceMedicalConditionRoute: Route = {
    path: LsRoutePath.MedicalCondition,
    component: MedicalConditionTabComponent,
    resolve: {
        data: MedicalConditionDataResolver,
        metaData: MedicalConditionMetaDataResolver
    }
};

// Velogica
const EvidenceVelogicaRoute: Route = {
    path: LsRoutePath.Velogica,
    component: VelogicaTabComponent,
    resolve: {
        data: VelogicaDataResolver
    }
};
// Rx
const EvidenceRxReportRoute: Route = {
    path: LsRoutePath.RxReport,
    resolve: { data: RxReportLazyDataResolver },
    children: [
        {
            // Setup ApplicantInfoListDataResolver in the child route because
            // it depends on some data preloaded in the parent route.
            path: '',
            component: RxReportComponent,
            resolve: {
                rxReports: RxReportDataResolver,
                metaData: RxReportMetaDataResolver
            }
        }
    ]
};

const EvidenceRxRulesRoute: Route = {
    path: LsRoutePath.RxRules,
    component: RxRulesComponent
};

const EvidenceRxOtherMedicationRoute: Route = {
    path: LsRoutePath.RxOtherMedication,
    component: RxOtherMedicationTabComponent,
    resolve: {
        metaData: RxOtherMedicationMetaDataResolver
    }
};

const EvidenceRxRoute: Route = {
    path: LsRoutePath.Rx,
    component: RxTabComponent,
    children: [EvidenceRxReportRoute, EvidenceRxRulesRoute, EvidenceRxOtherMedicationRoute]
};

// MIB Report route
const EvidenceMIBReportRoute: Route = {
    path: LsRoutePath.MIBReport,
    component: MIBReportComponent,
    resolve: LsResolveUtil.getDataResolver(MIBReportDataResolver)
};

// MIB Coding route
const EvidenceMIBCodingRoute: Route = {
    path: LsRoutePath.MIBCoding,
    component: MIBCodingTabComponent,
    resolve: {
        data: MIBCodingDataResolver,
        metaData: MIBCodingMetaDataResolver
    }
};

// MIB route
const EvidenceMIBRoute: Route = {
    path: LsRoutePath.MIB,
    component: MIBTabComponent,
    children: [EvidenceMIBReportRoute, EvidenceMIBCodingRoute]
};

// MVR route
const EvidenceMVRRoute: Route = {
    path: LsRoutePath.MVR,
    component: MVRTabComponent,
    resolve: LsResolveUtil.getDataResolver(MVRDataResolver)
};

const PolicyEvidenceDetailRoute: Route = {
    path: `${LsRoutePath.EvidenceDetail}/:id`,
    component: TabViewEvidenceComponent,
    children: [
        EvidenceLabRoute,
        EvidenceMIBRoute,
        EvidenceMVRRoute,
        EvidenceRxRoute,
        EvidenceParamedicalRoute,
        EvidenceMedicalConditionRoute,
        EvidenceVelogicaRoute
    ],
    resolve: LsResolveUtil.getMetaDataResolver(EvidenceMetaDataResolver),
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

const PolicyEvidenceApplicantRoute: Route = {
    path: '',
    component: EvidenceComponent,
    resolve: LsResolveUtil.getDataResolver(EvidenceDataResolver),
    children: [PolicyEvidenceDetailRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

// Evidence Routes
const PolicyEvidenceRoute: Route = {
    path: LsRoutePath.Evidence,
    resolve: LsResolveUtil.getDataResolver(EvidenceInfoDataInitializer),
    children: [PolicyEvidenceApplicantRoute]
};
const PolicyEvidenceRouteRefresh: Route = {
    path: `${LsRoutePath.Evidence}/${RoutePath.Refresh}`,
    resolve: LsResolveUtil.getDataResolver(EvidenceInfoDataInitializer),
    children: [PolicyEvidenceApplicantRoute]
};

// APPLICANT
const ApplicantDetailRoute: Route = {
    path: `${LsRoutePath.ApplicantDetail}/:id`,
    // Setup ApplicantInfoListDataResolver in the child route because
    // it depends on some data preloaded in the parent route.
    resolve: { data: ApplicantInfoDataResolver },
    children: [
        {
            path: '',
            component: ApplicantDetailComponent,
            resolve: { listData: ApplicantInfoListDataResolver, metaData: ApplicantMetaDataResolver }
        }
    ]
};

const PolicyApplicantsRoute: Route = {
    path: LsRoutePath.Applicant,
    component: ApplicantInfoComponent,
    children: [ApplicantDetailRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyApplicantsRouteRefresh: Route = {
    path: `${LsRoutePath.Applicant}/${RoutePath.Refresh}`,
    component: ApplicantInfoComponent,
    children: [ApplicantDetailRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

// RELATED CASES
const PolicyRelatedCasesRoute: Route = {
    path: LsRoutePath.RelatedCases,
    component: RelatedCasesComponent,
    resolve: LsResolveUtil.getDataResolver(RelatedCasesDataResolver),
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyRelatedCasesRouteRefresh: Route = {
    path: `${LsRoutePath.RelatedCases}/${RoutePath.Refresh}`,
    component: RelatedCasesComponent,
    resolve: LsResolveUtil.getDataResolver(RelatedCasesDataResolver),
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

// DOCUMENTS
const PolicyDocumentsAttachmentRoute: Route = {
    path: LsRoutePath.DocumentsAttachment,
    component: CaseAttachmentsComponent,
    // resolve: LsResolveUtil.getDataResolver(CaseAttachmentsResolver),
    resolve: {
        data: CaseAttachmentsResolver,
        metaData: CaseAttachmentsMetaDataResolver
    }
};

const PolicyDocumentsTemplateRoute: Route = {
    path: LsRoutePath.DocumentsTemplate,
    component: CaseTemplatesComponent,
    resolve: LsResolveUtil.getMetaDataResolver(CaseTemplatesMetaDataResolver)
};

const PolicyDocumentsRoute: Route = {
    path: LsRoutePath.PolicyDocuments,
    component: CaseDocumentsComponent,
    children: [PolicyDocumentsAttachmentRoute, PolicyDocumentsTemplateRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};
const PolicyDocumentsRouteRefresh: Route = {
    path: `${LsRoutePath.PolicyDocuments}/${RoutePath.Refresh}`,
    component: CaseDocumentsComponent,
    children: [PolicyDocumentsAttachmentRoute, PolicyDocumentsTemplateRoute],
    canDeactivate: [CanDeactivateGuard, ResetFormDeactivateGuard]
};

const PolicyRoutes: Routes = [
    {
        path: '',
        component: TabPolicyComponent,
        resolve: LsResolveUtil.getDataResolver(TabPolicyDataResolver),
        children: [
            DefaultPolicyRoute,
            PolicyWorksheetRoute,
            PolicyWorksheetRouteRefresh,
            PolicyCaseNotesRoute,
            PolicyCaseNotesRouteRefresh,
            PolicyUWNotesRoute,
            PolicyUWNotesRouteRefresh,
            PolicyCaseRoute,
            PolicyCaseRouteRefresh,
            PolicyRequirementsRoute,
            PolicyRequirementsRouteRefresh,
            PolicyEvidenceRoute,
            PolicyEvidenceRouteRefresh,
            PolicyApplicantsRoute,
            PolicyApplicantsRouteRefresh,
            PolicyRelatedCasesRoute,
            PolicyRelatedCasesRouteRefresh,
            PolicyDocumentsRoute,
            PolicyDocumentsRouteRefresh
        ]
    }
];

// addRefreshRoutes(PolicyRoutes);

@NgModule({
    imports: [RouterModule.forChild(PolicyRoutes)],
    exports: [RouterModule]
})
export class PolicyRoutingModule {}

// function addRefreshRoutes(policyRoutes: Routes): void {
//     const refreshPolicyRoutes = policyRoutes[0].children.reduce((refreshRoutes: Route[], childRoute: Route) => {
//         if (childRoute.path.length > 0) {
//             const refreshRoute = { ...childRoute, path: `${childRoute.path}/${RoutePath.Refresh}` } as Route;
//             refreshRoutes.push(refreshRoute);
//         }
//         return refreshRoutes;
//     }, []);

//     policyRoutes[0].children.push(...refreshPolicyRoutes);
// }
