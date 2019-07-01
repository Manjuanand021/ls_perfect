import { Injectable, Injector } from '@angular/core';

import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { AppSession } from 'ls-core/session';
import { NoteDTO } from 'ls-core/model';

@Injectable()
export class AddCaseNoteListDataResolver extends BaseListDataResolver {
    public context?: any;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder: ListDataRequestBuilder = new ListDataRequestBuilder();
        const note = this.getNote();
        listDataRequestBuilder.setRootDTO(this._appSession.policyDTO);
        listDataRequestBuilder.addListRequestItem(note, 'UserType');
        listDataRequestBuilder.addListRequestItem(note, 'ReferToUserId');
        return listDataRequestBuilder.getRequest();
    }

    private getNote(): NoteDTO {
        // if context is passed from casenotecomponent when visibility option is changed,
        // use that to send note with selected visibility option to middle tier
        // to get correct lists else newNote on initial load of component.
        return this.context ? (this.context as NoteDTO) : new NoteDTO();
    }
}
