import { Injectable } from '@angular/core';

import { TabDescriptor, TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { TabDefinitions } from './tab-definitions';

@Injectable()
export class TestTabDescriptorFactory extends TabDescriptorFactory {
    constructor() {
        super();
    }

    protected getTabDescriptorTitle(tab: TabDefinitions): string {
        return null;
    }

    // PRIMARY Tabs
    public createPrimaryTabDescriptorHome(): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Home,
            route: 'home'
        });
    }

    public createPrimaryTabDescriptorSearch(): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Search,
            route: 'search'
        });
    }

    public createPrimaryTabDescriptorPolicy(policyId: number, policyNumber: string): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Policy,
            objectId: policyId.toString(),
            title: `Case: ${policyNumber}`,
            route: 'policy'
        });
    }

    // SECONDARY Tabs
    public createSecondaryTabDescriptorWorkItems(): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.WorkItems,
            route: 'work-items'
        });
    }

    public createSecondaryTabDescriptorCaseDesp(policyId: number): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.CaseDesposition,
            objectId: policyId.toString(),
            route: 'case-disp'
        });
    }

    public createSecondaryTabDescriptorReviewMessages(policyId: number): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.ReviewMessages,
            objectId: policyId.toString(),
            route: 'review-messages'
        });
    }

    public createSecondaryTabDescriptorNotes(policyId: number): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Notes,
            objectId: policyId.toString(),
            route: 'notes'
        });
    }

    public createPrimaryTabDescriptorSimple(policyId: number): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Policy,
            objectId: policyId.toString(),
            title: `Some Tab (${policyId})`,
            route: 'simple-comp'
        });
    }

    public createSecondaryTabDescriptorDetail(policyId: number): TabDescriptor {
        return new TabDescriptor({
            tab: TabDefinitions.Details,
            objectId: policyId.toString(),
            title: `Policy Details(${policyId})`,
            route: 'policy-details'
        });
    }
}
