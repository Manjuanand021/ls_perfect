import { Injectable } from '@angular/core';

import { ValueFormatter } from './value.formatter';
import { NameUtil } from './name.util';
import { NamePattern } from './name-pattern';

@Injectable({ providedIn: 'root' })
export class NameFormatter implements ValueFormatter {
    /**
     * Returns formatted name based on specified pattern.
     * Pattern       Display
     * ------------  --------------------------
     * "LastAndFirstName"        Doe, John
     * "FirstAndLastName"         John Doe
     * "LastFirstAndMiddleInitial"	 Doe, John A.
     * "NameWithTitleSuffixAndMiddleInitial"  Dr. John A. Doe Jr.
     * "NameWithTitleAndSuffix"   Dr. John Adam Doe Jr.
     * "OnlyInitials"    JAD
     */

    public format(
        pattern: NamePattern,
        firstName: string,
        lastName: string,
        middleName?: string,
        title?: string,
        suffix?: string
    ): string {
        let name;
        switch (pattern) {
            case NamePattern.LastAndFirstName: {
                name = NameUtil.getFullName({ firstName: lastName, lastName: firstName, delimiter: ', ' });
                break;
            }
            case NamePattern.FirstAndLastName: {
                name = NameUtil.getFullName({ firstName, lastName });
                break;
            }
            case NamePattern.LastFirstAndMiddleInitial: {
                name = NameUtil.getFullNameWithMiddleInitial({ firstName, middleName, lastName });
                break;
            }
            case NamePattern.NameWithTitleSuffixAndMiddleInitial: {
                const middleInitial = middleName ? ` ${middleName.charAt(0)}.` : '';
                name = NameUtil.getFullName({ title, firstName, middleName: middleInitial, lastName, suffix });
                break;
            }
            case NamePattern.NameWithTitleAndSuffix: {
                name = NameUtil.getFullName({ title, firstName, middleName, lastName, suffix });
                break;
            }
            case NamePattern.OnlyInitials: {
                name = NameUtil.getInitials({ firstName, middleName, lastName });
                break;
            }
        }
        return name || '';
    }
}
