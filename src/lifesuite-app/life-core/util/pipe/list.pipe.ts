import { Pipe, PipeTransform } from '@angular/core';

import { ArrayUtil } from 'life-core/util/lang';
import { ListItem } from 'life-core/model';

/*
 * Translate an Array<any> into Array<ListItem>
 * Usage:
 *   list | listItems:labelProperty:valueProperty
*/
@Pipe({ name: 'listItems' })
export class GetListItemsPipe implements PipeTransform {
    public transform(list: Array<any>, labelProperty: string, valueProperty: string): Array<ListItem> {
        if (!list) return list;
        return list.map(item => {
            return new ListItem(item[labelProperty], item[valueProperty]);
        });
    }
}

/*
 * Add empty item to an Array<ListItem> if it's not there.
 * Usage:
 *   list | emptyItem
 *     or
 *   list | emptyItem:empty_item_label:empty_item_value
*/
@Pipe({ name: 'emptyItem' })
export class AddEmptyListItemPipe implements PipeTransform {
    public transform(
        list: Array<ListItem>,
        emptyItemlabel: string = '',
        emptyItemValue: string = null
    ): Array<ListItem> {
        if (!list) return list;
        let emptyItem = list.find(item => {
            return item.label === emptyItemlabel; // && (item.value === emptyItemValue || item.value == '');
        });
        if (emptyItem != null) return list;
        emptyItem = new ListItem(emptyItemlabel, emptyItemValue);
        return [emptyItem, ...list];
    }
}

/*
 * Sort Array<any> by a property of its items
 * Usage:
 *   list | sortList
 *     or
 *   list | sortList:listProperty
*/
@Pipe({ name: 'sortList' })
export class SortListItemsPipe implements PipeTransform {
    public transform(list: Array<any>, listProperty: string = 'label'): Array<any> {
        if (!list) return list;
        return list.sort((a, b) => {
            if (a[listProperty] > b[listProperty]) {
                return 1;
            } else if (a[listProperty] < b[listProperty]) {
                return -1;
            } else {
                return 0;
            }
        });
    }
}

/*
 * Join Array<any> by a property of its items
 * Usage:
 *   list | joinList
 *     or
 *   list | joinList:listProperty:separator
*/
@Pipe({ name: 'joinList' })
export class JoinListItemsPipe implements PipeTransform {
    public transform(list: Array<any>, listProperty: string = 'label', separator: string = ' | '): string {
        return ArrayUtil.joinList(list, listProperty, separator);
    }
}
