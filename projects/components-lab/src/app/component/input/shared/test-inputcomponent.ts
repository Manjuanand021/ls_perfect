import { Injector, Injectable, SkipSelf, Optional } from '@angular/core';

import { ListItem } from 'life-core/model';
import { ViewModel } from 'life-core/view-model';
import { AuthorizationProvider, AuthorizationLevel } from 'life-core/authorization';
import { ValidationMessagesBuilder } from 'life-core/view-model/validation';
import { FieldDescriptorBase } from 'lpla-core/field';
import { TestInputsUtil, IFields } from './test-inputs.util';
import { ConvertUtil } from 'life-core/util/lang';

@Injectable()
export class DefaultAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = AuthorizationLevel.EDIT;
    }
}

export abstract class TestInputComponent extends ViewModel {
    // Array of FieldDescriptors retrieved from server
    protected fieldDescriptors: FieldDescriptorBase[] = [];

    // uiDataId to FieldDescriptor map
    public fields: IFields = {};

    protected validationMessagesBuilder: ValidationMessagesBuilder;

    //public properties
    public required: boolean = false;

    public disabled: boolean = false;

    public hidden: boolean = false;

    public readonly: boolean = false;

    public trueFalseList: Array<ListItem> = [new ListItem('True', 'true'), new ListItem('False', 'false')];

    public locales: Array<{ label: string; value: string }> = [
        { label: 'en-US', value: 'en-US' },
        { label: 'fr-CA', value: 'fr-CA' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.validationMessagesBuilder = injector.get(ValidationMessagesBuilder);
        this.setupFields();
    }

    public toBoolean(value: string | boolean): boolean {
        return ConvertUtil.toBoolean(value);
    }

    protected setupFields() {
        this.setupFieldsData();
        this.createFieldsMap();
    }

    public abstract setupFieldsData(): void;

    createFieldsMap() {
        this.fields = TestInputsUtil.createFieldsMap(this.fieldDescriptors);
    }
}
