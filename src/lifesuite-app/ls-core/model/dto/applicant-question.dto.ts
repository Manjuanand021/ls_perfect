import { BaseModel } from '../core/base.model';

export class ApplicantQuestionDTO extends BaseModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ApplicantQuestionDTO, LifeSuite.UIServiceDTO';

    public PolicyPersonId: number;

    public QuestionId: number;

    public FormCode: string;

    public QuestionText: string;

    public AltQuestionText: string;

    public Answer: string;

    public AnswerSetName: string;

    public Comment: string;

    public BlankFirstItem: boolean;

    public Label: string;

    public IsModified: boolean;
}
