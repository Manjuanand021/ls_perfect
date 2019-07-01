import { Injector, Input, Component, ViewChild } from '@angular/core';

import {
    IItem,
    CreateItemEventData,
    ItemList,
    ItemListViewModel,
    IItemListComponentResolver
} from 'life-core/component/item-list';
import { Logger } from 'life-core/logging';

import { PolicySubscriber } from 'ls-core/session';
import { Identifiable, NoteDTO, PolicyDTO } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';
import { SortByOptions } from 'ls-core/model/const/sort-order-types';

import {
    NoteTypeCategories,
    NoteUtil,
    All_Applicants_Id,
    PersonIdToPolicyPersonIdMapper
} from 'business/policy/shared';
import { NoteComponentResolverHerlper } from '../note-component-resolver.helper';

@Component({
    selector: 'note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.css'],
    providers: [PolicySubscriber]
})
export class NoteListComponent extends ItemListViewModel<NoteDTO> {
    @Input()
    public selectedApplicantId: string = All_Applicants_Id.toString();
    @Input()
    public selectedNoteTypeCategory: string = NoteTypeCategories.ALL;
    @Input()
    public sortByOption: string;
    @Input()
    public title: string = 'Notes';
    @Input()
    public activeNoteId: number;
    public policy: PolicyDTO;
    private _activeApplicantPolicyPersonId: number;

    @ViewChild(ItemList)
    public refItemList: ItemList<NoteDTO>;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, logger: Logger) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.onPolicyUpdate(p);
        });
        this.editModeOnly = true;
    }

    public onApplicantChange(selectedApplicant: string): void {
        this.selectedApplicantId = selectedApplicant;
        this.reloadItems();
    }

    public onNoteTypeCategoryChange(selectedNoteTypeCategory: string): void {
        this.selectedNoteTypeCategory = selectedNoteTypeCategory;
        this.reloadItems();
    }

    public onSortByOptionChange(sortByOption: string): void {
        this.sortByOption = sortByOption;
        this.reloadItems();
    }

    public refreshNotes(): void {
        this.reloadItems();
    }

    protected setupNewItem(data: NoteDTO): IItem<NoteDTO> {
        const item = super.setupNewItem(data);
        item.selected = this.isActiveNote(data);
        return item;
    }

    protected get itemDataIDPropertyName(): string {
        return 'NoteId';
    }

    protected getItemList(): ItemList<NoteDTO> {
        return this.refItemList;
    }

    protected getItems(): Promise<IItem<NoteDTO>[]> {
        const items: IItem<NoteDTO>[] = [];
        const filteredNotes = this.getFilteredNotes();
        filteredNotes.forEach(note => {
            items.push(this.setupNewItem(note));
        });
        return Promise.resolve(items);
    }

    protected getItemComponentResolver(): IItemListComponentResolver<NoteDTO> {
        const resolverHelper = new NoteComponentResolverHerlper();
        return resolverHelper.getResolver(this.editModeOnly);
    }

    protected createItem(eventData: CreateItemEventData<NoteDTO>): Promise<any> {
        const note = new NoteDTO();
        note.identifier = new Identifiable();
        return Promise.resolve(note);
    }

    protected removeItem(item: IItem<NoteDTO>): Promise<boolean> {
        this.policy.Notes_LazyLoad.splice(this.policy.Notes_LazyLoad.indexOf(item.data), 1);
        return Promise.resolve(true);
    }

    private onPolicyUpdate(policy: PolicyDTO): void {
        const reloading = !!this.policy;
        this.policy = policy;
        if (reloading) {
            this.reloadItems();
        }
    }

    private isActiveNote(data: NoteDTO): boolean {
        return data.NoteId === this.activeNoteId;
    }

    private getFilteredNotes(): NoteDTO[] {
        if (this.policy.Notes_LazyLoad == null) {
            this.policy.Notes_LazyLoad = [];
        }
        this._activeApplicantPolicyPersonId = PersonIdToPolicyPersonIdMapper.getPolicyPersonIdFromPersonId(
            Number(this.selectedApplicantId),
            this.policy
        );
        const filteredItems = this.filterItems(this.policy.Notes_LazyLoad);
        return this.sortItems(filteredItems);
    }

    private filterItems(items: NoteDTO[]): NoteDTO[] {
        return items.filter(note => {
            return this.filterByApplicantAndNoteType(note);
        });
    }

    private filterByApplicantAndNoteType(note: NoteDTO): boolean {
        return this.filterByApplicant(note) && this.filterByNoteType(note);
    }

    private filterByApplicant(note: NoteDTO): boolean {
        return this.selectedApplicantId == All_Applicants_Id.toString()
            ? true
            : note.PolicyPersonId == this._activeApplicantPolicyPersonId;
    }

    private filterByNoteType(note: NoteDTO): boolean {
        return this.selectedNoteTypeCategory == NoteTypeCategories.ALL
            ? NoteUtil.isCaseOrUWNote(note.NoteType)
            : NoteUtil.getNoteTypeCategory(note.NoteType) == this.selectedNoteTypeCategory;
    }

    private sortItems(items: NoteDTO[]): NoteDTO[] {
        if (!this.sortByOption) {
            return items;
        }
        return items.sort((a, b) => {
            return this.sortItemsByOrder(a, b);
        });
    }

    private sortItemsByOrder(a: NoteDTO, b: NoteDTO): number {
        const compareResult = DBDateUtil.compareDates(a[sortByField], b[sortByField]);
        return this.sortByOption == SortByOptions.ASC ? compareResult : -compareResult;
    }
}

export const NotesChannels = {
    SelectedApplicantChange: 'selected-applicant-change',
    NoteCategoryChange: 'note-category-change',
    SortByOptionChange: 'sortby-option-change'
};

export const sortByField = 'AddedDate';
