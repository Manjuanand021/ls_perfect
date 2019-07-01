import { Pipe } from '@angular/core';

import { ListItem, ListMap } from 'life-core/model';
import { ListPickerPipe } from 'life-core/util/pipe/list-picker.pipe';
import { CountryCodes } from 'ls-core/model';
/*
 * Pick the state list based on country
 * Usage:
 *   list | stateListPicker: countryId
*/
@Pipe({ name: 'stateListPicker' })
export class StateListPickerPipe extends ListPickerPipe {
    public transform(list: ListMap<any>, selector: string): Array<ListItem> {
        return super.transform(list, selector, CountryListMap);
    }
}

export const CountryListMap = {
    USA: CountryCodes.USA,
    CANADA: CountryCodes.CANADA
};
