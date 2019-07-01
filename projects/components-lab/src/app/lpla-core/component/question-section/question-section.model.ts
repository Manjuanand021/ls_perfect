
import {QuestionData} from 'lpla-core/component/question';

export class QuestionSectionData {
    sectionNumber: string;
    sectionText: string;
    sectionTitle: string;
    includeEmptySection: number;
    sectionQuestions: QuestionData[];
    constructor() {
        this.sectionQuestions = new Array<QuestionData>();
    }
}
