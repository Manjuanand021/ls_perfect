import { Injector, Injectable } from '@angular/core';

import { IDefaultConstructor, ObjectUtil } from 'life-core/util/lang/object.util';

import { BaseModel, Identifiable, AssociationDTO } from 'ls-core/model';
import { ExpandTreeType, NTree } from 'ls-core/service/load-bypk';
import { DataCollectionNames } from 'ls-core/model';

import { BaseDTOPKDataResolver } from 'business/policy/shared/data-resolver/base-pk-data.resolver';

@Injectable()
export class AssociationDataResolver extends BaseDTOPKDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get association(): AssociationDTO {
        return this.resolvedData;
    }

    protected setResolvedData(responsePayload: any): void {
        const data: any = this.getDataFromResponse(responsePayload.dtoObject);
        const dataType = this.getCreateObjectType();
        this.resolvedData = dataType ? ObjectUtil.createObjectOfType(data, dataType) : data;
    }

    protected getExpandTree(): ExpandTreeType {
        const associationDTOLoadTree = new NTree<string>('');
        {
            associationDTOLoadTree.AddChildren([DataCollectionNames.Addresses, DataCollectionNames.Phones]);
        }
        return associationDTOLoadTree;
    }

    protected getWorkingIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = AssociationDTO.Type;
        identifier.ObjectID = this.appSession.policyDTO.AssociationCode;
        return identifier;
    }

    protected getCreateObjectType<AssociationDTO>(): IDefaultConstructor<any> {
        return AssociationDTO;
    }

    protected getDataFromResponse(response: AssociationDTO): BaseModel {
        return response;
    }
}
