import { ElementRef } from '@angular/core';

import { DialogCoordinates } from './dialog-coordinates';

export class DialogUtil {
    public static getDialogWindowElement(dialogElementRef: ElementRef<HTMLElement>): HTMLElement {
        // TODO: Find our why using HostBinding directive as in this example
        // doesn't work with NgbModalDialog
        // https://netbasal.com/querying-for-the-closest-parent-element-in-angular-b2554d60c47e
        const cssClassDialogWindow = 'modal';
        return this.getClosestElement(dialogElementRef.nativeElement, cssClassDialogWindow);
    }

    public static getModalDialogElement(dialogElementRef: ElementRef<HTMLElement>): HTMLElement {
        const cssClassModalDialog = 'modal-dialog';
        return this.getClosestElement(dialogElementRef.nativeElement, cssClassModalDialog);
    }

    public static getModalContentElement(dialogElementRef: ElementRef<HTMLElement>): HTMLElement {
        const cssClassModalContent = 'modal-content';
        return this.getClosestElement(dialogElementRef.nativeElement, cssClassModalContent);
    }

    private static getClosestElement(element: HTMLElement, query: string): HTMLElement {
        return element.closest(`.${query}`) as HTMLElement;
    }

    public static getDialogCoordinates(dialogWindowElement: HTMLElement): DialogCoordinates {
        const dialogWindowRect = dialogWindowElement.getBoundingClientRect();
        return new DialogCoordinates(dialogWindowRect.left, dialogWindowRect.top);
    }
}
