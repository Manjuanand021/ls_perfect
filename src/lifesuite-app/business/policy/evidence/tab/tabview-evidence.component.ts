import { Component, Injector } from '@angular/core';

import { ConvertUtil } from 'life-core/util/lang';
import { TabDescriptor, SecondaryTabViewHostViewModel } from 'life-core/component/layout/tabview';

import { PolicySubscriber } from 'ls-core/session';
import { NavigationTargetTypes, NavigationTarget, INavigationSequence } from 'ls-core/model/auto-navigation';
import { PolicyDTO, InsuredDTO } from 'ls-core/model';
import { IAutoNavigation, AutoNavigationManager } from 'ls-core/auto-navigation';

import { AutoNavigationChannels } from 'business/shared/auto-navigation';
import { LsTabDescriptorFactory } from 'ui/tabview';
import { MetadataUtil } from 'ls-core/util';
import { ApplicantListHelper } from 'business/policy/shared';

@Component({
    selector: 'tabview-evidence',
    templateUrl: './tabview-evidence.component.html',
    providers: [PolicySubscriber, AutoNavigationManager]
})
export class TabViewEvidenceComponent extends SecondaryTabViewHostViewModel implements IAutoNavigation {
    private _autoNavigationManager: AutoNavigationManager;
    private _policy: PolicyDTO;
    private _applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        autoNavigationManager: AutoNavigationManager,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        this._autoNavigationManager = autoNavigationManager;
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this._applicantListHelper = applicantListHelper;
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initializeAutoNavigationChannel();
    }

    public initializeAutoNavigationChannel(): void {
        this._autoNavigationManager.registerWithNavigationChannel(
            AutoNavigationChannels.Evidence,
            (sequence: INavigationSequence) => {
                this.processNavigationSequence(sequence);
            }
        );
    }

    public processNavigationSequence(sequence: INavigationSequence): void {
        const target = sequence.getNextNavigationTarget();
        if (target && target.targetType === NavigationTargetTypes.Tab) {
            const tabName = target.getParam(NavigationTarget.PARAM_TARGET_ID);

            // using setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError error
            setTimeout(() => {
                this.setSelectedTabByName(tabName);
            });

            this._autoNavigationManager.continueNavigation(sequence, target, AutoNavigationChannels.Evidence);
        }
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setApplicant();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.updateTabsEnabled();
    }

    protected get tabViewId(): string {
        return `evidence-${this._policy.PolicyId}`;
    }

    protected getStaticTabs(): TabDescriptor[] {
        const tabs = this.getEvidenceTabs();
        tabs.evidenceLab.selected = true;
        const tabsArray = tabs.toArray();
        return tabsArray;
    }

    protected updateTabsEnabled(): void {
        const tabs = this.getEvidenceTabs();
        this.setTabsVisibility(tabs);
        this.tabViewManager.removeHiddenTabs(tabs.toArray());
    }

    private setTabsVisibility(tabs: EvidenceTabs): void {
        tabs.evidenceVelogica.hidden = this.isVelogicaTabHidden();
    }

    private setApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    private getEvidenceTabs(): EvidenceTabs {
        const policyId = ConvertUtil.toNumber(this._policy.PolicyId);
        const tabDescriptorFactory = this.tabDescriptorFactory as LsTabDescriptorFactory;
        const tabs = new EvidenceTabs(
            tabDescriptorFactory.createSecondaryTabDescriptorLab(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorMIB(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorMVR(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorRx(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorMedicalCondition(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorParamedical(policyId),
            tabDescriptorFactory.createSecondaryTabDescriptorVelogica(policyId)
        );
        return tabs;
    }

    private isVelogicaTabHidden(): boolean {
        let isTabDisabled = true;
        if (
            this.listData.System &&
            this.listData.System.length > 0 &&
            this._applicant.Velogicas_LazyLoad &&
            this._applicant.Velogicas_LazyLoad.length > 0
        ) {
            const velogicaDisplayCondition = MetadataUtil.getLabelByValue(
                this.listData.System,
                'DisplayVelogicaEvidenceTab'
            );
            if (!!velogicaDisplayCondition && velogicaDisplayCondition.toUpperCase() === 'TRUE') {
                isTabDisabled = false;
            }
        }
        return isTabDisabled;
    }
}

class EvidenceTabs {
    public evidenceLab: TabDescriptor;
    public evidenceMIB: TabDescriptor;
    public evidenceMVR: TabDescriptor;
    public evidenceRx: TabDescriptor;
    public evidenceParamedical: TabDescriptor;
    public evidenceMedicalCondition: TabDescriptor;
    public evidenceVelogica: TabDescriptor;

    constructor(...tabs: TabDescriptor[]) {
        this.evidenceLab = tabs[0];
        this.evidenceMIB = tabs[1];
        this.evidenceMVR = tabs[2];
        this.evidenceRx = tabs[3];
        this.evidenceParamedical = tabs[4];
        this.evidenceMedicalCondition = tabs[5];
        this.evidenceVelogica = tabs[6];
    }

    public toArray(): TabDescriptor[] {
        return [
            this.evidenceLab,
            this.evidenceMIB,
            this.evidenceMVR,
            this.evidenceRx,
            this.evidenceParamedical,
            this.evidenceMedicalCondition,
            this.evidenceVelogica
        ];
    }
}
