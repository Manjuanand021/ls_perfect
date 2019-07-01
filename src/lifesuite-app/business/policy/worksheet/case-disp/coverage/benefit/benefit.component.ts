import { Component, Injector, Injectable, Input } from '@angular/core';

import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session/app-session';
import { CoverageDTO, BenefitDTO, PolicyCoverageDTO } from 'ls-core/model';

import { LsInsuredAuthorizationProvider } from 'business/policy/worksheet/case-disp/insured/insured-authorization.provider';
import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { BenefitGridColumnsBuilder } from './benefit-grid-columns.builder';
import { BenefitItemFactory } from './benefit-item-factory';
import { BenefitDialogDataResolver } from './detail/benefit-dialog-data.resolver';
import { BenefitDialogDetailEditor } from './detail/benefit-detail-editor';

export function rowManagementDelegateFactory(
    itemFactory: BenefitItemFactory,
    dataManager: BaseDataManager<BenefitDTO>
): RowManagementDelegate<BenefitDTO> {
    return new RowManagementDelegate({
        itemName: 'Benefit',
        itemIDPropertyName: 'BenefitId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<BenefitDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: BenefitDialogDetailEditor
    });
}

@Component({
    selector: 'benefit',
    templateUrl: './benefit.component.html',
    providers: [
        BaseDataManager,
        BenefitItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [BenefitItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        BenefitGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: LsInsuredAuthorizationProvider }
    ]
})
@Injectable()
export class BenefitComponent extends BasePolicyMasterDetailViewModel<BenefitDTO> {
    @Input()
    public coverage: CoverageDTO;
    private _policyCoverage: PolicyCoverageDTO;
    private _appSession: AppSession;
    private _gridColumenBuilder: BenefitGridColumnsBuilder;

    constructor(injector: Injector, gridColumenBuilder: BenefitGridColumnsBuilder, appSession: AppSession, i18n: I18n) {
        super(injector);
        this._appSession = appSession;
        this._gridColumenBuilder = gridColumenBuilder;
        this.i18n = i18n;
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumenBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Benefit', id: 'applicant.coverage.benefit.party' });
    }

    protected loadItems(): BenefitDTO[] {
        this.setResolvedMetaData();
        this.setResolvedListData();
        this._policyCoverage = this._appSession.policyDTO.PolicyCoverages_LazyLoad.find(
            coverage => coverage.PolicyCoverageId === this.coverage.PolicyCoverageId
        );
        if (this._policyCoverage) {
            return this._policyCoverage.Benefits_LazyLoad;
        }
    }

    protected getRowNodeId(data: BenefitDTO): any {
        return data.BenefitId;
    }

    protected getItemDetailDialogResolve(item: BenefitDTO): DirectDataResolve[] {
        const context = { policyCoverage: this._policyCoverage, benefit: item };
        return [
            { resolveName: ResolvedDataNames.listData, resolverClass: BenefitDialogDataResolver, context: context }
        ];
    }

    protected getPopupDetailButtons(): MasterButton<BenefitDTO>[] {
        return [new MasterButton({ type: MasterButtonType.EDIT })];
    }
}
