import { PopoverDataManager } from 'life-core/component/dialog/popover/popover-data.manager';
import { ValidationMessageData } from 'life-core/view-model';
import { CombinedFormInputs } from 'life-core/component/form/form-types';

type ValidationPopoverDataType = {
    validationMessages: ValidationMessageData;
    formInputs: CombinedFormInputs;
};

export class ValidationPopoverDataManager extends PopoverDataManager<ValidationPopoverDataType> {
    constructor() {
        super();
    }
}
