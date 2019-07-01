import { Component, Injector, Injectable } from '@angular/core';

import { AuthorizationProvider, AuthorizationLevel } from 'life-core/authorization';
import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';

import { PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { SortByOptions } from 'ls-core/model/const/sort-order-types';

import { All_Applicants_Id, NoteTypeCategories } from 'business/policy/shared';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { CaseNotesAuthorizationProvider } from '../case-notes-authorization.provider';
import { UWNotesAuthorizationProvider } from '../uw-notes-authorization.provider';
import { NotesComponentLevelPrivileges } from '../notes-component-level-privileges';
import { CombinedNotesAuthorizationProvider } from '../combined-notes-authorization.provider';

@Component({
    selector: 'view-notes',
    templateUrl: './view-notes.component.html',
    providers: [
        ParentChildRegistry,
        PolicySubscriber,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider },
        CaseNotesAuthorizationProvider,
        UWNotesAuthorizationProvider,
        CombinedNotesAuthorizationProvider
    ]
})
@Injectable()
export class ViewNotesComponent extends ViewModel {
    public activeApplicantId: number = All_Applicants_Id;
    public selectedSortByOption: string = SortByOptions.DESC;
    public title: string;
    public selectedNoteTypeCategory: string;

    private _caseNotesAuthorizationProvider: CaseNotesAuthorizationProvider;
    private _uwNotesAuthorizationProvider: UWNotesAuthorizationProvider;
    private _combinedNotesAuthorizationProvider: CombinedNotesAuthorizationProvider;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        caseNotesAuthorizationProvider: CaseNotesAuthorizationProvider,
        uwNotesAuthorizationProvider: UWNotesAuthorizationProvider,
        combinedNotesAuthorizationProvider: CombinedNotesAuthorizationProvider,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        policySubscriber.subscribe(this, p => {
            this.onPolicyUpdate(p);
        });
        this._caseNotesAuthorizationProvider = caseNotesAuthorizationProvider;
        this._uwNotesAuthorizationProvider = uwNotesAuthorizationProvider;
        this._combinedNotesAuthorizationProvider = combinedNotesAuthorizationProvider;
        this.setNoteTypeCategory();
    }

    private onPolicyUpdate(policy: PolicyDTO): void {
        this.title = this.getViewNotesTitle(policy.PolicyNumber);
    }

    private getViewNotesTitle(policyNumber: string): string {
        return `${this.i18n(
            { value: 'Notes - Case: {{policyNumber}}', id: 'policy.notes.viewnotes.title' },
            { policyNumber: policyNumber }
        )}`;
    }

    private setNoteTypeCategory(): void {
        if ((this.hasCaseNotesPrivilege() && this.hasUwNotesPrivilege()) || this.hasCombinedNotesPrivilege()) {
            this.selectedNoteTypeCategory = NoteTypeCategories.ALL;
        } else if (this.hasCaseNotesPrivilege()) {
            this.selectedNoteTypeCategory = NoteTypeCategories.CASE;
        } else if (this.hasUwNotesPrivilege()) {
            this.selectedNoteTypeCategory = NoteTypeCategories.UW;
        }
    }

    private hasCaseNotesPrivilege(): boolean {
        return (
            this._caseNotesAuthorizationProvider.getAuthorizationData().componentLevel[
                NotesComponentLevelPrivileges.AddCaseNote
            ] > AuthorizationLevel.NONE
        );
    }

    private hasUwNotesPrivilege(): boolean {
        return (
            this._uwNotesAuthorizationProvider.getAuthorizationData().componentLevel[
                NotesComponentLevelPrivileges.AddUWNote
            ] > AuthorizationLevel.NONE
        );
    }

    private hasCombinedNotesPrivilege(): boolean {
        return this._combinedNotesAuthorizationProvider.getAuthorizationData().defaultLevel > AuthorizationLevel.NONE;
    }
}
