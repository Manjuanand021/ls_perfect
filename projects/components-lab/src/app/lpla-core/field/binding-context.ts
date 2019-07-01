export class BindingContext {
	formId: string;
    domContext: any;

	constructor(formId: string, domContext?: any) {
		this.formId = formId;
		this.domContext = domContext;
	}
}