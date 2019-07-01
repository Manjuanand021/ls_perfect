import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Components */
import { ComponentsModule } from 'life-core/component/components.module';
import { LplaInputsModule, LPLA_INPUT_EXPORTS } from './input/lpla-inputs.module';
import { NavigationStrip } from 'lpla-core/component/navigation/navigation-strip';
import { Question } from './question/question';
import { QuestionList } from './question-list/question-list';
import { QuestionSection } from './question-section/question-section';
import { StepProgressBar } from './step-progress/step-progress-bar';
import { FormSections, FormSection } from './section';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, LplaInputsModule],
    declarations: [
        NavigationStrip,
        Question,
        QuestionList,
        QuestionSection,
        StepProgressBar,
        FormSections,
        FormSection
    ],
    exports: [
        ...LPLA_INPUT_EXPORTS,
        NavigationStrip,
        Question,
        QuestionList,
        QuestionSection,
        FormSections,
        FormSection
    ],
    providers: []
})
export class LplaComponentsModule {}
