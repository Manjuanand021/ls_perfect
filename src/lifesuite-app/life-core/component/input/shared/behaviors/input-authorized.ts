import { IParameterConstructor } from 'life-core/util/lang';
import { AuthorizationLevel } from 'life-core/authorization';

export interface CanAuthorize {
    authorizationLevel: AuthorizationLevel;
    updateAuthorizationLevel(value: AuthorizationLevel): void;
    onAuthorizationLevelChange(): void;
}

export type CanAuthorizeCtor = IParameterConstructor<CanAuthorize>;

/**
 * Mix-in to provide a input component with a `authorizationLevel` property.
 * See sample mix-in implementations in
 * https://github.com/angular/material2/tree/master/src/lib/core/common-behaviors
 * https://github.com/angular/material2/blob/master/src/lib/radio/radio.ts
 */
export function mixinInputAuthorized<T extends IParameterConstructor<{}>>(base: T): CanAuthorizeCtor & T {
    return class extends base {
        protected _authorizationLevel: AuthorizationLevel;

        // "Abstract" method; provide implementation in concrete classes.
        public onAuthorizationLevelChange: () => void;

        public get authorizationLevel(): AuthorizationLevel {
            return this._authorizationLevel;
        }

        public set authorizationLevel(value: AuthorizationLevel) {
            this.updateAuthorizationLevel(value);
        }

        public updateAuthorizationLevel(value: AuthorizationLevel): void {
            this._authorizationLevel = value;
            this.onAuthorizationLevelChange();
        }

        constructor(...args: any[]) {
            super(...args);
        }
    };
}
