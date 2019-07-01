import { Prompt } from './prompt';

export class RequiredPrompt extends Prompt {
    public readonly $type: string = 'life.ls.ui.ria.dto.prompt.RequiredPrompt, LifeSuite.UIServiceDTO';

    public Required: boolean;
}
