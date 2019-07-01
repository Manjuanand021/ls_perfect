import { EventEmitter, ElementRef } from '@angular/core';

import { AuthorizationLevel } from 'life-core/authorization';

export interface FormInputAccessor {
    elementRef: ElementRef<HTMLElement>;

    name: string;

    required?: boolean;

    requiredChange?: EventEmitter<boolean>;

    disabled?: boolean;

    disabledChange?: EventEmitter<boolean>;

    hidden?: boolean;

    hiddenChange?: EventEmitter<boolean>;

    authorizationLevel?: AuthorizationLevel;

    setFocus(): void;
}
