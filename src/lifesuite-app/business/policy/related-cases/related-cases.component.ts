import { Component, Injector } from '@angular/core';

import { IGridColumnsBuilder } from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';
import { TabStateValueAccessor, TabStateManager } from 'life-core/util';

import { PolicyProxy } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyGridViewModel } from 'business/policy/shared';
import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { RelatedCasesGridColumnsBuilder } from 'business/policy/related-cases/related-cases-grid-columns.builder';
import { TabHomeDataKeys } from 'business/home/tab';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Component({
    selector: 'related-cases',
    templateUrl: './related-cases.component.html',
    providers: [
        PolicySubscriber,
        RelatedCasesGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }
    ]
})
export class RelatedCasesComponent extends BasePolicyGridViewModel<PolicyProxy> {
    public showDetailAsPopup: boolean;
    public isOpenEnabled: boolean;
    private _activePolicy: PolicyProxy;
    private _gridColumnsBuilder: RelatedCasesGridColumnsBuilder;
    private _policyProxyStateValueAccessor: TabStateValueAccessor<PolicyProxy>;
    private _openPolicyDelegate: OpenPolicyDelegate;

    constructor(
        injector: Injector,
        gridColumnsBuilder: RelatedCasesGridColumnsBuilder,
        tabStateManager: TabStateManager,
        openPolicyDelegate: OpenPolicyDelegate
    ) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this.createStateValueAccessors(tabStateManager);
        this._openPolicyDelegate = openPolicyDelegate;
        this.isOpenEnabled = true;
    }

    public loadData(): Promise<void> {
        this.setResolvedData('relatedCases');
        return super.loadData();
    }

    public onRowClicked(event: any): void {
        super.onRowClicked(event);
        this.isOpenEnabled = false;
        this._activePolicy = event.node.data;
    }

    public onRowDoubleClicked(event): void {
        this._activePolicy = event.node.data;
        this.openPolicy();
    }

    public openPolicy(): void {
        this._policyProxyStateValueAccessor.setValue(this._activePolicy);
        this._openPolicyDelegate.openPolicy(this._activePolicy);
    }

    public getRowSelectionType(): string {
        return 'single';
    }

    protected setGridTitle(): string {
        return 'Related Cases';
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: PolicyProxy): Object {
        return data.PolicyPersonId;
    }

    protected getRemoveItemMessage(item: PolicyProxy): string {
        return ''; // It's not needed as there is no way to delete the related policies.
    }

    protected loadItems(): PolicyProxy[] {
        return this.data.relatedCases || [];
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._policyProxyStateValueAccessor = new TabStateValueAccessor<PolicyProxy>(
            tabStateManager,
            TabHomeDataKeys.ACTIVE_POLICY_PROXY
        );
    }
}
