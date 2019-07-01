import {ViewFormValidatorBase, IViewFormValidatorBase} from './base-view-form.validator';
import { ViewValidationResponse } from 'life-core/view-model';

const FORM_SECTION_MESSAGE_VALUE_REQUIRED = 'Some data entered in this section is invalid.  Please review your entries and try again.';

export class ViewFormSectionValidator extends ViewFormValidatorBase implements IViewFormSectionValidator {

    public validate(formId: string, hideMessages: boolean): ViewValidationResponse {
        return this.validateImpl(formId, false, hideMessages);
    }

    protected getInvalidMessage(): string {
        return FORM_SECTION_MESSAGE_VALUE_REQUIRED;
    }
}

export interface IViewFormSectionValidator extends IViewFormValidatorBase {
    validate(formId: string, hideMessages: boolean): ViewValidationResponse;
}


