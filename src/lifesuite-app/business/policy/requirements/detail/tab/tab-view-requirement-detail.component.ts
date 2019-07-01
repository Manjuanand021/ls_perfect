import { Component, Injector } from '@angular/core';

import { TabDescriptor, SecondaryTabViewHostViewModel } from 'life-core/component/layout/tabview';
import { ICompose } from 'life-core/component/compose';
import { MessagingService, IMessagingService } from 'life-core/messaging';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, RequirementDTO } from 'ls-core/model';
import { PrivilegeType, PrivilegeObjectType, SubsystemType } from 'ls-core/authorization';

import { LsTabDescriptorFactory, SecondaryTabType } from 'ui/tabview';

import { RequirementDetailContext, RequirementDetailContextModel } from '../requirement-detail-context';
import { RequirementsTabChannels } from '../requirements-tab.channels';

export const APSRequirementCodes = ['APS', 'APSTWO'];

@Component({
    selector: 'requirement-detail',
    templateUrl: './tab-view-requirement-detail.component.html',
    providers: [RequirementDetailContext, PolicySubscriber]
})
export class TabViewRequirementDetailComponent extends SecondaryTabViewHostViewModel implements ICompose {
    protected policy: PolicyDTO;
    private _requirementDetailContext: RequirementDetailContext;
    private _requirement: RequirementDTO;
    private _tabUpdatesDone: boolean;
    private _messagingService: IMessagingService;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        messagingService: MessagingService,
        requirementDetailContext: RequirementDetailContext
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._messagingService = messagingService;
        this._requirementDetailContext = requirementDetailContext;
        this.registerTabChangeHandler();
    }

    public registerTabChangeHandler(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribeNewMessageOnly(
                RequirementsTabChannels.NavigateToProviderInfoTab,
                showError => this.setProvideInfoTab(showError)
            )
        );
    }

    protected get tabViewId(): string {
        return `requirement-${this.policy.PolicyId}`;
    }

    public setModel(model: RequirementDTO): void {
        this._requirementDetailContext.updateContext(new RequirementDetailContextModel(model));
        this._requirement = model;
        if (this.tabViewManager) {
            this.updateTabsEnabled();
        }
    }

    protected setupData(): void {
        if (!this._tabUpdatesDone) {
            this.updateTabsEnabled();
        }
    }

    protected updateStaticTabs(tabDescriptors: TabDescriptor[]): void {
        this.setTabsEnabled(new RequirementsTabs(...tabDescriptors));
    }

    protected getStaticTabs(): TabDescriptor[] {
        const tabs = this.getRequirementTabs();
        tabs.requirementBasicInfo.selected = true;
        const tabsArray = tabs.toArray();
        this.setupTabViewAuthorization(tabsArray);
        return tabsArray;
    }

    protected setupTabViewAuthorization(tabs: Array<TabDescriptor>): void {
        const tabAuthorizationLevel = this.authorizationService.getObjectAuthorizationLevel(
            SubsystemType.UWDESKTOP,
            PrivilegeObjectType.Policy,
            this.policy,
            [PrivilegeType.REQUIREMENT]
        );
        tabs.forEach(tab => (tab.authorizationLevel = tabAuthorizationLevel));
    }

    protected updateTabsEnabled(): void {
        const tabs = this.getRequirementTabs();
        this.setTabsEnabled(tabs);
        this.tabViewManager.updateTabs(tabs.toArray());
        this._tabUpdatesDone = true;
    }

    protected setTabsEnabled(tabs: RequirementsTabs): void {
        tabs.requirementProviders.disabled = !this.tabProvidersInfoEnabled(this._requirement);
        if (this.needToSetBasicInfoTab(tabs)) {
            tabs.requirementBasicInfo.selected = true;
            tabs.requirementProviders.selected = false;
        }
    }

    private needToSetBasicInfoTab(tabs: RequirementsTabs): boolean {
        // !this._requirement.requirementType - checks for newly created requirement
        return tabs.requirementProviders.disabled || !this._requirement.requirementType;
    }

    private getRequirementTabs(): RequirementsTabs {
        const policyId = this.policy.PolicyId as number;
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabs = new RequirementsTabs(
            tabDescriptorFactory.createSecondaryTabDescriptorRequirementBasicInfo(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorRequirementProvidersInfo(policyId)
        );
        return tabs;
    }

    private tabProvidersInfoEnabled(requirement: RequirementDTO): boolean {
        return (
            APSRequirementCodes.find(requirementCode => requirement.RequirementCode === requirementCode) !== undefined
        );
    }

    private setProvideInfoTab(showError: boolean): void {
        if (!this.isProviderInfoTabActive()) {
            this.setSelectedTabByName('tabRequirementProvidersInfo');
            this._messagingService.publish(RequirementsTabChannels.ValidateProviderInfo, showError);
        }
    }

    private isProviderInfoTabActive(): boolean {
        return this.getSelectedTab() && this.getSelectedTab().tabType === SecondaryTabType.RequirementProvidersInfo;
    }
}

class RequirementsTabs {
    public requirementBasicInfo: TabDescriptor;
    public requirementProviders: TabDescriptor;

    constructor(...tabs: TabDescriptor[]) {
        this.requirementBasicInfo = tabs[0];
        this.requirementProviders = tabs[1];
    }

    public toArray(): TabDescriptor[] {
        return [this.requirementBasicInfo, this.requirementProviders];
    }
}
