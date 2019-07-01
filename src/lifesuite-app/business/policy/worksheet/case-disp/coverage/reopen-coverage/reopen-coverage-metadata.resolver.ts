import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class ReopenCoverageMetaDataResolver extends BaseMetaDataResolver {

	protected getMetadataTypes(): string[] {
        return ["final_action_reason_reopened", "system"];
	}
}
