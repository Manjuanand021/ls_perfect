import { Component, Injectable, Input, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { Question, QuestionData } from 'lpla-core/component/question';
import { QuestionSection, QuestionSectionData } from 'lpla-core/component/question-section';
import { QuestionPageData } from './question-list.model';

@Component({
    selector: 'question-list',
    templateUrl: './question-list.html',
    styleUrls: ["./question-list.css"]
})

export class QuestionList {

    @Input() data: QuestionPageData;

    // Section references for each section
    @ViewChildren(QuestionSection) refSectionList: QueryList<QuestionSection>;

    constructor() {
    }

    public getQuestionViewModel(questionData: QuestionData): any {
        let questionVM: Question;
        this.refSectionList.some(section => {
            return section.refQuestionList.some(question => {
                let matchQuestionId: boolean = (<QuestionData>question.data).questionId == questionData.questionId;
                if (matchQuestionId) {
                    questionVM = question;
                }
                return matchQuestionId;
            });
        })
        return questionVM;
    }
}
