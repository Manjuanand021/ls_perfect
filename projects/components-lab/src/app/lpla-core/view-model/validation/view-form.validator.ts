import {ViewFormValidatorBase, IViewFormValidatorBase} from './base-view-form.validator';
import { ViewValidationResponse } from 'life-core/view-model';

const FORM_MESSAGE_VALUE_REQUIRED = 'Data entered is invalid.  Please review your entries and try again.';

export class ViewFormValidator extends ViewFormValidatorBase implements IViewFormValidator {

    public validate(formId: string): ViewValidationResponse {
        return this.validateImpl(formId, true, false);
    }

    protected getInvalidMessage(): string {
        return FORM_MESSAGE_VALUE_REQUIRED;
    }
}

export interface IViewFormValidator extends IViewFormValidatorBase {
    validate(formId: string): ViewValidationResponse;
}


