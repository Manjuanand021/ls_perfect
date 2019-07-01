import { DOMUtil } from 'life-core/util/dom';

export class BrowserUtil {
    /**
     * Suppress event's default action if it doesn't come from an input element
     */
    public static supressEventInNonInputElement(event: Event): void {
        if (!DOMUtil.isInputElement(event.srcElement)) {
            event.preventDefault();
        }
    }
}
