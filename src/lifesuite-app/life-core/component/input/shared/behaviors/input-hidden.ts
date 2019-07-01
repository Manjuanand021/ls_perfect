import { IParameterConstructor } from 'life-core/util/lang';

export interface CanHide {
    hidden: boolean;
    updateHidden(value: any): void;
    onHiddenChange(): void;
    isHiddenByAuthorization: boolean;
}

export type CanHideCtor = IParameterConstructor<CanHide>;

/**
 * Mix-in to provide a input component with a `hidden` property.
 * See sample mix-in implementations in
 * https://github.com/angular/material2/tree/master/src/lib/core/common-behaviors
 * https://github.com/angular/material2/blob/master/src/lib/radio/radio.ts
 */
export function mixinInputHidden<T extends IParameterConstructor<{}>>(base: T): CanHideCtor & T {
    return class extends base {
        protected _hidden: boolean = false;

        // "Abstract" method; provide implementation in concrete classes.
        public onHiddenChange: () => void;

        // "Abstract" getter; provide implementation in concrete classes.
        public isHiddenByAuthorization: boolean;

        public get hidden(): boolean {
            return this._hidden;
        }
        public set hidden(value: boolean) {
            this.updateHidden(value);
        }

        public updateHidden(value: any): void {
            const newValue = this.isHiddenByAuthorization ? true : value;
            if (this._hidden != newValue) {
                this._hidden = newValue;
                this.onHiddenChange();
            }
        }

        constructor(...args: any[]) {
            super(...args);
        }
    };
}
