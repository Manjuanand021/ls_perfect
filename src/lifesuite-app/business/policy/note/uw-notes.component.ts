import { Injector, Component, ViewChild } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ButtonActionType } from 'life-core/component';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { PolicySubscriber } from 'ls-core/session';
import { NotesComponent } from './notes.component';
import { NoteListComponent } from './note-list/note-list.component';
import { UWNotesAuthorizationProvider } from './uw-notes-authorization.provider';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { NoteUtil } from 'business/policy/shared';
import { LsAppConfig, SystemSetting } from 'ls-core/config';
import { InsuredDTO } from 'ls-core/model';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'uw-notes',
    templateUrl: './uw-notes.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: UWNotesAuthorizationProvider }]
})
export class UWNotesComponent extends NotesComponent {
    public title: string;
    public addUWNoteButtonActionType: ButtonActionType = ButtonActionType.DataChange;

    @ViewChild(NoteListComponent)
    protected uwNoteListComponent: NoteListComponent;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, appConfig: LsAppConfig, i18n: I18n) {
        super(injector, policySubscriber, appConfig);
        this._appConfig = appConfig;
        this.i18n = i18n;
    }

    public addUWNote(): void {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddUWNote
        });
    }

    protected get noteListComponent(): NoteListComponent {
        return this.uwNoteListComponent;
    }

    protected setTitle(): void {
        this.title = this.i18n({ value: 'UW Notes', id: '@@policy.notes.uwnotes.paneltitle' });
    }
}
