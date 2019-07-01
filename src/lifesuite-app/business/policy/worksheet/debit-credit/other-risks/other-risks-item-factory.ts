import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { WorksheetRowDTO } from 'ls-core/model';

@Injectable()
export class OtherRisksItemFactory extends BaseDTOItemFactory<WorksheetRowDTO> {
    public newInstance(createItemParams: OtherRisksCreateItemParams<WorksheetRowDTO>): WorksheetRowDTO {
        const worksheetRowDTO = new WorksheetRowDTO();
        worksheetRowDTO.CoveragePersonWorksheetId = this.getNextId(createItemParams.items, 'CoveragePersonWorksheetId');
        worksheetRowDTO.CoveragePersonId = createItemParams.coveragePersonId;
        return worksheetRowDTO;
    }
}

export interface OtherRisksCreateItemParams<T> extends CreateItemParams<T> {
    coveragePersonId: any;
}
