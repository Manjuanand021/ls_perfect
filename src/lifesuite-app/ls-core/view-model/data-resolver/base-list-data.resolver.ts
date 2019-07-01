import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ListMap } from 'life-core/model';
import { ListDataService, ListsDataRequest, ListDataItem } from 'ls-core/service';
import { RouteResolve, DirectResolve } from 'life-core/view-model/data-resolver';

/**
 *  Base list data resolver class to pre-fetch data for components(ViewModels).
 */
export abstract class BaseListDataResolver
    implements RouteResolve<ListMap<ListDataItem>>, DirectResolve<ListMap<ListDataItem>> {
    private _listDataService: ListDataService;

    constructor(injector: Injector) {
        this._listDataService = injector.get(ListDataService);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListMap<ListDataItem>> {
        return this.loadData();
    }

    public directResolve(): Promise<ListMap<ListDataItem>> {
        return this.loadData();
    }

    protected loadData(): Promise<ListMap<ListDataItem>> {
        return this.loadListData();
    }

    protected loadListData(): Promise<ListMap<ListDataItem>> {
        const request = this.getListsDataRequest();
        return this._listDataService.load(request).then(data => {
            const listData: ListMap<ListDataItem> = {};
            Object.assign(listData, data);
            return listData;
        });
    }

    protected abstract getListsDataRequest(): ListsDataRequest;
}
