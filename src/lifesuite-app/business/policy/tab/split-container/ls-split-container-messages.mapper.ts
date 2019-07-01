import { Injectable } from '@angular/core';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { I18n } from 'life-core/i18n';

@Injectable()
export class LSSplitContainerMessagesMapper {
    protected i18n: I18n;
    private _splitContainerMessagesMap: Map<string, any>;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.setupMessages();
    }

    public getMessage(areaId: string): string {
        return this._splitContainerMessagesMap.has(areaId) ? this._splitContainerMessagesMap.get(areaId) : '';
    }

    private setupMessages(): void {
        const multipleNotesMessage = this.i18n({
            value: 'Multiple notes of the same type cannot be opened at the same time.',
            id: 'split-pane.error.multiple-notes'
        });

        this._splitContainerMessagesMap = new Map([
            [TabPolicySplitPaneAreas.AddCaseNote, multipleNotesMessage],
            [TabPolicySplitPaneAreas.AddCaseSupplementalNote, multipleNotesMessage],
            [TabPolicySplitPaneAreas.AddUWNote, multipleNotesMessage],
            [TabPolicySplitPaneAreas.AddRequirementCaseNote, multipleNotesMessage],
            [TabPolicySplitPaneAreas.AddReviewMessageNote, multipleNotesMessage],
            [TabPolicySplitPaneAreas.AddMedicalConditionUWNote, multipleNotesMessage],
            [
                TabPolicySplitPaneAreas.ScratchPad,
                this.i18n({
                    value: 'Multiple scratch pads cannot be opened at the same time.',
                    id: 'split-pane.error.multiple-scratch-pads'
                })
            ]
        ]);
    }
}
