import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';
import { CountryStateCodes } from 'business/policy/shared';

@Injectable()
export class CaseMetaDataResolver extends BaseMetaDataResolver {
  protected getMetadataTypes(): string[] {
    return [...CountryStateCodes, 'country','system'];
  }
}
