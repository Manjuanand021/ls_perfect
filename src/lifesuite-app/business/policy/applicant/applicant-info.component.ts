import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel, ResolvedDataNames } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import { ModalDialog, DialogButton, DialogButtonType, DialogSize, ButtonActionType } from 'life-core/component';
import { BaseSaveDataDelegate } from 'life-core/service';
import { AuthorizationProvider } from 'life-core/authorization/authorization.provider';
import { MessagingService } from 'life-core/messaging/messaging.service';
import { I18n } from 'life-core/i18n';
import { ObfuscateIdUtil } from 'life-core/util';
import { DropdownActionType } from 'life-core/component/input';

import { SavePolicyDataDelegate, UIResponse } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';
import { DTOObjectUtil } from 'ls-core/util';
import { AppSession } from 'ls-core/session';
import { PolicySubscriber } from 'ls-core/session/policy-subscriber';

import { LsRoutePath } from 'ui/routing';
import { ActiveApplicantHelper, ApplicantListHelper } from 'business/policy/shared';
import { AddApplicantComponent, AddApplicantListDataResolver, AddApplicantDataResolver } from './add-applicant';
import { ApplicantAuthorizationProvider } from './applicant-authorization.provider';
import { ApplicantChannel } from 'business/policy/applicant/applicant-channel';

@Component({
    selector: 'applicant-info',
    templateUrl: './applicant-info.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
@Injectable()
export class ApplicantInfoComponent extends ViewModel {
    public applicantListOptions: Array<ListItem>;
    public selectedApplicantId: number;
    public addButtonActionType: ButtonActionType = ButtonActionType.DataChange;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _policy: PolicyDTO;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _modalDialog: ModalDialog;
    private _appSession: AppSession;
    private _applicantListHelper: ApplicantListHelper;
    private _messagingService: MessagingService;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        messagingService: MessagingService,
        activeApplicantHelper: ActiveApplicantHelper,
        appSession: AppSession,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
            if (this.selectedApplicantId) {
                this.rebindUIData();
            }
        });
        this.applicantListOptions = new Array<ListItem>();
        this._activeApplicantHelper = activeApplicantHelper;
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._applicantListHelper = applicantListHelper;
        this.i18n = i18n;
        this._messagingService = messagingService;
    }

    public loadData(): Promise<void> {
        // this.setResolvedData('policy');
        this.loadApplicantList();
        return Promise.resolve();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.registerHandlers();
    }

    public registerHandlers(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribe(ApplicantChannel.ApplicantNameChange, updatedName => {
                this.applicantListOptions.find(
                    applicant => applicant.value == this.selectedApplicantId.toString()
                ).label = updatedName;
            })
        );
    }

    private loadApplicantList(): void {
        this.bindInsuredsToApplicantList();
        this.initSubscribers();
    }

    private routeToApplicantDetailSection(): void {
        this.routerAccessor.navigate(
            [LsRoutePath.ApplicantDetail, ObfuscateIdUtil.obfuscate(this.selectedApplicantId.toString())],
            true
        );
    }

    private bindInsuredsToApplicantList(): void {
        this.applicantListOptions = this._applicantListHelper.getApplicantList(this._policy.Insureds_LazyLoad);
    }

    private initSubscribers(): void {
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setSelectedApplicant();
            })
        );
    }

    private setSelectedApplicant(): void {
        this.selectedApplicantId = this._applicantListHelper.getActiveApplicantIdOrDefault(
            this._policy.Insureds_LazyLoad
        );
        this.routeToApplicantDetailSection();
    }

    public onApplicantChange(): void {
        this._activeApplicantHelper.setActiveApplicantId(this.selectedApplicantId);
        this.routeToApplicantDetailSection();
    }

    protected rebindUIData(): void {
        this.loadApplicantList();
    }

    protected getDataToSave(): any {
        return this._policy;
    }

    protected getSaveDataDelegate(): BaseSaveDataDelegate<PolicyDTO, UIResponse> {
        return this.injector.get(SavePolicyDataDelegate);
    }

    public onAddApplicantClick(): void {
        this.openAddApplicantDialog();
    }

    private openAddApplicantDialog(): void {
        this._modalDialog
            .open({
                view: AddApplicantComponent,
                resolve: [
                    { resolveName: ResolvedDataNames.data, resolverClass: AddApplicantDataResolver },
                    { resolveName: ResolvedDataNames.listData, resolverClass: AddApplicantListDataResolver }
                ],
                title: this.i18n({ value: 'Add Applicant & Coverage', id: 'applicant.popup.label.header.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.ACCEPT }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                size: DialogSize.large
            })
            .then(dialogRef => {
                dialogRef.result.then(result =>
                    result.buttonId == DialogButtonType.ACCEPT
                        ? this.onNewApplicantAndCoverageAdded(result.returnValue)
                        : null
                );
            });
    }

    private onNewApplicantAndCoverageAdded(newApplicantResult: any): void {
        const updatedPolicy: PolicyDTO = DTOObjectUtil.deepConvertObjectOfType(
            newApplicantResult.updatedPolicy,
            PolicyDTO
        ) as PolicyDTO;
        this._appSession.updatePolicy(updatedPolicy);
        this.selectedApplicantId = newApplicantResult.newApplicantId;
        this.onApplicantChange();
    }
}
