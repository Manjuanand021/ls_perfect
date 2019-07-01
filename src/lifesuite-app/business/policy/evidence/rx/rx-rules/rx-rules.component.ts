import { Component, Injector } from '@angular/core';

import { TertiaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { ConvertUtil } from 'life-core/util/lang';
import { DateFormatter } from 'life-core/util';

import { PolicySubscriber } from 'ls-core/session';
import { BaseTransferObject, InsuredDTO, RxRulesSummaryProxy } from 'ls-core/model';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

import { ApplicantListHelper } from 'business/policy/shared';
import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'rx-rules',
    templateUrl: './rx-rules.component.html',
    providers: [PolicySubscriber]
})
export class RxRulesComponent extends TertiaryTabHostViewModel<PolicyDataModel> {
    public firstRxItem: RxRulesSummaryProxy;
    public rxRules: RxRulesSummaryProxy[];
    public rxRulesExist: boolean = false;
    private _applicant: InsuredDTO;
    private _dataService: DataService;
    private _applicantListHelper: ApplicantListHelper;
    private _dateFormatter: DateFormatter;

    constructor(
        injector: Injector,
        dataService: DataService,
        applicantListHelper: ApplicantListHelper,
        policySubscriber: PolicySubscriber,
        dateFormatter: DateFormatter
    ) {
        super(injector);
        this._dataService = dataService;
        this._applicantListHelper = applicantListHelper;
        this._dateFormatter = dateFormatter;
        this.firstRxItem = new RxRulesSummaryProxy();
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    public loadData(): Promise<void> {
        this.setApplicant();
        this.loadRules();
        return Promise.resolve();
    }

    protected getLoadRulesServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.RX_RULES_SUMMARY_PROXY_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: new RxRulesSummaryRequest(ConvertUtil.toNumber(this._applicant.PolicyPersonId))
        });
    }

    private setApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(this.data.policy.Insureds_LazyLoad);
    }

    private loadRules(): Promise<any> {
        return this._dataService.getData(this.getLoadRulesServiceParams()).then(response => {
            this.setupRules(response.responsePayload as RxRulesSummaryProxy[]);
            this.setApplicantBirthDate();
            this.rxRulesExist = true;
        });
    }

    private setupRules(rxRules: RxRulesSummaryProxy[]): void {
        this.firstRxItem = rxRules[0] || new RxRulesSummaryProxy();
        this.rxRules = rxRules;
    }

    private setApplicantBirthDate(): void {
        this.firstRxItem.ApplicantBirthDate = this._dateFormatter.format(this.firstRxItem.ApplicantBirthDate);
    }
}

export class RxRulesSummaryRequest extends BaseTransferObject {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.RxRulesSummaryRequest, LifeSuite.UIServiceDTO';

    public policyPersonId: number;

    constructor(policyPersonId: number) {
        super();
        this.policyPersonId = policyPersonId;
    }
}
