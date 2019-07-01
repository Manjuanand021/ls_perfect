import { Component, Injector } from '@angular/core';

import { ViewModel, ResolvedDataNames } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { DialogButton, ModalDialog, DialogButtonType } from 'life-core/component/dialog';
import { ObjectUtil } from 'life-core/util/lang';
import { I18n } from 'life-core/i18n';
import { ButtonActionType } from 'life-core/component';

import { InsuredDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber, AppSession } from 'ls-core/session';

import { ApplicantListHelper } from 'business/policy/shared';
import { AddCoverageComponent, AddCoverageListDataResolver } from 'business/policy/applicant/coverages/add-coverage';
import { CoveragesAuthorizationProvider } from './coverages-authorization.provider';

@Component({
    selector: 'ls-applicant-coverages',
    templateUrl: './applicant-coverages.component.html',
    styles: [
        `
            .btn-padding {
                padding: 0.625rem 0 0.3125rem 0;
            }
        `
    ],
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: CoveragesAuthorizationProvider }]
})
export class ApplicantCoveragesComponent extends ViewModel {
    public applicant: InsuredDTO;
    public addCoverageActionType: ButtonActionType = ButtonActionType.DataChange;

    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;
    private _modalDialog: ModalDialog;
    private _appSession: AppSession;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        appSession: AppSession,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
            this.setApplicant();
        });
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this.i18n = i18n;
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    public onAddCoverageClick(event: any): void {
        this.openAddCoverageDialog();
    }

    private openAddCoverageDialog(): void {
        this._modalDialog
            .open({
                view: AddCoverageComponent,
                resolve: [{ resolveName: ResolvedDataNames.listData, resolverClass: AddCoverageListDataResolver }],
                title: this.i18n({ value: 'Add Coverage', id: 'applicant.coverage.add' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.ACCEPT }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(dialogRef => {
                dialogRef.result.then(result =>
                    result.buttonId == DialogButtonType.ACCEPT ? this.onNewCoverageAdded(result.returnValue) : null
                );
            });
    }

    private onNewCoverageAdded(newCoverageResult: any): void {
        const policyDTO = ObjectUtil.createObjectOfType<PolicyDTO>(
            newCoverageResult.updatedPolicy,
            PolicyDTO
        ) as PolicyDTO;
        this._appSession.updatePolicy(policyDTO);
    }
}
