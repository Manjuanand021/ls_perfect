import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';

import {DataService, DataServiceParams, DataResponse, BusinessServiceAndMethodIds} from 'lpla-core/service';
import { NavigationType } from './navigation-type';

@Injectable()
export class ViewNavigator {

    private _currentPageId: string;

    private _dataService: DataService;

    private _router: Router = null;

    constructor(container: Injector) {
        this._dataService = container.get(DataService);
        this._router = container.get(Router);;
    }

    public get currentPageId(): string {
        return this._currentPageId;
    }

    public set currentPageId(value: string) {
        if (this._currentPageId == null)
            this._currentPageId = value;
    }

    public navigatePrevious(): Promise<void> {
        return new Promise<void>(() => {
            this.getNextPageId(this._currentPageId, NavigationType.PREVIOUS).then(nextPageId => {
                if (nextPageId != null)
                    this._router.navigateByUrl(`${nextPageId}`);
            })
        });
    }

    public navigateNext(): Promise<void> {
        return new Promise<void>(() => {
            this.getNextPageId(this._currentPageId, NavigationType.NEXT).then(nextPageId => {
                if (nextPageId != null)
                    this._router.navigateByUrl(`${nextPageId}`);
            })
        });
    }

	private getNextPageId(currentPageId: string, navigationType: NavigationType): Promise<string> {
        return this.getNavigationResponse(currentPageId, navigationType).then(dataResponse => {
            this._currentPageId = dataResponse.data.viewTargetObjectId;
            return String(dataResponse.data.routeName);
        });
    }

	private getNavigationResponse(currentPageId: string, navigationType: NavigationType): Promise<DataResponse> {
        const params = this.packageServiceParams(currentPageId, navigationType);
        return this._dataService.getData(params);
    }

	private packageServiceParams(currentPageId: string, navigationType: NavigationType): DataServiceParams {
        var params = new DataServiceParams(
            {
                targetPageId: currentPageId,
                navigationActionId: <number>navigationType,
                serviceId: BusinessServiceAndMethodIds.NavigationDataService,
                methodId: BusinessServiceAndMethodIds.NavigationDataMethod,
                data: this.getPayloadData(currentPageId, navigationType)
            }
        );

        return params;
    }

	private getPayloadData(currentPageId: string, navigationType: NavigationType): NavigationRequest {

		let navigationTypeViewTargetMap: { [navigationType: number]: string } = {};

		navigationTypeViewTargetMap[NavigationType.NEXT] = currentPageId;
		navigationTypeViewTargetMap[NavigationType.PREVIOUS] = currentPageId;
		navigationTypeViewTargetMap[NavigationType.FIXED_PAGE] = currentPageId;

		if (navigationTypeViewTargetMap[<number>navigationType] == undefined) {
			throw new Error('Invalid navigationType.');
		}

		return new NavigationRequest(navigationTypeViewTargetMap[<number>navigationType], navigationType);
    }
}

export class NavigationRequest {

    static Type: string = 'life.businessService.businessDataModel.request.NavigationRequest, BusinessDataModel';

    $type: string = NavigationRequest.Type;
    ViewTargetObjectId: string;
	NavigateAction: NavigationType;

	constructor(viewTargetObjectId: string, NavigateAction: NavigationType) {
        this.ViewTargetObjectId = viewTargetObjectId;
        this.NavigateAction = NavigateAction;
    }
}
