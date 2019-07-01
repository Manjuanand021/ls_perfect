import { IViewModel } from '../view-model';
import { FormValidationMessage } from './form/view-form.validator';
import { ServerValidationMessage } from './server/server-validation-message';

export class ViewValidationParams {
    public viewId: string;
    public serviceId: string;
    public methodId: string;
    public viewModel: IViewModel;
    public needToValidateForm: boolean;
    public validationData: any;

    constructor(viewId: string, viewModel: IViewModel, needToValidateForm: boolean, validationData: any) {
        this.viewId = viewId;
        this.viewModel = viewModel;
        this.needToValidateForm = needToValidateForm;
        this.validationData = validationData;
        this.serviceId = '';
        this.methodId = '';
    }
}

export class ValidationMessageData {
    public formMessages: FormValidationMessage[];
    public serverMessages: ServerValidationMessage[];

    constructor(formMessages: FormValidationMessage[], serverMessages: ServerValidationMessage[]) {
        this.formMessages = formMessages;
        this.serverMessages = serverMessages;
    }
}

export class ViewValidationResponse {
    public hasError: boolean;
    public errorMessages: string[];
    public formValidationMessages: FormValidationMessage[];
    public hasWarning: boolean;
    public warningMessages: string[];

    constructor() {
        this.errorMessages = [];
        this.warningMessages = [];
    }
}

export enum ViewValidationResult {
    fail = 0,
    pass = 1
}

export enum ValidationRenderType {
    never = 1,
    allways = 2,
    ifNeeded = 3
}
