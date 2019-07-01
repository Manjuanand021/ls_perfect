import { Component, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';

@Component({
    selector: 'test-parent-form-view',
    template: `
		<form #form="ngForm">
			<div>Parent view</div>
			<lf-form-input label="Parent view Field" [control]="parentTextField">
				<lf-inputtext #parentTextField name="parentTextField" [(ngModel)]="parentTextFieldModel" required></lf-inputtext>
			</lf-form-input>
			<div style="border: 1px solid; margin: 10px;">
				<test-child-form-view></test-child-form-view>
			</div>
			<lf-button label="Validate View" styleClass="btn" (onClick)="onValidateButtonClick($event)"></lf-button>
		</form>
	`,
    providers: [ParentChildRegistry]
})
export class TestParentFormView extends ViewModel {
    parentTextFieldModel: string = 'abc';

    constructor(injector: Injector) {
        super(injector);
    }

    onValidateButtonClick(event: any): void {
        this.validate().then(result => {
            if (result) {
                alert('View is valid!');
            }
        });
    }
}
