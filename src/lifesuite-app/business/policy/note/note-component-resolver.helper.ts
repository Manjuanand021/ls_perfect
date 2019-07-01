import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemListComponentResolver } from 'life-core/component/item-list';

import { NoteDTO } from 'ls-core/model';

import { NoteInfoComponent } from './note-info.component';

export class NoteComponentResolverHerlper {
    public getResolver(editModeOnly: boolean): IItemListComponentResolver<NoteDTO> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemComponentType(),
            resolverField: null,
            editModeOnly: editModeOnly
        });
    }

    private getItemComponentType(): Type<any> {
        return NoteInfoComponent;
    }
}
