import { Injectable } from '@angular/core';

import { TabDescriptor, TabDescriptorFactory, TabDefinition } from 'life-core/component/layout/tabview';
import { LsRoutePath } from 'ui/routing';
import { TabDefinitions } from './tab-definitions';
import { TabDefinitionTitles } from './tab-definition-titles';

@Injectable()
export class LsTabDescriptorFactory extends TabDescriptorFactory {
    private _tabDefinitionTitles: TabDefinitionTitles;

    constructor(tabDefinitionTitles: TabDefinitionTitles) {
        super();
        this._tabDefinitionTitles = tabDefinitionTitles;
    }

    protected getTabDescriptorTitle(tab: TabDefinition): string {
        return this._tabDefinitionTitles.getTitle(tab);
    }

    // PRIMARY Tabs
    public createPrimaryTabDescriptorHome(): TabDescriptor {
        return this.createTabDescriptor({ tab: TabDefinitions.Home, route: LsRoutePath.Home });
    }

    public createPrimaryTabDescriptorSearch(): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Search,
            route: LsRoutePath.Search
        });
    }

    public createPrimaryTabDescriptorReassignCase(): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.ReassignCase,
            route: LsRoutePath.ReassignCase
        });
    }

    public createPrimaryTabDescriptorPolicy(
        policyId: number,
        policyNumber: string,
        contentRoute: string = LsRoutePath.Worksheet
    ): TabDescriptor {
        const tabDescriptor = this.createTabDescriptor({
            tab: TabDefinitions.Policy,
            objectId: policyId.toString(),
            route: LsRoutePath.Policy,
            contentRoute: contentRoute
        });
        tabDescriptor.title = `${tabDescriptor.title}: ${policyNumber}`;
        return tabDescriptor;
    }

    // SECONDARY Tabs
    public createSecondaryTabDescriptorWorkItems(): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.WorkItems,
            route: LsRoutePath.WorkItems
        });
    }

    public createSecondaryTabDescriptorTasks(): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Tasks,
            route: LsRoutePath.Tasks
        });
    }

    public createSecondaryTabDescriptorSummary(): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Summary,
            route: LsRoutePath.Summary
        });
    }

    public createSecondaryTabDescriptorCaseDesp(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.CaseDesposition,
            objectId: policyId.toString(),
            route: LsRoutePath.CaseDisp
        });
    }

    public createSecondaryTabDescriptorReviewMessages(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.ReviewMessages,
            objectId: policyId.toString(),
            route: LsRoutePath.ReviewMessages
        });
    }

    public createSecondaryTabDescriptorDebitCredit(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.DebitCredit,
            objectId: policyId.toString(),
            route: LsRoutePath.DebitCredit
        });
    }

    public createSecondaryTabDescriptorNotes(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Notes,
            objectId: policyId.toString(),
            route: LsRoutePath.CaseNotes
        });
    }

    public createSecondaryTabDescriptorRequirementBasicInfo(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.RequirementBasicInfo,
            objectId: policyId.toString(),
            route: LsRoutePath.RequirementBasicInfo
        });
    }

    public createSecondaryTabDescriptorRequirementProvidersInfo(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.RequirementProvidersInfo,
            objectId: policyId.toString(),
            route: LsRoutePath.RequirementProvidersInfo
        });
    }

    public createSecondaryTabDescriptorMIB(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.MIB,
            objectId: policyId.toString(),
            route: LsRoutePath.MIB
        });
    }

    public createSecondaryTabDescriptorMVR(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.MVR,
            objectId: policyId.toString(),
            route: LsRoutePath.MVR
        });
    }

    public createSecondaryTabDescriptorLab(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Lab,
            objectId: policyId.toString(),
            route: LsRoutePath.Lab
        });
    }

    public createSecondaryTabDescriptorRx(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Rx,
            objectId: policyId.toString(),
            route: LsRoutePath.Rx
        });
    }

    public createSecondaryTabDescriptorParamedical(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Paramedical,
            objectId: policyId.toString(),
            route: LsRoutePath.Paramedical
        });
    }

    public createSecondaryTabDescriptorMedicalCondition(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.MedicalCondition,
            objectId: policyId.toString(),
            route: LsRoutePath.MedicalCondition
        });
    }

    public createSecondaryTabDescriptorVelogica(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.Velogica,
            objectId: policyId.toString(),
            route: LsRoutePath.Velogica
        });
    }

    public createSecondaryTabDocumentsAttachment(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.DocumentsAttachment,
            objectId: policyId.toString(),
            route: LsRoutePath.DocumentsAttachment
        });
    }

    public createSecondaryTabDocumentsTemplate(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.DocumentsTemplate,
            objectId: policyId.toString(),
            route: LsRoutePath.DocumentsTemplate
        });
    }

    // TERTIARY Tabs
    public createTertiaryTabDescriptorRxReport(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.RxReport,
            objectId: policyId.toString(),
            route: LsRoutePath.RxReport
        });
    }

    public createTertiaryTabDescriptorRxRules(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.RxRules,
            objectId: policyId.toString(),
            route: LsRoutePath.RxRules
        });
    }

    public createTertiaryTabDescriptorRxOtherMedication(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.RxOtherMedication,
            objectId: policyId.toString(),
            route: LsRoutePath.RxOtherMedication
        });
    }

    // MIB report secondary tab definitions
    public createTertiaryTabDescriptorMIBReport(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.MIBReport,
            objectId: policyId.toString(),
            route: LsRoutePath.MIBReport
        });
    }

    // MIB coding secondary tab definitions
    public createTertiaryTabDescriptorMIBCoding(policyId: number): TabDescriptor {
        return this.createTabDescriptor({
            tab: TabDefinitions.MIBCoding,
            objectId: policyId.toString(),
            route: LsRoutePath.MIBCoding
        });
    }
}
