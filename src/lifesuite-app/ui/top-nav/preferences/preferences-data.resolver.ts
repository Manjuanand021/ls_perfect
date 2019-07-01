import { Injectable } from '@angular/core';

import { IDefaultConstructor, ConvertUtil } from 'life-core/util/lang';

import { UserDTO, DataCollectionNames, Identifiable, BaseModel } from 'ls-core/model';
import { ExpandTreeType, NTree } from 'ls-core/service/load-bypk';
import { BaseDTOPKDataResolver } from 'business/policy/shared/data-resolver/base-pk-data.resolver';

@Injectable()
export class PreferencesDataResolver extends BaseDTOPKDataResolver {
    protected getWorkingIdentifier(): Identifiable {
        const identifier = new Identifiable();
        identifier.ClassNameMapped = UserDTO.Type;
        identifier.ObjectID = ConvertUtil.toNumber(this.appSession.user.UserId);
        return identifier;
    }

    protected getExpandTree(): ExpandTreeType {
        const UserDTOLoadTree = new NTree<string>('');
        {
            UserDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Phones,
                DataCollectionNames.Relations,
                DataCollectionNames.AuthorizationLimits,
                DataCollectionNames.Roles
            ]);
        }
        return UserDTOLoadTree;
    }

    protected getCreateObjectType<UserDTO>(): IDefaultConstructor<any> {
        return UserDTO;
    }

    protected getDataFromResponse(response: any): BaseModel {
        return response.dtoObject;
    }
}
