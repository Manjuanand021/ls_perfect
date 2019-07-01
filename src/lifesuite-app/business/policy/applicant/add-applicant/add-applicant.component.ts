import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogData, DialogButtonType } from 'life-core/component/dialog';
import { DialogViewModelResult, ConfirmDialog, DialogResult, DialogButton } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';
import { InputValueValidationResult } from 'life-core/view-model/validation/input-value/input-value-validator.interface';

import { DataServiceParams, DataService, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { PolicyDTO, InsuredDTO, ApplicationInfoDTO, DataCollectionNames, DBDate } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { PolicyCoverageDTO } from 'ls-core/model/dto/policy-coverage.dto';
import { NTree } from 'ls-core/service/load-bypk';
import { ExpandTreeType } from 'ls-core/service/lazy-load';
import { DBDateUtil } from 'ls-core/util';

import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';
import { AddApplicantBirthDateValidator } from 'business/policy/applicant/add-applicant/add-applicant-birthdate-validator';


@Component({
    selector: 'add-applicant.component',
    templateUrl: './add-applicant.component.html',
    styleUrls: ['./add-applicant.component.css'],
    providers: [
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider },
        AddApplicantBirthDateValidator
    ]
})
@Injectable()
export class AddApplicantComponent extends ViewModel implements ICompose, IDialogViewModel {
    public resolvedData: any;
    public applicant: InsuredDTO;
    public policyCoverage: PolicyCoverageDTO;
    public maxBirthDate: Date;
    private _dataService: DataService;
    private _appSession: AppSession;
    private _policy: PolicyDTO;
    private _addApplicantBirthDateValidator: AddApplicantBirthDateValidator;
    private _confirmDialog: ConfirmDialog;
    constructor(
        injector: Injector,
        appSession: AppSession,
        i18n: I18n,
        dataService: DataService,
        addApplicantBirthDateValidator: AddApplicantBirthDateValidator,
        confirmDialog: ConfirmDialog
    ) {
        super(injector);
        this._dataService = dataService;
        this._appSession = appSession;
        this._policy = this._appSession.policyDTO;
        this.applicant = new InsuredDTO();
        this.policyCoverage = new PolicyCoverageDTO();
        this.maxBirthDate = this.setBirthDateLimit();
        this.i18n = i18n;
        this._addApplicantBirthDateValidator = addApplicantBirthDateValidator;
        this._confirmDialog = confirmDialog;
    }

    public setModel(model: DialogData): void {
        this.resolvedData = model.resolvedData;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        const application = new ApplicationInfoDTO();
        this.applicant.Applications_LazyLoad = [application];
    }

    public onApplicantBirthDateChange(): void {
        if (
            this.applicantBirthDateExists() &&
            this._addApplicantBirthDateValidator.validate(this.applicant.BirthDate) === InputValueValidationResult.fail
        ) {
            this.showValidationMsgDialog().then(() => {
                this.resetBirthDate();
            });
        }
    }

    private applicantBirthDateExists(): boolean {
        return DBDateUtil.isDateSet(this.applicant.BirthDate);
    }

    private showValidationMsgDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Birth date cannot be greater than Application Received Date or Agent Signed Date.',
                id: 'policy.applicantinfo.dialog.datevalidation.message'
            }),
            title: this.i18n({ value: 'Validation message', id: 'policy.applicantinfo.dialog.datevalidation.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    return this.addApplicantAndCoverage().then(addApplicantAndCoverageResponse => {
                        return new DialogViewModelResult({
                            newApplicantId: addApplicantAndCoverageResponse.insuredPersonId,
                            updatedPolicy: addApplicantAndCoverageResponse.policyDTO
                        });
                    });
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private resetBirthDate(): void {
        this.applicant.BirthDate = null;
    }

    private addApplicantAndCoverage(): Promise<NewInsuredAndCoverageResponse> {
        this.setAdditionalData();
        const serviceParams: DataServiceParams = this.getAddApplicantAndCoverageServiceParams();
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as NewInsuredAndCoverageResponse;
        });
    }

    private setAdditionalData(): void {
        // needed as its mentioned in flex code
        this.policyCoverage.ApprovedAmount = this.policyCoverage.Amount;
    }

    private getAddApplicantAndCoverageServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.ADD_APPLICANT_AND_COVERAGE_SERVICE,
            serviceMethod: UIServiceMethods.ADD_APPLICANT_AND_COVERAGE_METHOD,
            requestPayload: this.getAddApplicantAndCoverageServicePayload()
        });
    }

    private getAddApplicantAndCoverageServicePayload(): NewInsuredAndCoverageRequest {
        const request = new NewInsuredAndCoverageRequest();
        request.policyID = Number(this._policy.PolicyId);
        request.insuredDTO = this.applicant;
        request.policyCoverageDTO = this.policyCoverage;
        request.expandTree = this.getExpandTree();
        return request;
    }

    private setBirthDateLimit(): Date {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, currentMonth, today - 1);
    }

    protected getExpandTree(): ExpandTreeType {
        const policyDTOLoadTree = new NTree<string>('Policy');
        {
            const insuredDTOLoadTree = policyDTOLoadTree.AddChild(DataCollectionNames.Insureds);
            {
                const coveragesNode = insuredDTOLoadTree.AddChildren([DataCollectionNames.Coverages]);
            }
            // adding below lazyloaded collections to policy since it's needed by policyquickinfo panel.
            const agentDTOLoadTree = policyDTOLoadTree.AddChild(DataCollectionNames.Agents);
            {
                const phonesNode = agentDTOLoadTree.AddChildren([DataCollectionNames.Phones]);
            }
            const agencyDTOLoadTree = policyDTOLoadTree.AddChild(DataCollectionNames.Agencies);
            const requirementsDTOLoadTree = policyDTOLoadTree.AddChild(DataCollectionNames.Requirements);
            // adding below lazyloaded collections since it's needed for Benefits section
            const coveragesDTOLoadTree = policyDTOLoadTree.AddChild(DataCollectionNames.PolicyCoverages);
            {
                const benefitsNode = coveragesDTOLoadTree.AddChild(DataCollectionNames.Benefits);
            }
        }
        return policyDTOLoadTree;
    }
}

export class NewInsuredAndCoverageRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.NewInsuredAndCoverageRequest, LifeSuite.UIServiceDTO';

    public policyID: number;
    public insuredDTO: InsuredDTO;
    public policyCoverageDTO: PolicyCoverageDTO;
    public expandTree: NTree<string>;
}

export class NewInsuredAndCoverageResponse {
    public readonly $type: string =
        'life.ls.ui.ria.dto.responses.NewInsuredAndCoverageResponse, LifeSuite.UIServiceDTO';

    public policyDTO: PolicyDTO;
    public insuredPersonId: any;
}
