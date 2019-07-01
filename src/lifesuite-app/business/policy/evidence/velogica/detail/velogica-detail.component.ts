import { Component, Injector } from '@angular/core';
import { DetailViewModel } from 'life-core/component/master-detail';
import { InsuredDTO, VelogicaDTO } from 'ls-core/model';
import { ApplicantListHelper } from 'business/policy/shared';
import { AppSession } from 'ls-core/session';
import { PrimaryCoverageUtil } from 'business/policy/shared/primary-coverage.util';
import { NameFormatter } from 'life-core/util/formatter/name.formatter';
import { NamePattern } from 'life-core/util/formatter/name-pattern';

@Component({
    selector: 'velogica-detail',
    templateUrl: './velogica-detail.component.html'
})
export class VelogicaDetailComponent extends DetailViewModel<VelogicaDTO> {
    public applicant: InsuredDTO;
    public coveragePlanName: string;
    public applicantFullName: string;
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;
    private _nameFormatter: NameFormatter;
    constructor(
        injector: Injector,
        appSession: AppSession,
        applicantListHelper: ApplicantListHelper,
        nameFormatter: NameFormatter
    ) {
        super(injector);
        this._appSession = appSession;
        this._applicantListHelper = applicantListHelper;
        this._nameFormatter = nameFormatter;
    }

    public setModel(model: VelogicaDTO): void {
        this.setContext(model);
        this.setActiveApplicant();
        this.setApplicantData();
    }

    private setActiveApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(
            this._appSession.policyDTO.Insureds_LazyLoad
        );
    }

    private setContext(context: VelogicaDTO): void {
        this.data = context;
    }

    private setApplicantData(): void {
        const primaryCoverage = PrimaryCoverageUtil.getPrimaryCoverage(this.applicant);
        this.coveragePlanName = primaryCoverage ? primaryCoverage.planName : '';
        this.applicantFullName = this._nameFormatter.format(
            NamePattern.LastFirstAndMiddleInitial,
            this.applicant.FirstName,
            this.applicant.LastName,
            this.applicant.MiddleName
        );
    }
}
