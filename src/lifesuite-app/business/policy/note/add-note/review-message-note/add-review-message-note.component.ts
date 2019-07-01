import { Component, ViewChild } from '@angular/core';

import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { EmailUtil } from 'life-core/util/email';
import { DialogViewModelResult, DialogButtonType } from 'life-core/component/dialog';
import { ObjectUtil } from 'life-core/util/lang';
import { ListUtil } from 'life-core/util';
import { PolicySubscriber } from 'ls-core/session';
import { ReviewMessageDTO, NoteDTO } from 'ls-core/model';

import { AddCaseNoteComponent } from 'business/policy/note/add-note/case-note';
import { ReviewMessagesType } from 'business/policy/worksheet/review-messages/review-messages-type';
import { CheckableMessagesComponent } from './checkable-messages/checkable-messages.component';

@Component({
    selector: 'add-review-message-note',
    templateUrl: './add-review-message-note.component.html',
    providers: [ParentChildRegistry, PolicySubscriber, EmailUtil]
})
export class AddReviewMessageNoteComponent extends AddCaseNoteComponent {
    public activeReviewMessage: ReviewMessageDTO;
    @ViewChild(CheckableMessagesComponent)
    public checkableMessagesComponent: CheckableMessagesComponent;

    public setModel(model: any): void {
        this.activeReviewMessage = model.parameterData.reviewMessage;
        super.setModel(model);
        this.data.Topic = this.showSubjectFieldList
            ? this.activeReviewMessage.ReviewMessageId.toString()
            : this.activeReviewMessage.Message;
    }

    protected setApplicantListAvailability(): void {
        this.isApplicantListDisabled = true;
    }

    protected loadSubjectList(): void {
        this.subjectListOptions = ListUtil.convertToListItems([this.activeReviewMessage], 'Message', 'ReviewMessageId');
    }

    protected setSubjectFieldAvailability(): void {
        super.setSubjectFieldAvailability();
        this.isSubjectDisabled = true;
    }

    protected addNote(): void {
        if (this.showSubjectFieldList) {
            this.data.Topic = !this.isSupplementalNote
                ? this.subjectListOptions.find(subject => subject.value == this.data.Topic).label
                : this.parentNote.Topic;
        } else {
            this.data.Topic = !this.isSupplementalNote ? this.data.Topic : this.parentNote.Topic;
        }
        super.addNote();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId === DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    this.addNote();
                    if (this.needReview) {
                        this.handleNoteReview(result);
                    }
                    if (this.isActiveReviewMessageCheckable()) {
                        this.updateActiveReviewMessage();
                    }
                    if (this.isNoteAppliedToOtherCheckableMessages()) {
                        this.assignNoteToOtherCheckableMessages();
                    }
                    return new DialogViewModelResult(this.data, result === ViewValidationResult.pass, this.isDirty());
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private isActiveReviewMessageCheckable(): boolean {
        return this.activeReviewMessage.MessageType == ReviewMessagesType.CHECKABLE.toString();
    }

    private updateActiveReviewMessage(): void {
        this.activeReviewMessage.MessageType = ReviewMessagesType.CHECKED_OFF.toString();
        this.activeReviewMessage.CheckoffFlag = -1; // setup checked flag to on.
    }

    private isNoteAppliedToOtherCheckableMessages(): boolean {
        return this.checkableMessagesComponent && this.checkableMessagesComponent.selectedMessages != undefined;
    }

    private assignNoteToOtherCheckableMessages(): void {
        this.checkableMessagesComponent.selectedMessages.forEach(selectedReviewMessage => {
            const newNote: NoteDTO = ObjectUtil.deepCopy(this.data) as NoteDTO;
            newNote.Topic = selectedReviewMessage.Message;
            selectedReviewMessage.reviewNote = newNote;
            selectedReviewMessage.MessageType = ReviewMessagesType.CHECKED_OFF.toString();
            selectedReviewMessage.CheckoffFlag = -1;
        });
    }
}
