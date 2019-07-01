import { Component, Injector, Injectable, Input, ViewChild } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';
import { LfPanel, ConfirmDialog, DialogResult, DialogButton, DialogButtonType } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { NameUtil } from 'life-core/util';

import { InsuredDTO } from 'ls-core/model';
import { LsRadioButtonValues, LsRadioButtonValuesType } from 'ls-core/component/input';
import { MetadataUtil } from 'ls-core/util';

import { InsuredHeaderBuilder } from 'business/policy/worksheet/case-disp/insured/insured-header.builder';
import { DebitCreditHelper } from 'business/policy/shared';
import { LsInsuredAuthorizationProvider } from 'business/policy/worksheet/case-disp/insured/insured-authorization.provider';

@Component({
    selector: 'ls-insured',
    templateUrl: './insured.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: LsInsuredAuthorizationProvider }, InsuredHeaderBuilder]
})
@Injectable()
export class InsuredComponent extends ViewModel {
    @Input()
    public insured: InsuredDTO;
    @Input()
    public index: string;
    @Input()
    public disabledBasedOnCaseDispositionStatus: boolean;

    @ViewChild(LfPanel)
    private _insuredPanel: LfPanel;

    private _debitCreditHelper: DebitCreditHelper;
    private _confirmDialog: ConfirmDialog;
    private _insuredHeaderBuilder: InsuredHeaderBuilder;

    public i18n: I18n;
    public panelHeader: string;
    public applicantTotalPoints: number = 0;

    // Flag to show/hide data inside the Applicant panel when panel is expanded/collapsed.
    // This is to lazy-load/bind all applicant-related data inside the panel to
    // improve page loading speed
    public showView: boolean;

    private viewRendered: boolean;
    public readonly RadioButtonValues: LsRadioButtonValuesType = LsRadioButtonValues;
    public disabledOnCaseOrCoverageStatus: boolean;

    constructor(
        injector: Injector,
        confirmDialog: ConfirmDialog,
        i18n: I18n,
        insuredHeaderBuilder: InsuredHeaderBuilder,
        debitCreditHelper: DebitCreditHelper
    ) {
        super(injector);
        this._debitCreditHelper = debitCreditHelper;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
        this._insuredHeaderBuilder = insuredHeaderBuilder;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    public onPanelCollapsedChange(event: Event): void {
        this.viewRendered = true;
        this.setShowViewFlag();
    }

    protected setupData(): void {
        this.setShowViewFlag();
        this.setAviationExclusionValue();
        this.setAutoApprovalValue();
    }

    private setAviationExclusionValue(): void {
        this.insured.AviationExclusion = this.getAviationExclusionValue();
    }

    private getAviationExclusionValue(): number {
        return this.insured.AviationExclusion == null ||
            this.insured.AviationExclusion == LsRadioButtonValues.NO_NUMBER ||
            this.insured.AviationExclusion == LsRadioButtonValues.NO_LS_BOOLEAN
            ? LsRadioButtonValues.NO_LS_BOOLEAN
            : LsRadioButtonValues.YES_NUMBER;
    }

    private setAutoApprovalValue(): void {
        this.insured.AllowAutoApproval = this.getAutoApprovalValue();
    }

    private getAutoApprovalValue(): number {
        return this.insured.AllowAutoApproval == LsRadioButtonValues.YES_NUMBER ||
            this.insured.AllowAutoApproval == LsRadioButtonValues.YES_LS_BOOLEAN
            ? LsRadioButtonValues.YES_NUMBER
            : LsRadioButtonValues.NO_LS_BOOLEAN;
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setPanelHeader();
        this.setApplicantTotalPoints();
        this.setDisableFlagBasedOnCoverageOrCaseStatus();
    }

    private setDisableFlagBasedOnCoverageOrCaseStatus(): void {
        this.disabledOnCaseOrCoverageStatus = this.disabledBasedOnCaseDispositionStatus || !this.insured.isOpen;
    }

    public showOnHoldConfirmDialog(event: any): void {
        const applicantName = NameUtil.getFullName({
            firstName: this.insured.FirstName,
            lastName: this.insured.LastName
        });
        if (event) {
            this.openOnHoldConfirmDialog(
                this.i18n(
                    {
                        value: 'Are you sure you want to put {{applicantName}} on hold?',
                        id: 'policytoolbar.holdmessage.onhold'
                    },
                    { applicantName: applicantName }
                )
            ).then(dialogResult => {
                this.insured.isHold =
                    dialogResult.buttonId == DialogButtonType.OK
                        ? LsRadioButtonValues.YES_BOOLEAN
                        : LsRadioButtonValues.NO_BOOLEAN;
            });
        } else {
            this.openOnHoldConfirmDialog(
                this.i18n(
                    {
                        value: 'Are you sure you want to remove hold on {{applicantName}} ?',
                        id: 'policytoolbar.holdmessage.removehold'
                    },
                    { applicantName: applicantName }
                )
            ).then(dialogResult => {
                this.insured.isHold =
                    dialogResult.buttonId == DialogButtonType.OK
                        ? LsRadioButtonValues.NO_BOOLEAN
                        : LsRadioButtonValues.YES_BOOLEAN;
            });
        }
    }

    private openOnHoldConfirmDialog(message: string): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: message,
            title: this.i18n({ value: 'Hold Message', id: 'policytoolbar.holdmessage.title' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private setPanelHeader(): void {
        this.panelHeader = this.getPanelHeader();
    }

    private getPanelHeader(): string {
        const applicantStatus = MetadataUtil.getItemByExternalCode(
            this.listData.applicant_status,
            this.insured.ApplicantStatus
        );
        return this._insuredHeaderBuilder.getHeader(applicantStatus, this.insured);
    }
    private setApplicantTotalPoints(): void {
        this.applicantTotalPoints = this._debitCreditHelper.getDebitCreditTotalPoints(this.insured);
    }

    private setShowViewFlag(): void {
        this.showView = !this._insuredPanel.state.get('collapsed') || this.viewRendered;
    }
}
