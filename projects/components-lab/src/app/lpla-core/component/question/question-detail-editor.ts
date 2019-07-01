import { Injectable, Injector } from '@angular/core';

import { DataService, DataResponse } from 'lpla-core/service';
import { ICompose } from 'life-core/component/compose';
import { QuestionDetail } from 'lpla-core/component/question';
import { DataConfigUrlRequest } from 'lpla-core/field';

@Injectable()
export class QuestionDetailEditor extends QuestionDetail {

    constructor(container: Injector) {
        super(container);
    }

    protected getDataConfigUrlRequest(): DataConfigUrlRequest {
		let dataConfigUrlRequest = new DataConfigUrlRequest();
        var reflexiveQuestionDetailRequest: ReflexiveQuestionDetailRequest = new ReflexiveQuestionDetailRequest();
        reflexiveQuestionDetailRequest.insuredId = this.data.insuredId;
        reflexiveQuestionDetailRequest.questionId = this.data.questionId;
        dataConfigUrlRequest.payLoad = reflexiveQuestionDetailRequest;
        
        return dataConfigUrlRequest;
    }

}

export class ReflexiveQuestionDetailRequest {

    static Type: string = 'life.businessService.businessDataModel.request.ReflexiveQuestionDetailRequest, BusinessDataModel';

    $type: string = ReflexiveQuestionDetailRequest.Type;
    questionId: number;
    insuredId: string;
    productId: number;
}