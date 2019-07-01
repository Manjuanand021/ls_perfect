import { Prompt } from './prompt';

export class OverridablePrompt extends Prompt {
    public readonly $type: string = 'life.ls.ui.ria.dto.prompt.OverridablePrompt, LifeSuite.UIServiceDTO';

    public Overridable: boolean;
    public CheckedOff: boolean;
}
