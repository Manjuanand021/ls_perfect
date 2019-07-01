import { Type } from '@angular/core';

import { QuestionData, Answer, questionAnswerValues } from '../../question/question.model';
import { QuestionSectionData } from '../../question-section/question-section.model';
import { QuestionPageData } from '../question-list.model';

import { ViewValidationResponse } from 'life-core/view-model';

export class QuestionListDataManager {
    private _reflexiveQuestionData: any;

    private getViewModelTypeStrategy: (detailPageName: string) => Type<any>;

    constructor(getViewModelTypeStrategy: any) {
        this.getViewModelTypeStrategy = getViewModelTypeStrategy;
    }

    public setupQuestionListData(reflexiveQuestionData: any): QuestionPageData {
        let sectionData: QuestionSectionData;
        this._reflexiveQuestionData = reflexiveQuestionData;
        let questionPageData = new QuestionPageData();
        reflexiveQuestionData.pages[0].sections.forEach(section => {
            sectionData = this.setupSectionData(section);
            questionPageData.sectionList.push(sectionData);
        });
        return questionPageData;
    }

    private setupSectionData(section: any): QuestionSectionData {
        var question: QuestionData;
        var sectionData = new QuestionSectionData();
        sectionData.sectionNumber = section.sectionNumber;
        sectionData.sectionTitle = section.sectionTitle;
        sectionData.sectionText = section.sectionText;
        sectionData.includeEmptySection = section.includeEmptySection;
        section.sectionQuestions.forEach(sectionQuestion => {
            question = this.setupQuestionData(sectionQuestion);
            sectionData.sectionQuestions.push(question);
        });
        return sectionData;
    }

    private setupQuestionData(sectionQuestion: any): QuestionData {
        var questionData: QuestionData = new QuestionData();
        questionData.questionId = sectionQuestion.questionId;
        questionData.insuredId = this._reflexiveQuestionData.insureds[0].insuredGUID;
        questionData.questionText = sectionQuestion.questionText;
        questionData.triggerValue = sectionQuestion.triggerValue;
        if (sectionQuestion.detailQuestionPageName) {
            questionData.detailQuestionPageName = sectionQuestion.detailQuestionPageName;
            questionData.getViewModelTypeStrategy = this.getViewModelTypeStrategy;
            questionData.updateViewModelType();
        }
        var answerData: Answer = this._reflexiveQuestionData.insureds[0].answers.find(
            answer => answer.questionId == sectionQuestion.questionId
        );
        if (answerData != null) {
            questionData.answer = answerData.answer.toString();
        }
        return questionData;
    }

    public prepareDataForSave(reflexiveQuestionData: any, questionPageData: QuestionPageData): void {
        let primaryInsured: any = reflexiveQuestionData.insureds[0];
        questionPageData.sectionList.forEach(section => {
            section.sectionQuestions.forEach(question => {
                var answerData: Answer = primaryInsured.answers.find(
                    answer => answer.questionId == question.questionId
                );
                if (answerData == null) {
                    answerData = new Answer();
                    answerData.questionId = question.questionId;
                    primaryInsured.answers.push(answerData);
                }
                if (question.answer == null) {
                    answerData.answer = questionAnswerValues.NONE;
                } else {
                    answerData.answer = parseInt(question.answer);
                }
            });
        });
    }
}
