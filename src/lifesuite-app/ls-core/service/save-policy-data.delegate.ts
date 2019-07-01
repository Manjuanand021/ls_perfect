import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { DataServiceParams, UIResponse } from './data-service.model';
import { UIServiceNames, UIServiceMethods } from './service-method-ids';
import { BaseSaveDataDelegate, SaveDataContext, LifeError, SaveDataResult } from 'life-core/service';
import { AppState } from 'ls-core/model';
import { DataSavingFlags, DeleteObjectAction, DataSaveStatus } from 'life-core/reducer/actions';
import { Identifiable, BaseDTO, PolicyDTO } from 'ls-core/model/dto';
import { PolicyInSessionUpdater } from 'ls-core/session//policy-in-session-updater';
import { IDefaultConstructor } from 'life-core/util/lang/object.util';
import { DTOObjectUtil, LazyLoadUtil } from 'ls-core/util';
import { SaveTabDataContext } from 'life-core/component/layout/tabview';
import { ErrorHandlerUtil } from './error-handler';

export class DTOClassIdentifierList {
    public readonly $type: string = 'life.ls.ui.ria.dto.DTOClassIdentifierList, LifeSuite.UIServiceDTO';
    public listOfDTOIdentifiers: Array<Identifiable>;
}

export class SaveDTOInfo {
    public readonly $type: string = 'life.ls.ui.ria.dto.SaveDTOInfo, LifeSuite.UIServiceDTO';
    public rootDTOObject: BaseDTO;
    public toBeDeletedObjList: DTOClassIdentifierList;
    constructor(rootDTOObject: BaseDTO, deletedObjects: Array<Identifiable>) {
        this.rootDTOObject = rootDTOObject;
        this.toBeDeletedObjList = new DTOClassIdentifierList();
        this.toBeDeletedObjList.listOfDTOIdentifiers = deletedObjects;
    }
}
export class SaveDTORequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.SaveDTORequest, LifeSuite.UIServiceDTO';
    public saveDTOInfo: SaveDTOInfo;

    constructor(saveDTOInfo: SaveDTOInfo) {
        this.saveDTOInfo = saveDTOInfo;
    }
}

/**
 *  SaveDataDelegate provides functionality to save data
 */
@Injectable()
export class SavePolicyDataDelegate extends BaseSaveDataDelegate<BaseDTO, UIResponse> {
    private _dataService: DataService;
    private _store: Store<AppState>;
    private _policyInSessionUpdater: PolicyInSessionUpdater;

    constructor(store: Store<AppState>, dataService: DataService, policyUpdater: PolicyInSessionUpdater) {
        super();
        this._store = store;
        this._dataService = dataService;
        this._policyInSessionUpdater = policyUpdater;
    }

    public updateData(data: BaseDTO, context?: SaveDataContext): Promise<UIResponse> {
        if (!this.isSaving()) {
            this._store.dispatch({ type: DataSavingFlags.DATA_SAVE_STATUS, payload: DataSaveStatus.InProgress });
            const serviceParams = this.getServiceParams(data);
            return this._dataService
                .updateData(serviceParams)
                .then(response => {
                    if (this.isSaveSucceed(response)) {
                        this._store.dispatch({ type: DataSavingFlags.DATA_DIRTY, payload: false });
                        this._store.dispatch({
                            type: DataSavingFlags.DATA_SAVE_STATUS,
                            payload: DataSaveStatus.Succeeded
                        });
                        this._store.dispatch({ type: DeleteObjectAction.CLEAR_DELETE_OBJECT_CACHE });
                    } else {
                        this._store.dispatch({
                            type: DataSavingFlags.DATA_SAVE_STATUS,
                            payload: DataSaveStatus.Failed
                        });
                    }
                    if (this.needToUpdateData(response, context)) {
                        if (response.responsePayload) {
                            this._policyInSessionUpdater.updatePolicy(
                                this.createObjectOfType(response.responsePayload)
                            );
                        }
                    }
                    // ---------------------------
                    // debug comparison and should remove after done.
                    if (response.responsePayload) {
                        LazyLoadUtil.compareLazyLoadTrees(data, response.responsePayload);
                    }
                    // --------------------------------------

                    return Promise.resolve(response);
                })
                .catch(response => {
                    this._store.dispatch({ type: DataSavingFlags.DATA_SAVE_STATUS, payload: DataSaveStatus.Failed });
                    return response;
                });
        }
        return Promise.resolve(null);
    }

    public getSaveDataResult(updateDataResult: UIResponse): SaveDataResult {
        if (!updateDataResult) {
            return SaveDataResult.noNeedToSave;
        } else if (updateDataResult.formattedErrors && updateDataResult.formattedErrors.length > 0) {
            return SaveDataResult.fail;
        } else {
            return SaveDataResult.success;
        }
    }

    private isSaveSucceed(updateResult: UIResponse): boolean {
        return this.getSaveDataResult(updateResult) != SaveDataResult.fail;
    }

    public getErrorsFromUpdateDataResult(updateDataResult: UIResponse): LifeError[] {
        return updateDataResult && updateDataResult.formattedErrors
            ? ErrorHandlerUtil.mapErrors(updateDataResult.formattedErrors)
            : [];
    }

    private createObjectOfType(data: any): PolicyDTO {
        const dataType = this.getCreateObjectType();
        return DTOObjectUtil.deepConvertObjectOfType(data, dataType);
    }

    protected getCreateObjectType<PolicyDTO>(): IDefaultConstructor<any> {
        return PolicyDTO;
    }

    protected getDeletedObjects(): Array<Identifiable> {
        let deletedObjects: Array<Identifiable>;
        this._store
            .select(state => state.deleteObject)
            .subscribe(state => (deletedObjects = state))
            .unsubscribe();
        return deletedObjects;
    }

    private isSaving(): boolean {
        let isSaving: boolean;
        this._store
            .select(state => state.isSaving)
            .subscribe(state => (isSaving = state))
            .unsubscribe();
        return isSaving;
    }

    protected getServiceParams(data: BaseDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.POLICY,
            serviceMethod: UIServiceMethods.SAVE_DATA,
            requestPayload: this.buildSaveDTORequest(data)
        });
    }

    protected buildSaveDTORequest(dtoObject: BaseDTO): SaveDTORequest {
        return new SaveDTORequest(new SaveDTOInfo(dtoObject, this.getDeletedObjects()));
    }

    private needToUpdateData(saveDataResponse: UIResponse, context: SaveDataContext): boolean {
        const isSwitchingPolicy =
            context && context instanceof SaveTabDataContext && (<SaveTabDataContext>context).isTabNavigatingAway;
        // Don't update data in UI if an error is returned back
        // from the service call to save data (this.isUpdateDataSuccess()==false) -
        // middle tier DOESN'T save data in such case, and there is no need to update it in UI.
        return this.isSaveSucceed(saveDataResponse) && !isSwitchingPolicy;
    }
}
