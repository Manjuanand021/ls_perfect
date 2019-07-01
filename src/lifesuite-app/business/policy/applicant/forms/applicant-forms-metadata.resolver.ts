import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';
import { ApplicantQuestionDTO } from 'ls-core/model';

@Injectable()
export class ApplicantFormsMetaDataResolver extends BaseMetaDataResolver {
    public context: ApplicantQuestionDTO;
    protected getMetadataTypes(): string[] {
        return [`Answer Set ${this.context.AnswerSetName}`];
    }
}
