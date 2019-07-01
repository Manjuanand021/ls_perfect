import { Injector, Injectable } from '@angular/core';

import { IDefaultConstructor } from 'life-core/util/lang/object.util';

import { BaseModel, Identifiable, AgencyDTO } from 'ls-core/model';
import { ExpandTreeType, NTree } from 'ls-core/service/load-bypk';
import { DataCollectionNames } from 'ls-core/model';

import { BaseDTOPKDataResolver } from 'business/policy/shared/data-resolver/base-pk-data.resolver';

@Injectable()
export class AgencyDataResolver extends BaseDTOPKDataResolver {
    public agencyPersonId: number;

    constructor(injector: Injector) {
        super(injector);
    }

    protected get agency(): AgencyDTO {
        return this.resolvedData;
    }

    protected getExpandTree(): ExpandTreeType {
        const AgencyDTOLoadTree = new NTree<string>('');
        {
            AgencyDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Phones,
                DataCollectionNames.Relations
            ]);
        }
        return AgencyDTOLoadTree;
    }

    protected getWorkingIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = AgencyDTO.Type;
        identifier.ObjectID = this.agencyPersonId;
        return identifier;
    }

    protected getCreateObjectType<AgencyDTO>(): IDefaultConstructor<any> {
        return AgencyDTO;
    }

    protected getDataFromResponse(response: any): BaseModel {
        return response.dtoObject;
    }
}
