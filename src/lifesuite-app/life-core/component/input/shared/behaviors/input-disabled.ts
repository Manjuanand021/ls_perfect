import { IParameterConstructor } from 'life-core/util/lang';
import { CanReadonly } from './input-readonly';

export interface CanDisable {
    disabled: boolean;
    updateDisabled(value: any): void;
    onDisabledChange(): void;
    isDisabledByAuthorization: boolean;
}

export type CanDisableCtor = IParameterConstructor<CanDisable>;

/**
 * Mix-in to provide a input component with a `disabled` property.
 * See sample mix-in implementations in
 * https://github.com/angular/material2/tree/master/src/lib/core/common-behaviors
 * https://github.com/angular/material2/blob/master/src/lib/radio/radio.ts
 */
export function mixinInputDisabled<T extends IParameterConstructor<CanReadonly>>(base: T): CanDisableCtor & T {
    return class extends base {
        protected _disabled: boolean = false;

        // "Abstract" method; provide implementation in concrete classes.
        public onDisabledChange: () => void;

        // "Abstract" getter; provide implementation in concrete classes.
        public isDisabledByAuthorization: boolean;

        public get disabled(): boolean {
            return this._disabled;
        }
        public set disabled(value: boolean) {
            this.updateDisabled(value);
        }

        public updateDisabled(value: any): void {
            const newValue = this.readonly ? true : this.isDisabledByAuthorization ? true : value;
            if (this._disabled != newValue) {
                this._disabled = newValue;
                this.onDisabledChange();
            }
        }

        constructor(...args: any[]) {
            super(...args);
        }
    };
}
