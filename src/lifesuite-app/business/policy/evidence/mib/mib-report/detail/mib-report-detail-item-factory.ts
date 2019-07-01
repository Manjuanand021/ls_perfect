import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { MIBDTO } from 'ls-core/model';
import { MIBMasterGridNodeIds } from '../../mib.resources';

@Injectable()
export class MIBReportDetailItemFactory extends BaseDTOItemFactory<MIBDTO> {
    public newInstance(createItemParams: CreateItemParams<MIBDTO>): MIBDTO {
        const mibDTO = new MIBDTO();
        mibDTO.MibHeaderId = this.getNextId(createItemParams.items, MIBMasterGridNodeIds.MibHeaderId);
        return mibDTO;
    }
}
