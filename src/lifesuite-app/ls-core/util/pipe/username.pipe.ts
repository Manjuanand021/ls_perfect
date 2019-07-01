import { Pipe, PipeTransform } from '@angular/core';

import { ListItem } from 'life-core/model';

import { MetadataUtil } from 'ls-core/util';

/*
 * Displays user name from the list for given give user id 
 * Usage:
 *   value | username : list
*/
@Pipe({ name: 'username' })
export class UserNamePipe implements PipeTransform {
    public transform(value: string, list: Array<ListItem>): string {
        if (value) {
            return MetadataUtil.getItemLabelByCode(list, value);
        } else {
            return '';
        }
    }
}
