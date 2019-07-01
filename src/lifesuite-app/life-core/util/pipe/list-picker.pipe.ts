import { Pipe, PipeTransform } from '@angular/core';

import { ListItem, ListMap } from 'life-core/model';
/*
 * Pick the list based on selector
 * Usage:
 *   list | listPicker: selector
*/
@Pipe({ name: 'listPicker' })
export class ListPickerPipe implements PipeTransform {
    public transform(list: ListMap<any>, selector: string, selectorMap?: { [key: string]: string }): Array<ListItem> {
        if (selectorMap) {
            selector = selectorMap[selector];
        }
        return list[selector];
    }
}
