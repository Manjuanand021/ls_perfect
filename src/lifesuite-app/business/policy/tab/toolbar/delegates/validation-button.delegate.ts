import { FormValidationMessage, ServerValidationMessage, ValidationMessageData } from 'life-core/view-model';

export class ValidationButtonDelegate {
    private _formValidationMessages: FormValidationMessage[] = [];
    private _serverValidationMessages: ServerValidationMessage[] = [];

    public onFormValidationMessagesChange(messages: FormValidationMessage[]): void {
        this._formValidationMessages = messages;
    }

    public onServerValidationMessagesChange(messages: ServerValidationMessage[]): void {
        this._serverValidationMessages = messages;
    }

    public get validationMessageCount(): number {
        return this._formValidationMessages.length + this._serverValidationMessages.length;
    }

    public needToShowValidationButton(): boolean {
        return this.validationMessageCount > 0;
    }

    public getValidationMessagesData(): ValidationMessageData {
        return new ValidationMessageData(this._formValidationMessages, this._serverValidationMessages);
    }
}
