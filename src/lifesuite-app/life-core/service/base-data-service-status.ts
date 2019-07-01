import { Subscription } from 'rxjs';
import { IDataService } from './base-data.service';
import { BusyStatusProvider, BusyStatusCallback } from 'life-core/util/busy-status';

export abstract class BaseDataServiceStatus<T> implements BusyStatusProvider {
    private _dataService: IDataService<T>;

    constructor(dataService: IDataService<T>) {
        this._dataService = dataService;
    }

    public subscribe(callback: BusyStatusCallback): Subscription {
        return this.subscribeToDataServiceStatus(callback);
    }

    private subscribeToDataServiceStatus(callback: BusyStatusCallback): Subscription {
        return this._dataService.isProcessing.subscribe(processingRequests => {
            callback(processingRequests);
        });
    }
}
