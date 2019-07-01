import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { BaseModel, Identifiable, PolicyDTO } from 'ls-core/model';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { ExpandTreeType, DTOLoadByPKWithExpandRequest } from 'ls-core/service/load-bypk';
import { AppSession } from 'ls-core/session/app-session';
import { DTOObjectUtil, LazyDataLoader, MetadataLoader } from 'ls-core/util';
import { IDefaultConstructor } from 'life-core/util/lang/object.util';
import { PolicyRootObjectTracker } from './policy-root-object-tracker';
import { ViewModelChangeManager } from 'life-core/view-model/view-model-change.manager';

@Injectable()
export class BasePolicyDataResolver extends BaseViewDataResolver {
    protected appSession: AppSession;
    protected lazyDataLoader: LazyDataLoader;
    protected metadataLoader: MetadataLoader;
    private _policyRootObjectTracker: PolicyRootObjectTracker;
    private _policyChangeUpdater: ViewModelChangeManager;

    constructor(injector: Injector) {
        super(injector);
        this.appSession = injector.get(AppSession);
        this.lazyDataLoader = injector.get(LazyDataLoader);
        this.metadataLoader = injector.get(MetadataLoader);
        this._policyRootObjectTracker = injector.get(PolicyRootObjectTracker);
        this._policyChangeUpdater = injector.get(ViewModelChangeManager);
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        if (!this.isPolicyLoaded()) {
            this._policyChangeUpdater.clearDirtyFlag();
            return super.resolveData(route, state);
        } else {
            this.resolvedData = this.policy;
            return this.resolveAdditionalData().then(() => {
                return Promise.resolve(this.getResolvedDataToReturn());
            });
        }
    }
    protected isPolicyLoaded(): boolean {
        return this.appSession.isPolicyLoaded();
    }

    protected get policy(): PolicyDTO {
        return this.appSession.policyDTO;
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.POLICY,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRequestPayload()
        });
    }

    private getRequestPayload(): DTOLoadByPKWithExpandRequest {
        const request = new DTOLoadByPKWithExpandRequest();
        request.WorkingIdentifiable = this.getPolicyIdentifier();
        request.ExpandTree = this.getExpandTree();
        request.FirstTime = !this._policyRootObjectTracker.objectLoaded;
        return request;
    }

    protected getExpandTree(): ExpandTreeType {
        return null;
    }

    protected handleObjectType(): void {
        const expandTree: ExpandTreeType = this.getExpandTree();
        if (expandTree == null) return;
        DTOObjectUtil.convertObjectType(this.resolvedData, expandTree);
    }

    private getPolicyIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = PolicyDTO.Type;
        identifier.ObjectID = this.appSession.policyId;
        return identifier;
    }

    protected getCreateObjectType<PolicyDTO>(): IDefaultConstructor<any> {
        return PolicyDTO;
    }

    protected getDataFromResponse(response: PolicyDTO): BaseModel {
        return response;
    }

    protected onAllDataResolved(): any {
        this.appSession.updatePolicy(this.resolvedData);
        if (!this._policyRootObjectTracker.objectLoaded) {
            this._policyRootObjectTracker.objectLoaded = true;
        }
    }
}
