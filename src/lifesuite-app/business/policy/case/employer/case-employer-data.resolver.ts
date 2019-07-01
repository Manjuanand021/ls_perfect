import { Injector, Injectable } from '@angular/core';

import { IDefaultConstructor, ObjectUtil } from 'life-core/util/lang/object.util';

import { BaseModel, Identifiable, EmployerDTO } from 'ls-core/model';
import { ExpandTreeType, NTree } from 'ls-core/service/load-bypk';
import { DataCollectionNames } from 'ls-core/model';

import { BaseDTOPKDataResolver } from 'business/policy/shared/data-resolver/base-pk-data.resolver';

@Injectable()
export class EmployerDataResolver extends BaseDTOPKDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get employer(): EmployerDTO {
        return this.resolvedData;
    }

    protected setResolvedData(responsePayload: any): void {
        const data: any = this.getDataFromResponse(responsePayload.dtoObject);
        const dataType = this.getCreateObjectType();
        this.resolvedData = dataType ? ObjectUtil.createObjectOfType(data, dataType) : data;
    }

    protected getExpandTree(): ExpandTreeType {
        const EmployerDTOLoadTree = new NTree<string>('');
        {
            EmployerDTOLoadTree.AddChildren([DataCollectionNames.Addresses, DataCollectionNames.Phones]);
        }
        return EmployerDTOLoadTree;
    }

    protected getWorkingIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = EmployerDTO.Type;
        identifier.ObjectID = this.appSession.policyDTO.EmployerId;
        return identifier;
    }

    protected getCreateObjectType<EmployerDTO>(): IDefaultConstructor<any> {
        return EmployerDTO;
    }

    protected getDataFromResponse(response: EmployerDTO): BaseModel {
        return response;
    }
}
