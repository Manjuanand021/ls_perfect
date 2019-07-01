import { Component, Injectable, Input, ViewChildren, QueryList } from '@angular/core';

import { Question, QuestionData } from 'lpla-core/component/question';
import { QuestionSectionData } from './question-section.model';

@Component({
    selector: 'question-section',
    templateUrl: './question-section.html',
    styleUrls: ['./question-section.css']
})
export class QuestionSection {
    @Input() data: QuestionSectionData;

    // Question references for each question
    @ViewChildren(Question) refQuestionList: QueryList<Question>;

    constructor() {}

    public getQuestionViewModel(questionData: QuestionData): any {
        return this.refQuestionList.filter(
            question => (<QuestionData>question.data).questionId == questionData.questionId
        )[0];
    }
}
