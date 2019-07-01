import { Component, Injector, Injectable, SkipSelf, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ViewModel } from 'life-core/view-model';
import { AuthorizationProvider, AuthorizationLevel } from 'life-core/authorization';
import { FormInput } from 'life-core/component/form';
import { Validator, ValidationError, ValidatorTypes, ValidationResult } from 'life-core/component/input';
import { DBDateUtil } from 'ls-core/util';
import { PhoneModel, CrediCardExpirationDateModel, DateRange } from 'life-core/component/input';

@Injectable()
export class InputsAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.componentLevel['editableTextField'] = AuthorizationLevel.EDIT;
        this.authorizationData.componentLevel['viewOnlyTextField'] = AuthorizationLevel.VIEW;
    }
}

@Component({
    selector: 'test-authorization-inputs',
    templateUrl: './test-authorization-inputs.html',
    providers: [{ provide: AuthorizationProvider, useClass: InputsAuthorizationProvider }]
})
export class TestAuthorizationInputs extends ViewModel {
    data: any = DUMMY_DATA;

    public dateValidators: Array<Validator> = [yearNotEqualTo2005Validator, yearNotEqualTo2007Validator];

    dropdownList: Array<{ label: string; value: string }> = [
        { label: 'Item a', value: 'a' },
        { label: 'Item b', value: 'b' },
        { label: 'Item c', value: 'c' }
    ];

    constructor(injector: Injector) {
        super(injector);
    }

    public onSomeHyperlinkClick(event: any): void {
        console.debug(event);
    }

    public onAllInputsDisableClick(event: Event, disable: boolean): void {
        const inputs = this.getFormInputs();
        inputs.forEach(input => {
            if (!this.isInputEventTarget(input, event)) {
                input.control.disabled = disable;
            }
        });
    }

    public onAllInputsHideClick(event: Event, hide: boolean): void {
        const inputs = this.getFormInputs();
        inputs.forEach(input => {
            if (!this.isInputEventTarget(input, event)) {
                input.control.hidden = hide;
            }
        });
    }

    public onAllInputsRequireClick(event: Event, require: boolean): void {
        const inputs = this.getFormInputs();
        inputs.forEach(input => {
            if (!this.isInputEventTarget(input, event)) {
                input.control.required = require;
            }
        });
    }

    isInputEventTarget(input: FormInput, event: Event): boolean {
        return event.currentTarget == input.control.elementRef.nativeElement;
    }
}

const DUMMY_DATA = {
    editableText: 'Always editable',
    viewOnlyText: 'Always view-only',
    text: 'abc',
    textarea: 'abc\ndef',
    number: 123,
    date: DBDateUtil.dateToDBDate(new Date('01/01/2006')),
    minDate: new Date('1/1/2000'),
    maxDate: new Date('1/1/2010'),
    mask: '123456789',
    checkbox: 1,
    dropdown: 'b',
    radiobutton: 2,
    phone: { areaCode: '123', prefix: '456', suffix: '7890', ext: '' } as PhoneModel,
    taxId: '111-22-3344',
    bankAccount: '123456789',
    bankRoutingNumber: '120304055',
    creditcardexpiration: { month: '03', year: '2020' } as CrediCardExpirationDateModel,
    creditcardnumber: '4111111111111111',
    height: 70,
    weight: 190,
    daterange: { minDate: new Date('3/2/2000'), maxDate: new Date('10/5/2010') } as DateRange,
    zipcode: '12345-6789', // Canadian postal code is in different format
    hyperlinkValue: 12345.56
};

const yearNotEqualTo2005Validator: Validator = (control: FormControl, value?: any): ValidationResult => {
    const controlValue: any = value ? value : control.value;
    const error: ValidationError = {
        type: ValidatorTypes.DateRange,
        control: control,
        value: controlValue
    };
    const result: ValidationResult = {
        invalidDate: error
    };
    return controlValue && controlValue.getFullYear() == 2005 ? result : null;
};

const yearNotEqualTo2007Validator: Validator = (control: FormControl, value?: any): ValidationResult => {
    const controlValue: any = value ? value : control.value;
    const error: ValidationError = {
        type: ValidatorTypes.DateRange,
        control: control,
        value: controlValue
    };
    const result: ValidationResult = {
        invalidDate: error
    };
    return controlValue && controlValue.getFullYear() == 2007 ? result : null;
};
