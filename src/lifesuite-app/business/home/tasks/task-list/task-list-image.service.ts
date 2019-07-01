import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { BisOkDocDTO } from 'ls-core/model/dto/bis-ok-doc.dto';

@Injectable()
export class TaskListImageService {
    private _dataService: DataService;
    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public deleteTaskListImage(bisOkDocDTO: BisOkDocDTO): Promise<any> {
        const serviceParams: DataServiceParams = this.getServiceParams(bisOkDocDTO);
        return this._dataService
            .deleteData(serviceParams)
            .then(response => {
                return response.responsePayload;
            })
    }

    private getServiceParams(bisOkDocDTO: BisOkDocDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TASK_LIST_IMAGE_LINK,
            serviceMethod: UIServiceMethods.LINK,
            requestPayload: this.buildRequestPayload(bisOkDocDTO)
        });
    }

    private buildRequestPayload(bisOkDocDTO: BisOkDocDTO): TaskImageLinkRequest {
        const request = new TaskImageLinkRequest();
        request.bisOkDocDTO = bisOkDocDTO;
        request.deleteTaskImage = true;
        return request;
    }
}

class TaskImageLinkRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.TaskImageLinkRequest, LifeSuite.UIServiceDTO';

    constructor() { }

    public policyId: number;

    public bisOkDocDTO: BisOkDocDTO;

    public deleteTaskImage: boolean;
}
