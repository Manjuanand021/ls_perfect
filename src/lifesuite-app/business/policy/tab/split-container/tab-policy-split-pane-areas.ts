import { SplitPaneArea } from 'life-core/component/layout/split';
import { AddCaseNoteDialog } from 'business/policy/note/add-note/case-note';
import { ScratchPadDialogComponent } from 'business/policy/scratch-pad';
import { AddUWNoteDialog } from 'business/policy/note/add-note/uw-note';
import { AddRequirementCaseNoteDialog } from 'business/policy/note/add-note/requirement-case-note';
import { AddMedicalConditionUWNoteDialog } from 'business/policy/note/add-note/medical-condition-uw-note';
import { AddReviewMessageNoteDialog } from 'business/policy/note/add-note/review-message-note';

export const TabPolicySplitPaneAreas = {
    AddCaseNote: 'add-case-note',
    AddCaseSupplementalNote: 'add-case-supplemental-note',
    AddUWNote: 'add-uw-note',
    ScratchPad: 'scratch-pad',
    AddRequirementCaseNote: 'add-req-case-note',
    AddReviewMessageNote: 'add-review-message-note',
    AddMedicalConditionUWNote: 'add-medical-condition-uw-note'
};

export const SplitPaneAreaType = {
    CASE_NOTE: 'caseNote',
    UW_NOTE: 'uwNote',
    SUPPLEMENTAL_NOTE: 'supplementalNote',
    SCRATCH_PAD: 'scratchPad'
};

export const TabPolicySplitPaneAreaDefs = {
    [TabPolicySplitPaneAreas.AddCaseNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddCaseNote,
        type: SplitPaneAreaType.CASE_NOTE,
        size: 75,
        view: AddCaseNoteDialog
    }),
    [TabPolicySplitPaneAreas.AddCaseSupplementalNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddCaseSupplementalNote,
        type: SplitPaneAreaType.SUPPLEMENTAL_NOTE,
        size: 75,
        view: AddCaseNoteDialog
    }),
    [TabPolicySplitPaneAreas.AddUWNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddUWNote,
        type: SplitPaneAreaType.UW_NOTE,
        size: 55,
        view: AddUWNoteDialog
    }),
    [TabPolicySplitPaneAreas.ScratchPad]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.ScratchPad,
        type: SplitPaneAreaType.SCRATCH_PAD,
        size: 45,
        view: ScratchPadDialogComponent
    }),
    [TabPolicySplitPaneAreas.AddRequirementCaseNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddRequirementCaseNote,
        type: SplitPaneAreaType.CASE_NOTE,
        size: 75,
        view: AddRequirementCaseNoteDialog
    }),
    [TabPolicySplitPaneAreas.AddMedicalConditionUWNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddMedicalConditionUWNote,
        type: SplitPaneAreaType.UW_NOTE,
        size: 75,
        view: AddMedicalConditionUWNoteDialog
    }),
    [TabPolicySplitPaneAreas.AddReviewMessageNote]: new SplitPaneArea({
        id: TabPolicySplitPaneAreas.AddReviewMessageNote,
        type: SplitPaneAreaType.CASE_NOTE,
        size: 75,
        view: AddReviewMessageNoteDialog
    })
};
