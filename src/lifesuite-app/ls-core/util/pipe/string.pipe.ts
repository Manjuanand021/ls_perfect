import { Pipe, PipeTransform } from '@angular/core';
/*
 * Translate the boolean number into Yes / No text
 * Usage:
 *   value | getYesNoString
*/

const StringTypes = {
    Yes: 'Yes',
    No: 'No'
};
@Pipe({ name: 'getYesNoString' })
export class GetYesNoStringPipe implements PipeTransform {
    public transform(value: any): string {
        if (value == 0 || value == false) {
            return StringTypes.No;
        } else if (value == -1 || value == true || value == 1) {
            return StringTypes.Yes;
        }
        return StringTypes.No;
    }
}
