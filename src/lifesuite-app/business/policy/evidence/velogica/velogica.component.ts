import { Component, Injector } from '@angular/core';

import { IGridColumnsBuilder } from 'life-core/component/grid';
import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver
} from 'life-core/component/master-detail';

import { VelogicaDTO, InsuredDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { VelogicaGridColumnsBuilder } from './velogica-grid-columns.builder';
import { VelogicaDetailComponent } from './detail/velogica-detail.component';
import { VelogicaItemFactory } from './velogica-item-factory';

export function rowManagementDelegateFactory(
    itemFactory: VelogicaItemFactory,
    dataManager: BaseDataManager<VelogicaDTO>
): any {
    return new RowManagementDelegate({
        itemName: 'Velogica',
        itemIDPropertyName: 'VelogicaHeaderId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<VelogicaDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: VelogicaDetailComponent
    });
}

@Component({
    selector: 'velogica',
    templateUrl: './velogica.component.html',
    providers: [
        BaseDataManager,
        VelogicaItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [VelogicaItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        VelogicaGridColumnsBuilder
    ]
})
export class VelogicaComponent extends BasePolicyMasterDetailViewModel<VelogicaDTO> {
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;
    private _applicant: InsuredDTO;

    constructor(
        injector: Injector,
        appSession: AppSession,
        velogicaGridColumnsBuilder: VelogicaGridColumnsBuilder,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);

        this._appSession = appSession;
        this._gridColumnsBuilder = velogicaGridColumnsBuilder;
        this._applicantListHelper = applicantListHelper;
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setActiveApplicant();
        return Promise.resolve();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): VelogicaDTO[] {
        return this._applicant.Velogicas_LazyLoad;
    }

    protected getRowNodeId(data: VelogicaDTO): any {
        return data.VelogicaHeaderId;
    }

    protected getInlineDetailButtons(): MasterButton<VelogicaDTO>[] {
        return [];
    }

    protected getRemoveItemMessage(item: VelogicaDTO): string {
        return '';
    }

    private setActiveApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(
            this._appSession.policyDTO.Insureds_LazyLoad
        );
    }
}
