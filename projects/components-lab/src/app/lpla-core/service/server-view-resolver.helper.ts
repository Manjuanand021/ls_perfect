import {Injectable} from '@angular/core';

import {DataService} from './data.service';
import {DataServiceParams, DataRequest, DataResponse} from './data-service.model';
import { BusinessServiceAndMethodIds} from './business-service-method-ids';


@Injectable()
export class ServerViewResolverHelper {

    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

	getRoute(serverViewResolverId: string): Promise<string> {
        let serviceParams = this.packageServiceParams(serverViewResolverId);

        return this._dataService.getData(serviceParams).then(dataResponse => {
            var viewIds = dataResponse.data.viewIds;
            return (viewIds != null) ? viewIds[serverViewResolverId] : null;
        });
    }

    private packageServiceParams(serverViewResolverId: string): DataServiceParams {
        var params = new DataServiceParams(
            {
                serviceId: BusinessServiceAndMethodIds.HtmlTemplateResolverService,
                methodId: BusinessServiceAndMethodIds.HtmlTemplateResolverMethod,
                data: this.getPayloadData(serverViewResolverId)
            }
        );

        return params;
    }

    private getPayloadData(serverViewResolverId: string): HtmlTemplateResolverRequest {
        return new HtmlTemplateResolverRequest([serverViewResolverId]);
    }
}

export class HtmlTemplateResolverRequest {

    static Type: string = 'life.businessService.businessDataModel.request.HtmlTemplateResolverRequest, BusinessDataModel';

    $type: string = HtmlTemplateResolverRequest.Type;
    resolverIds: any;

    constructor(resolverIds: any) {
        this.resolverIds = resolverIds;
    }
}