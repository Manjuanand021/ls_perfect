import { Injectable } from '@angular/core';
import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { MVRDTO } from 'ls-core/model';

@Injectable()
export class MVRItemFactory extends BaseDTOItemFactory<MVRDTO> {
    public newInstance(createItemParams: CreateItemParams<MVRDTO>): MVRDTO {
        const mvrDTO = new MVRDTO();
        mvrDTO.MvrHeaderId = this.getNextId(createItemParams.items, 'MvrHeaderId');
        return mvrDTO;
    }
}
