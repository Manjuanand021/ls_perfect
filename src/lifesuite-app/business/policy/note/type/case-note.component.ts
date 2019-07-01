import { Component, Injector } from '@angular/core';

import { ButtonActionType } from 'life-core/component';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { NoteDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { TabPolicySplitPaneAreas } from 'business/policy/tab';
import { NoteTypeComponent } from './note-type.component';

@Component({
    selector: 'case-note',
    templateUrl: './case-note.component.html',
    styleUrls: ['./case-note.component.css']
})
export class CaseNoteComponent extends NoteTypeComponent {
    public showAddSupplementalButton: boolean;
    public addSupplementalButtonActionType: ButtonActionType = ButtonActionType.DataChange;

    private _messagingService: IMessagingService;

    constructor(injector: Injector, messagingService: MessagingService) {
        super(injector);
        this._messagingService = messagingService;
        this.setShowAddSupplementalButton();
    }

    private setShowAddSupplementalButton(): void {
        const appSession = this.injector.get(AppSession);
        this.showAddSupplementalButton = appSession.isStandalone === false;
    }

    public addSupplementalNote(): void {
        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddCaseSupplementalNote,
            context: this.getSupplementalNoteContext()
        });
    }

    private getSupplementalNoteContext(): CaseNoteContext {
        const context = new CaseNoteContext();
        context.parentNote = this.data;
        return context;
    }
}

export class CaseNoteContext {
    public parentNote: NoteDTO;
}
