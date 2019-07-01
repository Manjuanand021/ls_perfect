import { Injector, Component, ViewChild } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { ButtonActionType } from 'life-core/component';
import { ConvertUtil } from 'life-core/util/lang';


import { AutoNavigationManager, IAutoNavigation } from 'ls-core/auto-navigation';
import { PolicySubscriber } from 'ls-core/session';
import { LsAppConfig, SystemSetting } from 'ls-core/config';
import { InsuredDTO } from 'ls-core/model';
import { INavigationSequence } from 'ls-core/model/auto-navigation/navigation-sequence.interface';
import { NavigationTargetTypes, NavigationTarget } from 'ls-core/model/auto-navigation/navigation-target';

import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { NotesComponent } from './notes.component';
import { NoteListComponent } from './note-list/note-list.component';
import { CaseNotesAuthorizationProvider } from './case-notes-authorization.provider';
import { NoteUtil } from 'business/policy/shared';
import { AutoNavigationChannels } from 'business/shared/auto-navigation/auto-navigation-channels';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'case-notes',
    templateUrl: './case-notes.component.html',
    providers: [
        PolicySubscriber,
        AutoNavigationManager,
        { provide: AuthorizationProvider, useClass: CaseNotesAuthorizationProvider }
    ]
})
export class CaseNotesComponent extends NotesComponent implements IAutoNavigation {
    public title: string;
    public addCaseNoteButtonActionType: ButtonActionType = ButtonActionType.DataChange;
    public activeNoteId: number;
    private _autoNavigationManager: AutoNavigationManager;
    @ViewChild(NoteListComponent)
    protected caseNoteListComponent: NoteListComponent;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        appConfig: LsAppConfig,
        autoNavigationManager: AutoNavigationManager,
        i18n: I18n
    ) {
        super(injector, policySubscriber, appConfig);
        this._appConfig = appConfig;
        this._autoNavigationManager = autoNavigationManager;
        this.initializeAutoNavigationChannel();
        this.i18n = i18n;
    }

    public initializeAutoNavigationChannel(): void {
        this._autoNavigationManager.registerWithNavigationChannel(
            AutoNavigationChannels.CaseNotes,
            (sequence: INavigationSequence) => {
                this.processNavigationSequence(sequence);
            }
        );
    }

    public processNavigationSequence(sequence: INavigationSequence): void {
        const target = sequence.getNextNavigationTarget();
        if (target && target.targetType === NavigationTargetTypes.CollectionItem) {
            this.activeNoteId = ConvertUtil.toNumber(target.getParam(NavigationTarget.PARAM_TARGET_ID));
            this._autoNavigationManager.continueNavigation(sequence, target, AutoNavigationChannels.CaseNotes);
        }
    }

    public addCaseNote(): void {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddCaseNote
        });
    }

    protected get noteListComponent(): NoteListComponent {
        return this.caseNoteListComponent;
    }

    protected setTitle(): void {
        this.title = this.i18n({ value: 'Case Notes', id: '@@policy.notes.casenotes.paneltitle' });
    }
}
