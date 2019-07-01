import { Injectable } from '@angular/core';
import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { VelogicaDTO } from 'ls-core/model';

@Injectable()
export class VelogicaItemFactory extends BaseDTOItemFactory<VelogicaDTO> {
    public newInstance(createItemParams: CreateItemParams<VelogicaDTO>): VelogicaDTO {
        const velogicaDTO = new VelogicaDTO();
        velogicaDTO.VelogicaHeaderId = this.getNextId(createItemParams.items, 'VelogicaHeaderId');
        return velogicaDTO;
    }
}
