import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { ImpairmentRestrictionDTO } from 'ls-core/model';

@Injectable()
export class ImpairmentItemFactory extends BaseDTOItemFactory<ImpairmentRestrictionDTO> {
	public newInstance(createItemParams: CreateItemParams<ImpairmentRestrictionDTO>): ImpairmentRestrictionDTO {
		let impairmentDTO = new ImpairmentRestrictionDTO();
		impairmentDTO.CoveragePersonImpairmentId = this.getNextId(createItemParams.items, "CoveragePersonImpairmentId");
		return impairmentDTO;
	}
}

