import { Component } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { EmailUtil } from 'life-core/util/email';
import { PolicySubscriber } from 'ls-core/session';

import { AddCaseNoteComponent } from 'business/policy/note/add-note/case-note';
import { ListUtil } from 'life-core/util';

@Component({
    selector: 'add-requirement-note',
    templateUrl: '../case-note/add-case-note.component.html',
    providers: [ParentChildRegistry, PolicySubscriber, EmailUtil]
})
export class AddRequirementNoteComponent extends AddCaseNoteComponent {
    private _requirementsList: any;
    public setModel(model: any): void {
        this._requirementsList = model.parameterData.requirementList;
        super.setModel(model);
        this.data.Topic = model.parameterData.requirement.RequirementCode;
    }

    protected loadSubjectList(): void {
        this.subjectListOptions = ListUtil.convertToListItems(this._requirementsList, 'label', 'value');
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

    protected setSubjectFieldAvailability(): void {
        super.setSubjectFieldAvailability();
        this.isSubjectDisabled = true;
    }

    protected setApplicantListAvailability(): void {
        this.isApplicantListDisabled = true;
    }
}
