import { ActivatedRoute, Router, UrlTree } from '@angular/router';

export class RouterAccessor {
    private _router: Router;
    private _activatedRoute: ActivatedRoute;

    constructor(router: Router, activatedRoute: ActivatedRoute) {
        this._router = router;
        this._activatedRoute = activatedRoute;
    }

    public getRouteName(): string {
        return this.getRouterUrl().substring(1);
    }

    public getRoutePath(): string {
        return this._activatedRoute.routeConfig.path;
    }

    public getRouterUrl(): string {
        return this._router.url;
    }

    public navigate(commands: any[], relativeToCurrent: boolean): Promise<boolean> {
        return this._router.navigate(
            commands,
            relativeToCurrent
                ? {
                      relativeTo: this._activatedRoute
                  }
                : undefined
        );
    }

    public navigateByUrl(url: string | UrlTree): Promise<boolean> {
        return this._router.navigateByUrl(url);
    }

    /**
     *  Retrieve data from ActivatedRoute by name.
     *  @param dataName name of the data item to retrieve.
     *  @return data item retrieved from ActivatedRoute.
     */
    public getDataFromRoute<T = any>(dataName: string): T {
        const snapshotData = this._activatedRoute.snapshot.data;
        return snapshotData[dataName] as T;
    }
}
