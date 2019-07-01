import { Component, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import { ICompose } from 'life-core/component/compose';
import { DialogButtonType, DialogViewModelResult, ICardDialogViewModel } from 'life-core/component/dialog';
import { EmailUtil } from 'life-core/util/email';
import { ListUtil, NamePattern, NameFormatter } from 'life-core/util';

import {
    ListDataService,
    ListDataRequestBuilder,
    ListsDataRequest,
    ListDataUtil,
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    DataService,
    ListDataItem
} from 'ls-core/service';
import { DBDateUtil, MetadataUtil } from 'ls-core/util';
import { DTOLoadByPKRequest, DTOLoadByPKResponse } from 'ls-core/service/load-bypk';
import { LsRadioButtonValues } from 'ls-core/component/input';
import { AppSession, PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, UserDTO, NoteDTO, DBDate, MetadataItem, InsuredDTO } from 'ls-core/model';
import { ApplicantListHelper, ApplicationCountersHelper, ActiveApplicantHelper } from 'business/policy/shared';
import { AddCaseNoteListDataResolver } from './add-case-note-list-data.resolver';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'add-case-note',
    templateUrl: './add-case-note.component.html',
    providers: [ParentChildRegistry, PolicySubscriber, EmailUtil]
})
export class AddCaseNoteComponent extends ViewModel<NoteDTO> implements ICompose, ICardDialogViewModel {
    public policy: PolicyDTO;
    public subjectListOptions: Array<ListItem> = [];
    public visibilityListOptions: Array<ListItem> = [];
    public reviewerTypeListOptions: Array<ListDataItem> = [];
    public reviewerListOptions: Array<ListItem> = [];
    public applicantList: Array<ListItem> = [];
    public dateCreated: number = Date.now();
    public applicantId: number;
    public needReview: boolean;
    public note: string;
    public agencyName: string;
    public agentName: string;
    public userName: string;
    public serviceAssociateName: string;
    public user: UserDTO;
    public showSubjectFieldList: boolean;
    public parentNote: NoteDTO;
    public isSupplementalNote: boolean;
    public isSubjectDisabled: boolean;
    public isApplicantListDisabled: boolean;
    public noteFieldLabel: string;
    private _applicantListHelper: ApplicantListHelper;
    private _resolvedData: any;
    private _listDataService: ListDataService;
    private _dataService: DataService;
    private _emailUtil: EmailUtil;
    private _noteStateModel: CaseNoteStateModel;
    private _addCaseNoteListDataResolver: AddCaseNoteListDataResolver;
    private _nameFormatter: NameFormatter;
    private _applicationCountersHelper: ApplicationCountersHelper;
    private _activeApplicantHelper: ActiveApplicantHelper;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, nameFormatter: NameFormatter, i18n: I18n) {
        super(injector);
        this._applicantListHelper = injector.get(ApplicantListHelper);
        this._dataService = injector.get(DataService);
        this._listDataService = injector.get(ListDataService);
        this._emailUtil = injector.get(EmailUtil);
        this._addCaseNoteListDataResolver = injector.get(AddCaseNoteListDataResolver);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        const appSession: AppSession = injector.get(AppSession);
        this._applicationCountersHelper = injector.get(ApplicationCountersHelper);
        this._activeApplicantHelper = injector.get(ActiveApplicantHelper);
        this.user = appSession.user;
        this._nameFormatter = nameFormatter;
        this.i18n = i18n;
        this.data = new NoteDTO();
    }

    public setState(stateData: any): void {
        this._noteStateModel = stateData;
        this.data = stateData.note;
    }

    public initData(): void {}

    public setModel(model: any): void {
        this._resolvedData = model.resolvedData;
        this.isSupplementalNote = this.isCurrentNoteSupplementalNote(model.parameterData);
        if (this.isSupplementalNote) {
            this.setParentNoteInfo(model.parameterData);
        }
        this.setSubjectFieldAvailability();
        if (this.showSubjectFieldList) {
            this.loadSubjectList();
        }
        this.loadVisibilityList();
        this.loadReviewerTypeList();
        this.loadReviewerList();
        this.setAgencyName();
        this.setAgentName();
        this.setNeedReview();
        this.setServiceAssociateName();
        this.setNoteFieldLabel();
    }

    private isCurrentNoteSupplementalNote(context: any): boolean {
        return context && context.parentNote != undefined;
    }

    private setParentNoteInfo(context: any): void {
        this.parentNote = context.parentNote;
        this.data.ParentNoteId = this.parentNote.NoteId;
    }

    public loadData(): Promise<void> {
        this.loadApplicantList();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.initSubscribers();
        this.setApplicantListAvailability();
        this.setUserName();
        this.setDefaultVisibilityOption();
        this.setAuthor();
    }

    protected setDefaultVisibilityOption(): void {
        this.data.Visibility = 'Internal';
        this.onVisibilityChange(this.data.Visibility);
    }

    private setAuthor(): void {
        this.data.Author = this.user.UserId;
    }

    private setNeedReview(): void {
        if(this.isSupplementalNote && this.parentNote.DiaryDate != null &&  DBDateUtil.isDateSet(this.parentNote.DiaryDate))
        {
            this.needReview = true;
            this.onNeedReviewChange(true);
        }
        else
        {
            this.needReview = false;
        }         
    }

    private setDefaultReviewerType(): void {
        if(this.isSupplementalNote && this.parentNote.UserType != null)
        {
            this.data.UserType = this.parentNote.UserType;            
        }
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

    protected setApplicantListAvailability(): void {
        // by default it's false. Will be set otherwise in other dialog component's if necessary such as Requirement
        this.isApplicantListDisabled = false;
    }

    private setAgencyName(): void {
        if (this.policy.Agencies_LazyLoad.length > 0) {
            this.agencyName = this._nameFormatter.format(
                NamePattern.FirstAndLastName,
                this.policy.Agencies_LazyLoad[0].FirstName,
                this.policy.Agencies_LazyLoad[0].LastName
            );
        }
    }

    private setAgentName(): void {
        if (this.policy.Agents_LazyLoad.length > 0) {
            this.agentName = this._nameFormatter.format(
                NamePattern.LastAndFirstName,
                this.policy.Agents_LazyLoad[0].FirstName,
                this.policy.Agents_LazyLoad[0].LastName
            );
        }
    }

    private setUserName(): void {
        this.userName = this._nameFormatter.format(
            NamePattern.FirstAndLastName,
            this.user.FirstName,
            this.user.LastName
        );
    }

    private setServiceAssociateName(): void {
        this.serviceAssociateName = MetadataUtil.getLabelByValue(
            this._resolvedData.metaData.service_associate,
            this.policy.ServiceAssociateId.toString()
        );
    }

    protected setSubjectFieldAvailability(): void {
        this.isSubjectDisabled = false; // by default it's false. Will be set otherwise in other dialog component's if necessary such as Requirement

        const systemMetadata: Array<MetadataItem> = this._resolvedData.metaData.System;
        this.showSubjectFieldList =
            systemMetadata.find(item => item.value == 'Notes_Subjectlines_Options').label == 'true';
    }

    protected loadSubjectList(): void {
        const caseNotesSubjectLinesMetadata: Array<MetadataItem> = this._resolvedData.metaData.Notes_Subject_lines;
        const caseNotesSubjectLines = caseNotesSubjectLinesMetadata.filter(subjectLine => subjectLine.label === 'Case');
        this.subjectListOptions = ListUtil.convertToListItems(caseNotesSubjectLines, 'value', 'value');
    }

    private loadVisibilityList(): void {
        const visibilityMetadata: Array<MetadataItem> = this._resolvedData.metaData.Visibility;
        this.visibilityListOptions = ListDataUtil.convertToListItemsFromMetadataItems(visibilityMetadata);
    }

    private loadReviewerTypeList(): void {
        this.reviewerTypeListOptions = this._resolvedData.listData.UserType;
    }

    private loadReviewerList(): void {
        if (this._noteStateModel) {
            this.reviewerListOptions = this._noteStateModel.reviewerListOptions;
        }
    }

    public onReviewerTypeChange(reviewerTypeSelection: any): void {
        this.getReviewerList().then(() => this.setDefaultReviewer());
    }

    private getReviewerList(): Promise<void> {
        const request = this.getReviewerListDataRequest();
        return this._listDataService.load(request).then(data => {
            this.reviewerListOptions = ListDataUtil.convertToListItemArray(data.ReferToUserId);
        });
    }

    private getReviewerListDataRequest(): ListsDataRequest {
        const listDataRequestBuilder: ListDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.policy);
        listDataRequestBuilder.addListRequestItem(this.data, 'ReferToUserId');
        return listDataRequestBuilder.getRequest();
    }

    public onVisibilityChange(visibilitySelection: any): void {
        if(!visibilitySelection && this.needReview)
        {
            this.data.Visibility = this.parentNote.Visibility;
            this.setDefaultReviewerType();
        }
        else
        {
            this.data.UserType = 0;
            this.data.ReferToUserId = -1;
        }
        // this method is not needed for base but for clients it maybe required
        // as different lists might show up for internal vs external visibility selection
        this.reloadReviewerTypeAndReviewerLists();
    }

    private setDefaultReviewer(): void {
        if(this.isSupplementalNote)
        {
            this.data.ReferToUserId = this.reviewerListOptions.find(reviewer => reviewer.value == this.parentNote.Author)
                ? this.parentNote.Author: -1;
        }
        else
        {
             this.data.ReferToUserId = -1;
        }
    }
    private reloadReviewerTypeAndReviewerLists(): void {
        this._addCaseNoteListDataResolver.context = this.data;
        this._addCaseNoteListDataResolver.directResolve().then(listData => {
            this.reviewerTypeListOptions = listData.UserType;
            this.getReviewerList().then(() => {
                this.setDefaultReviewer();
                this._addCaseNoteListDataResolver.context = undefined;
            });
        });
    }

    public onApplicantChange(activeApplicant: any): void {
        if (activeApplicant && activeApplicant.value) {
            this._activeApplicantHelper.setActiveApplicantId(activeApplicant.value);
        }
    }

    public onNeedReviewChange(value: boolean): void {
        if (value) {
            this.data.DiaryDate = this.getTodaysDate();
            this.data.EmailToList = LsRadioButtonValues.NO_STRING;
        } else {
            this.data.DiaryDate = null;
            this.data.EmailToList = '';
            this.data.ReferToUserId = -1;
            this.data.UserType = 0;
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId === DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    this.addNote();
                    if (this.needReview) {
                        return this.handleNoteReview(result);
                    }
                    if (!this.needReview && this.isSupplementalNote) {
                        this.undoReviewOnParentNote(); // blindly assuming that supplemental note is added because of review on parent note
                    }
                    return new DialogViewModelResult(this.data, result === ViewValidationResult.pass, this.isDirty());
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private undoReviewOnParentNote(): void {
        this.parentNote.DiaryDate = null;
        this.parentNote.UserType = 0;
        this.parentNote.ReferToUserId = -1;
        this.parentNote.EmailToList = LsRadioButtonValues.NO_STRING;
    }

    protected handleNoteReview(result: any): Promise<DialogViewModelResult> {
        return this.getReviewerAsUserDTO().then(reviewerAsUserDTO => {
            this.data.Topic = this.getNoteTopic(reviewerAsUserDTO);
            if (this.data.EmailToList === LsRadioButtonValues.YES_STRING) {
                this.sendEmail(this.getReviewerEmailAddress(reviewerAsUserDTO));
            }
            return new DialogViewModelResult(this.data, result === ViewValidationResult.pass, this.isDirty());
        });
    }

    private getNoteTopic(reviewerAsUserDTO: UserDTO): string {
        if (reviewerAsUserDTO && !this.isSupplementalNote) {
            return this.buildReferredToNoteTopic(reviewerAsUserDTO.FirstName, reviewerAsUserDTO.LastName);
        } else if (this.isSupplementalNote) {
            return this.parentNote.Topic;
        } else if (!this.isSupplementalNote) {
            return this.data.Topic;
        }
    }

    private getReviewerEmailAddress(reviewerAsUserDTO: UserDTO): string {
        return reviewerAsUserDTO ? reviewerAsUserDTO.EmailAddress : '';
    }

    private getReviewerAsUserDTO(): Promise<UserDTO> {
        if (this.data.ReferToUserId) {
            const request = this.getReviewerAsUserDTORequest();
            const serviceParams = this.getServiceParams(request);
            return this._dataService.getData(serviceParams).then(response => {
                const reviewerAsUserResponse = response.responsePayload as DTOLoadByPKResponse;
                return reviewerAsUserResponse ? (reviewerAsUserResponse.dtoObject as UserDTO) : null;
            });
        }
        return Promise.resolve(null);
    }

    private getReviewerAsUserDTORequest(): DTOLoadByPKRequest {
        const reviewer = new UserDTO();
        reviewer.UserId = this.data.ReferToUserId;

        const request = new DTOLoadByPKRequest();
        request._parentDTOObject = null;
        request._workingDTOObject = reviewer;
        request._eagerLoad = true;
        return request;
    }

    private getServiceParams(request: DTOLoadByPKRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.DTO_LOAD,
            serviceMethod: UIServiceMethods.DTO_LOAD,
            requestPayload: request
        });
    }

    protected addNote(): void {
        this.data.AddedDate = this.getTodaysDate();
        this.data.UpdateDate = this.getTodaysDate();
        this.data.UpdatedBy = this.user.UserId;
        this.setPolicyPersonID();
        this.data.NoteType = this.getNoteType();
        if(this.isSupplementalNote)
        {   
            this.data.PrimaryAuthor = this.parentNote.PrimaryAuthor;            
        }
        else
        {
            this.data.PrimaryAuthor = this.user.UserId;
        }
        this.data.SupplementalNotes = [];
        this.updateUserApplicationCounts();
        this.changeManager.setIsDirty(true);
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

    private getNoteType(): string {
        return this.needReview ? 'Refer' : 'Manual';
    }

    private getInsured(): InsuredDTO {
        return this.policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.applicantId);
    }

    private updateUserApplicationCounts(): void {
        this._applicationCountersHelper.incrementManualActionCounter(this.policy);
    }

    private buildReferredToNoteTopic(reviewerFirstName: string, reviewerLastName: string): string {
        const formattedReviewerName = this._nameFormatter.format(
            NamePattern.LastAndFirstName,
            reviewerFirstName,
            reviewerLastName
        );
        return `Referred to: ${formattedReviewerName} - ${this.data.Topic}`;
    }

    private sendEmail(emailAddress: string): void {
        this._emailUtil.sendEmail(emailAddress, this.data.Topic, this.buildEmailBody());
    }

    private buildEmailBody(): string {
        return `Case Number: ${this.policy.PolicyNumber} %0D%0AInsured Name: ${this.getInsured().LastName}, ${
            this.getInsured().FirstName
        } %0D%0ANote text: ${this.data.Note}`;
    }

    public getState(): any {
        const caseNoteModel = new CaseNoteStateModel();
        caseNoteModel.needsReview = this.needReview;
        caseNoteModel.reviewerListOptions = this.reviewerListOptions;
        caseNoteModel.note = this.data;
        return caseNoteModel;
    }

    public getAuthorName(note: NoteDTO): string {
        const author = note.PrimaryAuthor ? note.PrimaryAuthor : note.Author;
        return author ? ListUtil.getLabelByValue(this._resolvedData.metaData.aus_users, author.toString()) : '';
    }

    public getReferredToUserName(note: NoteDTO): string {
        const referredToUser = note.ReferToUserId ? note.ReferToUserId : null;
        return referredToUser
            ? ListUtil.getLabelByValue(this._resolvedData.metaData.aus_users, referredToUser.toString())
            : '';
    }

    private setNoteFieldLabel(): void {
        this.noteFieldLabel = this.isSupplementalNote
            ? this.i18n({ value: 'Supplemental Note', id: 'policy.notes.addnotes.supplementalnote.label' })
            : this.i18n({ value: 'Note', id: 'policy.notes.addnotes.note.label' });
    }
}

class CaseNoteStateModel {
    public needsReview: boolean;
    public reviewerListOptions: Array<ListItem> = [];
    public note: NoteDTO;
}
