import { Component, Injector, Type } from '@angular/core';

import { ItemViewModel } from 'life-core/component/item-list';
import { CompareResult } from 'life-core/util/lang';
import { IComponentResolver, ComponentResolver, ComponentMap, DateFormatter } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { NoteDTO, DBDate } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';

import { NoteTypeCategories, NoteUtil } from 'business/policy/shared';
import { CaseNoteComponent, UWNoteComponent } from './type';

@Component({
    selector: 'note-info',
    templateUrl: './note-info.component.html'
})
export class NoteInfoComponent extends ItemViewModel<NoteDTO> {
    public itemComponentType: Type<any>;
    public panelHeader: string;
    public iconClass: string;
    public isIconVisible: boolean;
    public panelNoteType: string;
    private _componentMapResolver: IComponentResolver<string>;
    private _dateFormatter: DateFormatter;

    constructor(injector: Injector, dateFormatter: DateFormatter, i18n: I18n) {
        super(injector);
        this._componentMapResolver = this.getComponentMapResolver();
        this._dateFormatter = dateFormatter;
        this.i18n = i18n;
    }

    public loadData(): Promise<void> {
        this.setItemComponentType(this.item.data.NoteType);
        this.panelNoteType = `panel_note_${this.item.data.NoteType}`;
        return Promise.resolve();
    }

    public setModel(model: any): void {
        super.setModel(model);
        this.setNotePanelHeader();
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(NoteTypeCategories.CASE, CaseNoteComponent);
        componentMap.add(NoteTypeCategories.UW, UWNoteComponent);
        return new ComponentResolver<string>(componentMap);
    }

    private setItemComponentType(type: string): void {
        const noteTypeCategory = NoteUtil.getNoteTypeCategory(type);
        this.itemComponentType = this._componentMapResolver.resolve(noteTypeCategory);
    }

    private setNotePanelHeader(): void {
        const noteTypeCategory = NoteUtil.getNoteTypeCategory(this.item.data.NoteType);
        const createdDate = this._dateFormatter.format(this.item.data.AddedDate.dateAndTimeAsString);
        const topic = this.item.data.Topic || '';
        this.isIconVisible = this.shouldShowAlertIcon(this.item.data);
        if (this.isIconVisible) {
            this.iconClass = this.getAlertIcon(this.item.data);
        }
        this.panelHeader = `${this.i18n(
            { value: 'Note - {{noteTypeCategory}}', id: 'policy.notes.panel.title.primary' },
            { noteTypeCategory: noteTypeCategory }
        )} ${this.i18n(
            { value: 'Note, {{createdDate}}, {{topic}}', id: 'policy.notes.panel.title.secondary' },
            { createdDate: createdDate, topic: topic }
        )}`;
    }

    private getAlertIcon(note: NoteDTO): string {
        return 'ls-note-alert-icon';
    }

    private shouldShowAlertIcon(note: NoteDTO): boolean {
        if (note.SupplementalNotes.length > 0) {
            return (
                this.isNoteReviewDateTodayOrPast(note.DiaryDate) ||
                this.isAnySupplementalNoteReviewDateTodayOrPast(note.SupplementalNotes)
            );
        }
        return this.isNoteReviewDateTodayOrPast(note.DiaryDate);
    }

    private isNoteReviewDateTodayOrPast(reviewDate: DBDate): boolean {
        return (
            reviewDate &&
            reviewDate.dateAndTimeAsString !== '' &&
            DBDateUtil.compareDates(reviewDate, DBDateUtil.dateToDBDate(new Date())) == CompareResult.less
        );
    }

    private isAnySupplementalNoteReviewDateTodayOrPast(supplementalNotes: NoteDTO[]): boolean {
        return supplementalNotes.find(suppNote => this.isNoteReviewDateTodayOrPast(suppNote.DiaryDate)) !== undefined;
    }
}
