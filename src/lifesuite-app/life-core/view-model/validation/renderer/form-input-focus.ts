import { Injectable } from '@angular/core';

import { FormInput } from 'life-core/component/form';
import { AnimationTransitionBehaviour } from 'life-core/util/animation';
import { LsAppConfig } from 'ls-core/config';

@Injectable({
    providedIn: 'root'
})
export class FormInputFocus {
    private _config: LsAppConfig;

    constructor(config: LsAppConfig) {
        this._config = config;
    }

    public setFocus(formInput: FormInput, dialogContainer: Element): void {
        setTimeout(() => {
            window.scrollBy({
                left: 0,
                top: this.getScrollByTop(formInput, dialogContainer),
                behavior: AnimationTransitionBehaviour.Smooth
            });
            formInput.showFocusedError();
        }, 0);
    }

    private getScrollByTop(formInput: FormInput, dialogContainer: Element): number {
        const inputElement = formInput.elementRef.nativeElement;
        const inputElementTop = inputElement.getBoundingClientRect().top;
        const offsetFromPageTop = this.getOffsetFromPageTop(inputElement, dialogContainer);
        return inputElementTop - offsetFromPageTop;
    }

    private getOffsetFromPageTop(inputElement: HTMLElement, dialogContainer: Element): number {
        const dialogHeight = dialogContainer.clientHeight;
        const offsetFromDialogBottom = inputElement.offsetParent.clientHeight / 2; // make this relevant to formInput's height.
        return this._config.fixedTopBarHeight + dialogHeight + offsetFromDialogBottom;
    }
}
