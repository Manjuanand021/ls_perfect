import { Injectable, Injector } from '@angular/core';

import { DataService } from './data.service';

@Injectable()
export class AuthenticatedDataService extends DataService {
    constructor(injector: Injector) {
        super(injector);
        // Disable JWT authenticated JSON data service implementation.
        // this._httpClient = injector.get(AuthHttp) as any;
    }
}
