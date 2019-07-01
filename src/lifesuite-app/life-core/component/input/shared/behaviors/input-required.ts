import { IParameterConstructor } from 'life-core/util/lang';
import { CanReadonly } from './input-readonly';

export interface CanRequire {
    required: boolean;
    updateRequired(value: any): void;
    onRequiredChange(): void;
}

export type CanRequireCtor = IParameterConstructor<CanRequire>;

/**
 * Mix-in to provide a input component with a `required` property.
 * See sample mix-in implementations in
 * https://github.com/angular/material2/tree/master/src/lib/core/common-behaviors
 * https://github.com/angular/material2/blob/master/src/lib/radio/radio.ts
 */
export function mixinInputRequired<T extends IParameterConstructor<CanReadonly>>(base: T): CanRequireCtor & T {
    return class extends base {
        protected _required: boolean = false;

        public onRequiredChange: () => void;

        public get required(): boolean {
            return this._required;
        }
        public set required(value: boolean) {
            this.updateRequired(value);
        }

        public updateRequired(value: any): void {
            if (!this.readonly) {
                const newValue = value === '' ? true : value;
                if (this._required != newValue) {
                    this._required = newValue;
                    this.onRequiredChange();
                }
            }
        }

        constructor(...args: any[]) {
            super(...args);
        }
    };
}
