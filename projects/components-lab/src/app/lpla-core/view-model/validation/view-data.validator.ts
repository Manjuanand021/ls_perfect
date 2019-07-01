import { IViewModel, ViewValidationResponse} from 'life-core/view-model';

export class ViewDataValidator implements IViewDataValidator {

    private _validationResponse: ViewValidationResponse;

    public validate(viewModel: IViewModel): ViewValidationResponse {
        this.initData();
        let isViewDataValid: boolean = this.validateData(viewModel);
        this._validationResponse.hasError = !isViewDataValid;
        if (!isViewDataValid) {
            this._validationResponse.errorMessages.push(this.getInvalidDataMessage());
        }
        return this._validationResponse;
    }

    protected initData(): void {
        this._validationResponse = new ViewValidationResponse();
        this._validationResponse.errorMessages = [];
    }

    protected validateData(viewModel: IViewModel): boolean {
        // override in subclass
        return true;
    }

    protected getInvalidDataMessage(): string {
        // override in subclass if needed
        return 'Data entered is invalid.  Please review your entries and try again.';
    }
}

export class ViewValidationParams {
    constructor(viewId: string, formId: string, viewModel: IViewModel, needToValidateForm: boolean, validationData: any) {
        this.viewId = viewId;
        this.formId = formId;
        this.viewModel = viewModel;
        this.needToValidateForm = needToValidateForm;
        this.validationData = validationData;
        this.serviceId = "";
        this.methodId = "";
    }

    viewId: string;
    formId: string;
    serviceId: string;
    methodId: string;
    viewModel: IViewModel;
    needToValidateForm: boolean;
    validationData: any;
}

export interface IViewDataValidator {
    validate(viewModel: IViewModel): ViewValidationResponse;
}