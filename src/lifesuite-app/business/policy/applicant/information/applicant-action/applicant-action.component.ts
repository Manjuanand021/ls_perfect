import { Component, Injector, Input } from '@angular/core';

import { InsuredDTO, ApplicationInfoDTO } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { ApplicantActionGridColumnsBuilder } from './applicant-action-grid-columns.builder';
import { ConvertUtil } from 'life-core/util/lang';

@Component({
    selector: 'applicant-action',
    templateUrl: './applicant-action.component.html',
    providers: [PolicySubscriber, ApplicantActionGridColumnsBuilder]
})
export class ApplicantActionComponent extends BasePolicyGridViewModel<ApplicationCount> {
    private _gridColumnBuilder: ApplicantActionGridColumnsBuilder;

    constructor(injector: Injector, gridColumnBuilder: ApplicantActionGridColumnsBuilder) {
        super(injector);
        this._gridColumnBuilder = gridColumnBuilder;
    }

    @Input() public applications: Array<ApplicationInfoDTO>;

    public loadItems(): ApplicationCount[] {
        let applicationArray = [];
        if (this.applications.length > 0) {
            const underwriterCount = this.applications[0].UwCount
                ? ConvertUtil.toNumber(this.applications[0].UwCount)
                : 0;
            const casemanagerCount = this.applications[0].CmCount
                ? ConvertUtil.toNumber(this.applications[0].CmCount)
                : 0;
            applicationArray = [
                { Action: 'UW', Count: underwriterCount },
                { Action: 'CM', Count: casemanagerCount },
                { Action: 'Total', Count: underwriterCount + casemanagerCount }
            ];
        }
        return applicationArray;
    }

    public getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    public getRowNodeId(data: ApplicationCount): any {
        return data.Action;
    }

    protected setGridTitle(): string {
        return '';
    }
}

export type ApplicationCount = { Action: string; Count: number };
