import { Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import { LfSplitPaneChannels, SplitPaneResult } from 'life-core/component/layout/split';
import { DropdownActionType } from 'life-core/component/input';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ObfuscateIdUtil } from 'life-core/util';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, InsuredDTO } from 'ls-core/model';
import { All_Applicants_Id, ActiveApplicantHelper, ApplicantListHelper, NoteUtil } from 'business/policy/shared';
import { NoteListComponent } from './note-list/note-list.component';
import { DialogButtonType } from 'life-core/component';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

export abstract class NotesComponent extends ViewModel {
    public policy: PolicyDTO;
    public applicantList: ListItem[];
    public sortByOptionList: ListItem[];
    public activeApplicantId: string;
    public selectedSortByOption: string;
    public filterDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _activeApplicantHelper: ActiveApplicantHelper;
    private _applicantListHelper: ApplicantListHelper;
    protected messagingService: IMessagingService;
    protected _appConfig: LsAppConfig;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, appConfig: LsAppConfig) {
        super(injector);
        this._activeApplicantHelper = injector.get(ActiveApplicantHelper);
        this._applicantListHelper = injector.get(ApplicantListHelper);
        this.messagingService = injector.get(MessagingService);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
            this._appConfig = appConfig;
        });
    }

    public loadData(): Promise<void> {
        this.setApplicantList();
        this.setResolvedMetaData();
        this.setDefaultOrderByOption();
        return Promise.resolve();
    }

    public printNotes(noteType: string): void {
        const obfuscatedPolicyNumber = ObfuscateIdUtil.obfuscate(this.policy.PolicyNumber);
        const obfuscatedPolicyPersonId = ObfuscateIdUtil.obfuscate(this.getInsured().PolicyPersonId.toString());
        const LegacyUrl = this._appConfig.getSystemSetting(SystemSetting.LSLegacyUrl);
        NoteUtil.launchNotePreviewReport(LegacyUrl, obfuscatedPolicyPersonId, obfuscatedPolicyNumber, noteType);
    }

    protected setupData(): void {
        super.setupData();
        this.initSubscribers();
        this.setTitle();
    }

    protected abstract setTitle(): void;

    private initSubscribers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(LfSplitPaneChannels.RemoveSplitPaneArea, splitPaneResult => {
                if (this.shouldRefreshNotes(splitPaneResult)) {
                    this.noteListComponent.refreshNotes();
                }
            })
        );
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setActiveApplicant(activeApplicantId);
            })
        );
    }

    private shouldRefreshNotes(splitPaneResult: SplitPaneResult): boolean {
        return (
            splitPaneResult.dialogResult &&
            splitPaneResult.dialogResult.buttonId == DialogButtonType.OK &&
            (splitPaneResult.areaId === TabPolicySplitPaneAreas.AddUWNote ||
                splitPaneResult.areaId === TabPolicySplitPaneAreas.AddCaseNote ||
                splitPaneResult.areaId === TabPolicySplitPaneAreas.AddCaseSupplementalNote)
        );
    }

    private getInsured(): InsuredDTO {
        return this.policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.activeApplicantId);
    }

    private setApplicantList(): void {
        this.applicantList = [];
        this.applicantList.push(new ListItem('All Applicants', All_Applicants_Id.toString()));
        const policyApplicants = this._applicantListHelper.getApplicantList(this.policy.Insureds_LazyLoad);
        this.applicantList = this.applicantList.concat(policyApplicants);
    }

    private isMoreThanOneApplicant(): boolean {
        return this.policy.Insureds_LazyLoad.length > 1;
    }

    private setActiveApplicant(activeApplicantIdValue: number): void {
        this.activeApplicantId =
            activeApplicantIdValue != null ? activeApplicantIdValue.toString() : All_Applicants_Id.toString();
        this.filterNoteList();
    }

    protected abstract get noteListComponent(): NoteListComponent;

    public onApplicantChange(selectedApplicant: any): void {
        this.activeApplicantId = selectedApplicant.value;
        if (this.activeApplicantId !== All_Applicants_Id.toString()) {
            this._activeApplicantHelper.setActiveApplicantId(Number(this.activeApplicantId));
        }
        this.filterNoteList();
    }

    private filterNoteList(): void {
        if (this.noteListComponent) {
            this.noteListComponent.onApplicantChange(this.activeApplicantId);
        }
    }

    public onSortByOptionChange(selectedSortByField: any): void {
        this.selectedSortByOption = selectedSortByField.value;
        this.noteListComponent.onSortByOptionChange(this.selectedSortByOption);
    }
    private setDefaultOrderByOption(): void {
        const defaultOrderNewestToOldest = this._appConfig.getSystemSetting(
            SystemSetting.DefaultNoteOrderNewestToOldest
        );
        if (defaultOrderNewestToOldest && defaultOrderNewestToOldest.toUpperCase() == 'TRUE') {
            this.selectedSortByOption = NotesSortByOption.NewestToOldest;
        } else {
            this.selectedSortByOption = NotesSortByOption.OldestToNewest;
        }
    }
}

const NotesSortByOption = {
    NewestToOldest: '1',
    OldestToNewest: '2'
};
