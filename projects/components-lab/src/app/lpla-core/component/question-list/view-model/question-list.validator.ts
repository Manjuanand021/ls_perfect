import { QuestionData, questionAnswerValues } from '../../question/question.model';
import { QuestionSectionData } from '../../question-section/question-section.model';
import { ViewValidationResponse } from 'life-core/view-model';

const NOT_ALL_QUESTIONS_ANSWERED = 'You need to answer all questions.';

export class QuestionListValidator implements IQuestionListValidator {
    private _validationResponse: ViewValidationResponse;

    constructor() {
        this._validationResponse = new ViewValidationResponse();
    }

    public validate(sectionList: QuestionSectionData[]): Promise<ViewValidationResponse> {
        var validSectionAnswer: boolean;
        var allAnswersValid: boolean = sectionList.every(section => {
            validSectionAnswer = this.validateSection(section);
            return validSectionAnswer;
        });
        if (!allAnswersValid) {
            this._validationResponse.hasError = true;
            this._validationResponse.errorMessages = new Array<string>();
            this._validationResponse.errorMessages.push(this.getErrorMessage());
        } else {
            this._validationResponse.hasError = false;
        }
        return new Promise<ViewValidationResponse>((accept, reject) => {
            accept(this._validationResponse);
        });
    }

    private validateSection(section: QuestionSectionData): boolean {
        var allAnswersValid: boolean = section.sectionQuestions.every(question => {
            return this.validateQuestion(question);
        });
        return allAnswersValid;
    }

    private validateQuestion(question: QuestionData): boolean {
        var validQuestionAnswer: boolean =
            question.answer != questionAnswerValues.NONE.toString() && question.answer != null;
        if (!validQuestionAnswer) {
            question.invalidAnswer = true;
            question.message = 'Invalid answer.';
        } else {
            question.invalidAnswer = false;
        }
        return validQuestionAnswer;
    }

    protected getErrorMessage(): string {
        return NOT_ALL_QUESTIONS_ANSWERED;
    }
}

export interface IQuestionListValidator {
    validate(sectionList: QuestionSectionData[]): Promise<ViewValidationResponse>;
}
