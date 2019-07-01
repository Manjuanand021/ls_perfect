import { Injector } from '@angular/core';

import { DataService } from '../data.service';
import { UIServiceNames, UIServiceMethods } from '../service-method-ids';
import { DataServiceParams } from '../data-service.model';
import { BaseDTO, Identifiable } from 'ls-core/model';
import { LazyLoadDTOObjectCreator } from './lazy-load-dto.creator';
import { DTOObjectUtil } from 'ls-core/util/dto/dto-object.util';
import { NTree } from 'ls-core/service/load-bypk';
import { LazyLoadItemsRequest, LazyLoadItem } from 'ls-core/util/lazy-load/lazydata-loader';
import { LazyLoadDataMerger } from 'ls-core/util/lazy-load/lazy-load-tree-helper';

export type ExpandTreeType = NTree<string>;

export interface ILazyLoad {
    load(item: LazyLoadItem): Promise<any>;
    batchLoad(batchRequest: LazyLoadItemsRequest): Promise<any>;
}

/**
 * Concrete lazy loading implementation used by DTOs to interface with the backend and lazily load
 * properties within themselves.
 * Keeps a dictionary of objects who have initiated lazy loading sequences and populates them accordingly when
 * the property has been returned by the backend.
 *
 */
export class LazyLoadImpl implements ILazyLoad {
    private _dataService: DataService;
    private _loadingObjects: Map<string, Object>;

    constructor(injector: Injector) {
        this._dataService = injector.get(DataService);
        this._loadingObjects = new Map<string, Object>();
    }

    public load(item: LazyLoadItem): Promise<any> {
        const key = this.getKey(item);
        if (this.isNotAlreadyLoading(key)) {
            this._loadingObjects.set(key, item.source);
            const serviceParams = this.getServiceParams(item);
            return this._dataService.getData(serviceParams).then(response => {
                const result = response.responsePayload as BaseDTO[];
                this.onLoadFinished(key, item, result);
            });
        } else {
            return Promise.resolve(true);
        }
    }

    private getServiceParams(request: LazyLoadItem): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.LAZY_LOAD_SERVICE,
            serviceMethod: UIServiceMethods.LOAD_DATA,
            requestPayload: this.getLazyLoadRequestPayload(request)
        });
    }

    private getLazyLoadRequestPayload(item: LazyLoadItem): LazyLoadRequest {
        const identifier = item.source.getIdentifierTreeBranchToCurrentObject(item.source.identifier);
        const propertyParts = item.property.split('_');
        item.property = propertyParts[0];
        return new LazyLoadRequest(identifier, propertyParts[0], item.expandTree, item.loadAllTree);
    }

    private onLoadFinished(key: string, item: LazyLoadItem, result: BaseDTO[]): void {
        const payload = this.convertToLazyLoadDTOObjectsWithTree(result, item.property, item);
        const source = this._loadingObjects.get(key);
        if (source && source instanceof BaseDTO) {
            const propertyName = `${item.property}_LazyLoad`;
            if (source[propertyName] == null) {
                source[propertyName] = payload;
            } else if (item.expandTree != null) {
                LazyLoadDataMerger.addLazyCollectionToTarget(payload, source, item.expandTree);
            } else {
                // something is wrong
            }
            (source as BaseDTO).recordLazyLoadedProperty(item.property);
            this._loadingObjects.delete(key);
            this.preparePayload(payload, item.property);
        }
    }

    private isNotAlreadyLoading(key: string): boolean {
        return this._loadingObjects.get(key) == null;
    }

    private getKey(item: LazyLoadItem): string {
        const id = DTOObjectUtil.generateDTOObjectId(item.source);
        return `${id.toString()}-${item.property}`;
    }

    private preparePayload(payload: Object, prop: string): void {
        if (payload instanceof Array) {
            (payload as Array<Object>).forEach(item => {
                if (item && item instanceof BaseDTO) {
                    this.preparePayloadItem(item as BaseDTO, prop);
                }
            });
        } else if (payload instanceof BaseDTO) {
            this.preparePayloadItem(payload as BaseDTO, prop);
        }
    }

    private preparePayloadItem(item: BaseDTO, prop: string): void {
        // This call doesn't do anything - LazyLoad was disabled in the latest Flex version
        // DTOObjectUtil.enableLazyLoad(item);
        // if (item) {
        // item.identifier.ParentPropertyNameRelated = prop;
        // item.getIdentifier().ParentPropertyNameRelated = prop;
        // }
    }

    private convertToLazyLoadDTOObjectsWithTree(
        data: Array<BaseDTO>,
        property: string,
        lazyloadItem: LazyLoadItem
    ): Array<BaseDTO> {
        const resultData = new LazyLoadDTOObjectCreator().createFrom(data, property);
        if (lazyloadItem.expandTree != null) {
            for (const dataItem of resultData) {
                DTOObjectUtil.convertObjectType(dataItem, lazyloadItem.expandTree);
            }
        }
        return resultData;
    }

    public batchLoad(batchRequest: LazyLoadItemsRequest): Promise<any> {
        const serviceParams = this.getBatchLoadServiceParams(batchRequest);
        return this._dataService.getData(serviceParams).then(response => {
            const batchResponse = response.responsePayload as BatchLazyLoadResponse;
            this.onBatchLoadFinished(batchRequest.lazyLoadItems, batchResponse);
        });
    }

    private getBatchLoadServiceParams(batchRequest: LazyLoadItemsRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.BATCH_LAZY_LOAD_SERVICE,
            serviceMethod: UIServiceMethods.LOAD_DATA,
            requestPayload: this.getBatchLazyLoadRequestPayload(batchRequest)
        });
    }

    private getBatchLazyLoadRequestPayload(batchRequest: LazyLoadItemsRequest): BatchLazyLoadRequest {
        const batchLazyLoadRequest = new BatchLazyLoadRequest();
        batchLazyLoadRequest.LazyLoadRequests = [];

        batchRequest.lazyLoadItems.forEach(item => {
            batchLazyLoadRequest.LazyLoadRequests.push(this.getLazyLoadRequestPayload(item));
        });
        return batchLazyLoadRequest;
    }

    private onBatchLoadFinished(
        requestedLazyLoadItems: Array<LazyLoadItem>,
        batchResponse: BatchLazyLoadResponse
    ): void {
        requestedLazyLoadItems.forEach(item => {
            const key = this.getKey(item);
            this._loadingObjects.set(key, item.source);
            const requestedLazyLoadItemResult = this.getLazyLoadItemResultFromResponse(item, batchResponse);
            this.onLoadFinished(key, item, requestedLazyLoadItemResult);
        });
    }

    private getLazyLoadItemResultFromResponse(
        lazyLoadRequestedItem: LazyLoadItem,
        batchResponse: BatchLazyLoadResponse
    ): BaseDTO[] {
        if (!batchResponse || !batchResponse.LazyLoadResponses) return [];
        const requestedLazyLoadItemResult = batchResponse.LazyLoadResponses.find(responseItem =>
            responseItem.length > 0
                ? responseItem[0].identifier.ParentPropertyNameRelated == lazyLoadRequestedItem.property
                : false
        );
        // The below check is needed as there might be some empty lazy loaded collections such as Agencies
        return requestedLazyLoadItemResult || [];
    }
}

class LazyLoadRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.LazyLoadRequest, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public propertyName: string;

    public expandTree: NTree<string>;

    public loadAllTree: boolean;

    constructor(identifier: Identifiable, prop: string, expandTree: NTree<string>, loadAllTree: boolean) {
        this.identifier = identifier;
        this.propertyName = prop;
        this.expandTree = expandTree;
        this.loadAllTree = loadAllTree;
    }
}

class BatchLazyLoadRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.BatchLazyLoadRequest, LifeSuite.UIServiceDTO';

    public LazyLoadRequests: LazyLoadRequest[];
}

class BatchLazyLoadResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.BatchLazyLoadResponse, LifeSuite.UIServiceDTO';

    public LazyLoadResponses: [BaseDTO[]];
}
