import { IParameterConstructor } from 'life-core/util/lang';

export interface CanReadonly {
    readonly: boolean;
}

export type CanReadonlyCtor = IParameterConstructor<CanReadonly>;

/**
 * Mix-in to provide a input component with a `readonly` property.
 * See sample mix-in implementations in
 * https://github.com/angular/material2/tree/master/src/lib/core/common-behaviors
 * https://github.com/angular/material2/blob/master/src/lib/radio/radio.ts
 */
export function mixinInputReadonly<T extends IParameterConstructor<{}>>(base: T): CanReadonlyCtor & T {
    return class extends base {
        protected _readonly: boolean = false;

        public get readonly(): boolean {
            return this._readonly;
        }

        public set readonly(value: boolean) {
            this._readonly = value;
        }

        constructor(...args: any[]) {
            super(...args);
        }
    };
}
