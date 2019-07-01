import { Injector, Injectable } from '@angular/core';

import { IDefaultConstructor } from 'life-core/util/lang/object.util';

import { BaseModel, Identifiable, TPADTO } from 'ls-core/model';
import { ExpandTreeType, NTree } from 'ls-core/service/load-bypk';
import { DataCollectionNames } from 'ls-core/model';

import { BaseDTOPKDataResolver } from 'business/policy/shared/data-resolver/base-pk-data.resolver';

@Injectable()
export class TPADataResolver extends BaseDTOPKDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected get tpa(): TPADTO {
        return this.resolvedData;
    }

    protected getExpandTree(): ExpandTreeType {
        const TPADTOLoadTree = new NTree<string>('');
        {
            TPADTOLoadTree.AddChildren([DataCollectionNames.Addresses, DataCollectionNames.Phones]);
        }
        return TPADTOLoadTree;
    }

    protected getWorkingIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = TPADTO.Type;
        identifier.ObjectID = this.appSession.policyDTO.TpaCode;
        return identifier;
    }

    protected getCreateObjectType<TPADTO>(): IDefaultConstructor<any> {
        return TPADTO;
    }

    protected getDataFromResponse(response: any): BaseModel {
        return response.dtoObject;
    }
}
