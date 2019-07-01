import { Component, QueryList, AfterContentInit } from '@angular/core';

import { FormInput } from './form-input';
import { FormInputAccessor } from 'life-core/component/input';

/**
 * Base Wrapper component class for a group of Inputs inside form.
 * Displays input component's label, validation message,
 * and other indicators, such as required field mark.
 */

@Component({
    template: ''
})
export class FormInputGroup extends FormInput implements AfterContentInit {
    protected controlsList: QueryList<FormInputAccessor>;

    public ngAfterContentInit(): void {
        this.updateControls(this.controlsList);
    }

    protected updateControls(controls: QueryList<FormInputAccessor>): void {
        this.controls = controls.toArray();
    }
}
