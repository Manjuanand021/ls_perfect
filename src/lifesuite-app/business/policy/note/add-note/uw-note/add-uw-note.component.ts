import { Component, Injector } from '@angular/core';

import { ParentChildRegistry, ViewValidationResult, ViewModel } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import { DialogButtonType, DialogViewModelResult, ICompose, ICardDialogViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicyDTO, NoteDTO, DBDate, MetadataItem, InsuredDTO, NoteTypes, DBDateCrypted } from 'ls-core/model';
import { AppSession, PolicySubscriber } from 'ls-core/session';
import { DBDateUtil } from 'ls-core/util';
import { ApplicantListHelper, ActiveApplicantHelper, ApplicationCountersHelper } from 'business/policy/shared';

import { AddUWNotesAuthorizationProvider } from './add-uw-notes-authorization.provider';
import { ListUtil } from 'life-core/util';

@Component({
    selector: 'add-uw-note',
    templateUrl: './add-uw-note.component.html',
    providers: [
        PolicySubscriber,
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: AddUWNotesAuthorizationProvider }
    ]
})
export class AddUWNoteComponent extends ViewModel<NoteDTO> implements ICompose, ICardDialogViewModel {
    public applicantId: number;
    public applicantList: ListItem[];
    public dateOfBirth: DBDateCrypted;
    public subjectListOptions: Array<ListItem> = [];
    public showSubjectFieldList: boolean;
    public showApplicantStatus: boolean;
    public applicantStatusDescription: string;
    public isApplicantListDisabled: boolean;
    public policy: PolicyDTO;
    private _resolvedData: any;
    private _applicantListHelper: ApplicantListHelper;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _appSession: AppSession;
    private _applicationCountersHelper: ApplicationCountersHelper;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        appSession: AppSession
    ) {
        super(injector);
        this._appSession = appSession;
        policySubscriber.subscribe(this, policy => {
            this.policy = policy;
        });
        this._applicantListHelper = applicantListHelper;
        this._activeApplicantHelper = injector.get(ActiveApplicantHelper);
        this._applicationCountersHelper = injector.get(ApplicationCountersHelper);
    }

    public setModel(model: any): void {
        this._resolvedData = model.resolvedData;
        this.setApplicantListAvailability(model.parameterData);
        this.setSubjectFieldAvailability();
        this.setApplicantStatusAvailability(model.parameterData);
        this.setApplicantStatusDescription();
        if (this.showSubjectFieldList) {
            this.loadSubjectList();
        }
    }

    private setApplicantListAvailability(context: any): void {
        this.isApplicantListDisabled = context ? context.isApplicantListDisabled : false;
    }

    private setSubjectFieldAvailability(): void {
        const systemMetadata: Array<MetadataItem> = this._resolvedData.metaData.System;
        this.showSubjectFieldList =
            systemMetadata.find(item => item.value == 'Notes_Subjectlines_Options').label == 'true';
    }

    private setApplicantStatusAvailability(context: any): void {
        this.showApplicantStatus = context ? context.showApplicantStatus : true;
    }

    private setApplicantStatusDescription(): void {
        const applicant = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
        const applicantStatusMetadata: Array<MetadataItem> = this._resolvedData.metaData.applicant_status;
        this.applicantStatusDescription = applicantStatusMetadata.find(
            item => item.value === applicant.ApplicantStatus
        ).label;
    }

    private loadSubjectList(): void {
        const uwNotesSubjectLinesMetadata: Array<MetadataItem> = this._resolvedData.metaData.Notes_Subject_lines;
        const uwNotesSubjectLines = uwNotesSubjectLinesMetadata.filter(subjectLine => subjectLine.label === 'U/W');
        this.subjectListOptions = ListUtil.convertToListItems(uwNotesSubjectLines, 'value', 'value');
    }

    public initData(): void {
        this.data = new NoteDTO();
    }

    public setupData(): void {
        this.loadApplicantList();
        this.initSubscribers();
        this.setApplicantBirthDate();
    }

    private loadApplicantList(): void {
        this.applicantList = this._applicantListHelper.getApplicantList(this.policy.Insureds_LazyLoad);
    }

    public initSubscribers(): void {
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setActiveApplicant();
            })
        );
    }

    private setActiveApplicant(): void {
        this.applicantId = this._applicantListHelper.getActiveApplicantIdOrDefault(this.policy.Insureds_LazyLoad);
    }

    private setApplicantBirthDate(): void {
        this.dateOfBirth = this.getInsured().BirthDate;
    }

    private getInsured(): InsuredDTO {
        return this.policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.applicantId);
    }

    public onApplicantChange(applicant: any): void {
        if (applicant && applicant.value) {
            this._activeApplicantHelper.setActiveApplicantId(this.applicantId);
            this.setActiveApplicant();
            this.setApplicantBirthDate();
            this.setApplicantStatusDescription();
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId === DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                this.addNote();
                return new DialogViewModelResult(this.data, result === ViewValidationResult.pass, this.isDirty());
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private addNote(): void {
        this.data.AddedDate = this.getTodaysDate();
        this.data.UpdateDate = this.getTodaysDate();
        this.setPolicyPersonID();
        this.data.NoteType = this.getNoteType();
        this.data.Author = this._appSession.user.UserId;
        this.updateUserApplicationCounts();
        this.changeManager.setIsDirty(true);
    }

    protected getNoteType(): string {
        return NoteTypes.WORKSHEET;
    }

    private setPolicyPersonID(): void {
        const insured = this.getInsured();
        if (insured) {
            this.data.PolicyPersonId = insured.PolicyPersonId.toString();
        }
    }

    private getTodaysDate(): DBDate {
        return DBDateUtil.dateToDBDate(new Date());
    }

    private updateUserApplicationCounts(): void {
        this._applicationCountersHelper.incrementManualActionCounter(this.policy);
    }

    public getState(): any {
        const uwNoteModel = new UWNoteStateModel();
        uwNoteModel.note = this.data;
        return uwNoteModel;
    }

    public setState(stateData: any): void {
        this.data = (stateData as UWNoteStateModel).note;
    }
}

class UWNoteStateModel {
    public note: NoteDTO;
}
