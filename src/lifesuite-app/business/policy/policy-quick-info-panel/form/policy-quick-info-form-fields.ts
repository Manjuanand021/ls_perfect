import { Injectable } from '@angular/core';

import { FieldConfig } from 'life-core/component/dynamic-form';

@Injectable()
export class PolicyQuickInfoFormFields {
    private _fields: Array<FieldConfig> = new Array<FieldConfig>();

    public get loaded(): boolean {
        return this._fields.length > 0;
    }

    public set(value: FieldConfig[]): void {
        this._fields = value;
    }

    public get(): FieldConfig[] {
        return this._fields;
    }
}
