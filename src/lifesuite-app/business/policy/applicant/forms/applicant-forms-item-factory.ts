import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';

import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { ApplicantQuestionDTO } from 'ls-core/model/dto/applicant-question.dto';

@Injectable()
export class ApplicantFormsItemFactory extends BaseDTOItemFactory<ApplicantQuestionDTO> {
    public newInstance(createItemParams: CreateItemParams<ApplicantQuestionDTO>): ApplicantQuestionDTO {
        const applicantQuestion = new ApplicantQuestionDTO();
        applicantQuestion.QuestionId = this.getNextId(createItemParams.items, 'QuestionId');
        return applicantQuestion;
    }
}
