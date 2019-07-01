import { Type } from '@angular/core';

export class QuestionData {
    questionId: number;
    insuredId: string;
    questionText: string;
    triggerValue: number;
    detailQuestionPageName: string;
    detailPageViewModelType: Type<any>;
    getViewModelTypeStrategy: (detailPageName: string) => Type<any>;  //method to provide custom view strategy
    answer: string;
    invalidAnswer: boolean;
    message: string;
    isDetailActive: boolean = false;

    updateViewModelType(): void {
        this.detailPageViewModelType = this.getViewModelTypeStrategy(this.detailQuestionPageName);
    }
}

export class Answer {
    questionId: number;
    answer: number;
}

export class questionAnswerValues {
    public static NONE: number = 0;
    public static YES: number = 1;
    public static NO: number = 2;
}
