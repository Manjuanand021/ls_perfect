import { Injectable } from '@angular/core';

import { DataService } from '../data.service';
import { UIServiceNames, UIServiceMethods } from '../service-method-ids';
import { DataServiceParams } from '../data-service.model';
import { CodeHolderDTO } from 'ls-core/model';

/**
 *  MetadataService provides functionality to load metadata,
 *  such as dropdown lists.
 */
@Injectable()
export class MetadataService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(metaTypes: string[]): Promise<Array<CodeHolderDTO[]>> {
        const serviceParams = this.getServiceParams(metaTypes);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as Array<CodeHolderDTO[]>;
        });
    }

    private getServiceParams(metaTypes: string[], source: string = null): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.METADATA_SERVICE,
            serviceMethod: UIServiceMethods.RETRIEVE_METADATA,
            requestPayload: this.getMetadataPayload(metaTypes, source)
        });
    }

    private getMetadataPayload(metaTypes: string[], source: string = null): MetadataRequestDTO {
        const dto = new MetadataRequestDTO();
        dto.lookups = [];
        metaTypes.forEach(metaType => {
            dto.lookups.push(new MetadataLookupDTO(metaType));
        });
        return dto;
    }
}

export class MetadataRequestDTO {
    public readonly $type: string = 'life.ls.ui.ria.dto.MetadataRequestDTO, LifeSuite.UIServiceDTO';
    public lookups: Array<any>;
}

export class MetadataLookupDTO {
    public readonly $type: string = 'life.ls.ui.ria.dto.MetadataLookupDTO, LifeSuite.UIServiceDTO';
    public source: string;
    public type: string;

    constructor(type: string, source?: string) {
        this.type = type;
        this.source = source;
    }
}
