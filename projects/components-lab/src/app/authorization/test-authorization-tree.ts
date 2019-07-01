import { Component, SkipSelf, Optional, Injectable, Injector } from '@angular/core';

import { AuthorizationProvider, AuthorizationData, AuthorizationLevel } from 'life-core/authorization';
import { ViewModel, ParentChildRegistry } from 'life-core/view-model';

//==================================
//  PARENT COMPONENT
//==================================

@Injectable()
export class ParentAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = AuthorizationLevel.VIEW;
        this.authorizationData.componentLevel = { some_parent_field: AuthorizationLevel.EDIT };
    }
}

@Component({
    selector: 'test-parent',
    template: `
		<div>PARENT Component</div>
        <pre>Parent AuthorizationData: {{authorizationData | json}}</pre>
        <test-child></test-child>
    `,
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ParentAuthorizationProvider }]
})
export class TestAuthorizationParent extends ViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}

//==================================
//  CHILD COMPONENT
//==================================

@Injectable()
export class ChildAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.componentLevel = {
            editableTextField: AuthorizationLevel.EDIT,
            viewOnlyTextField: AuthorizationLevel.VIEW,
            maskField: AuthorizationLevel.VIEW
        };
    }
}

@Component({
    selector: 'test-child',
    template: `
		<div>CHILD Component</div>
        <pre>Child AuthorizationData: {{authorizationData | json}}</pre>
        <div class="row">
            <div class="col-sm-3">
                <lf-form-input label="InputText - Always Authorized (Edit)" [control]="editableTextField">
                    <lf-inputtext #editableTextField name="editableTextField" secureComponent required></lf-inputtext>
                </lf-form-input>
            </div>
            <div class="col-sm-3">
                <lf-form-input label="InputText - Always Unauthorized (View)" [control]="viewOnlyTextField">
                    <lf-inputtext #viewOnlyTextField name="viewOnlyTextField" secureComponent required></lf-inputtext>
                </lf-form-input>
            </div>
            <div class="col-sm-3">
                <lf-form-input label="InputMask" [control]="maskField">
                    <lf-inputmask #maskField name="maskField" mask="999-99-9999" [(ngModel)]="data.mask" placeholder="999-99-9999" secureComponent></lf-inputmask>
                </lf-form-input>
            </div>            
        </div>
            
        <test-grandchild></test-grandchild>
    `,
    providers: [{ provide: AuthorizationProvider, useClass: ChildAuthorizationProvider }]
})
export class TestAuthorizationChild extends ViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}

//==================================
//  GRANDCHILD COMPONENT
//==================================
@Injectable()
export class GrandChildAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = AuthorizationLevel.NONE;
        this.authorizationData.componentLevel = { abc: AuthorizationLevel.EDIT };
    }
}

@Component({
    selector: 'test-grandchild',
    template: `
		<div>GRANDCHILD Component</div>
        <pre>Grandchild AuthorizationData: {{authorizationData | json}}</pre>
    `,
    providers: [{ provide: AuthorizationProvider, useClass: GrandChildAuthorizationProvider }]
})
export class TestAuthorizationGrandchild extends ViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
