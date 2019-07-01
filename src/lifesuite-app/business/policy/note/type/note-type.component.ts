import { Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ConvertUtil } from 'life-core/util/lang/convert.util';
import { ICompose } from 'life-core/component/compose';
import { IItem } from 'life-core/component/item-list';
import { AppSession } from 'ls-core/session';
import { ApplicantHelper, NoteUtil } from 'business/policy/shared';
import { ListUtil } from 'life-core/util';
import { NoteDTO } from 'ls-core/model';

@Injectable()
export class NoteTypeComponent extends ViewModel<NoteDTO> implements ICompose {
    public item: IItem<NoteDTO>;
    public applicantName: string;
    protected appSession: AppSession;

    constructor(injector: Injector) {
        super(injector);
        this.appSession = injector.get(AppSession);
    }

    public setModel(model: any): void {
        this.item = model;
        this.data = this.item.data;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.applicantName = this.getApplicantName();
        return Promise.resolve();
    }

    public getApplicantName(): string {
        const applicant = ApplicantHelper.getApplicantByPolicyPersonId(
            this.appSession.policyDTO.Insureds_LazyLoad,
            ConvertUtil.toNumber(this.data.PolicyPersonId)
        );
        return ApplicantHelper.getApplicantFullName(applicant);
    }

    public getNoteTypeCategory(noteType: string): string {
        return NoteUtil.getNoteTypeCategory(noteType);
    }

    public getNoteTypeValue(noteType: string): string {
        return noteType ? ListUtil.getLabelByValue(this.listData.note_type, noteType) : '';
    }

    public getAuthorName(note: NoteDTO): string {
        const author = note.PrimaryAuthor ? note.PrimaryAuthor : note.Author;
        return author ? ListUtil.getLabelByValue(this.listData.aus_users, author.toString()) : '';
    }

    public getReferredToUserName(note: NoteDTO): string {
        const referredToUser = note.ReferToUserId ? note.ReferToUserId : null;
        return referredToUser ? ListUtil.getLabelByValue(this.listData.aus_users, referredToUser.toString()) : '';
    }
}
