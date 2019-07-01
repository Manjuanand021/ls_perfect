import { Component, forwardRef, Provider, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { LfInputPhone, INPUTPHONE_PROVIDERS } from 'life-core/component/input';
import { ModelProperty } from 'life-core/component/input';
import { SecureComponent } from 'life-core/component/authorization';

export const INPUTPHONE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LsInputPhone),
    multi: true
};

@Component({
    selector: 'ls-inputphone',
    templateUrl: '../../../life-core/component/input/inputphone/lf-inputphone.html',
    styleUrls: ['../../../life-core/component/input/shared/lf-composite-input.css'],
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTPHONE_VALUE_ACCESSOR,
        ...INPUTPHONE_PROVIDERS,
        { provide: SecureComponent, useExisting: forwardRef(() => LsInputPhone) }
    ]
})
export class LsInputPhone extends LfInputPhone {
    protected get modelProperties(): Array<ModelProperty> {
        return [
            { name: 'AreaCode', type: 'string' },
            { name: 'Prefix', type: 'string' },
            { name: 'Suffix', type: 'string' },
            { name: 'Extension', type: 'string' }
        ];
    }
}
