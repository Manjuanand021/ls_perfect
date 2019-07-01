import { AfterContentInit, AfterViewInit, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AuthorizationData, AuthorizationLevel } from 'life-core/authorization';
import { ISecureComponent } from 'life-core/component/authorization';
import { Field } from '../model/field.interface';
import { FieldConfig } from '../model/field-config.interface';
import { FormFieldEvent } from '../event/dynamic-form.event';

export interface DynamicFormInput extends Field {
    formInput?: FormInput;
    eventSource?: EventEmitter<any>;
    index?: string;
    authorizationData?: AuthorizationData;
}

export abstract class AbstractDynamicFormInput
    implements DynamicFormInput, ISecureComponent, AfterContentInit, AfterViewInit, OnDestroy {
    public name: string;
    public config: FieldConfig;
    public data?: Object;
    public formInput?: FormInput;
    public eventSource?: EventEmitter<FormFieldEvent>;
    public index?: string;
    public authorizationData?: AuthorizationData;
    public authorizationLevel: AuthorizationLevel;

    private _cdr: ChangeDetectorRef;

    constructor(cdr: ChangeDetectorRef) {
        this._cdr = cdr;
    }

    public ngAfterContentInit(): void {
        this.setAuthorizationLevel();
    }

    public ngAfterViewInit(): void {
        this._cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this._cdr = null;
    }

    private setAuthorizationLevel(): void {
        if (this.authorizationData) {
            this.authorizationLevel = this.authorizationData.getLevel(this.config.name);
        }
    }

    protected hasDependendFields(): boolean {
        return this.config.dependentFields && this.config.dependentFields.length > 0;
    }

    protected needToRaiseChangeEvent(): boolean {
        return this.config.raiseEvent || this.hasDependendFields();
    }
}
