
import { QuestionSectionData} from 'lpla-core/component/question-section';

export class QuestionPageData {
    sectionList: QuestionSectionData[];

    constructor() {
        this.sectionList = new Array<QuestionSectionData>();
    }
}

