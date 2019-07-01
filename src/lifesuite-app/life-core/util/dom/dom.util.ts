import { ElementRef } from '@angular/core';

export class DOMUtil {
    public static getPathname(link: ElementRef<HTMLAnchorElement>): string {
        // In IE, link's pathname starts with "./", while in other browsers it starts with "/"
        // In chrome pathname has '/' even if it is a normal link as in home tab,
        // hence checking length so that links are not active when not selected
        return link.nativeElement && link.nativeElement.pathname.length > 1
            ? String(link.nativeElement.pathname).replace('./', '/')
            : null;
    }

    public static getClosestElement(element: Element, query: string): Element {
        return element.closest(query) as Element;
    }

    public static isTargetInsideContainer(
        target: Element,
        container: Element,
        exceptionClasses?: Array<string>
    ): boolean {
        const targetIsInside = container.contains(target);
        let targetIsException = false;
        if (!targetIsInside && exceptionClasses) {
            targetIsException = exceptionClasses.some(exceptionClass => {
                return !!this.getClosestElement(target, `.${exceptionClass}`);
            });
        }
        return targetIsInside || targetIsException;
    }

    public static isInputElement(element: Element): boolean {
        return element.tagName == 'INPUT' || element.tagName == 'TEXTAREA';
    }

    public static isElementPositionFixed(element: Element): boolean {
        let el = element;
        while (el && !this._isFixedPositionStyle(window.getComputedStyle(el)['position'])) {
            el = el.parentElement;
        }
        return !!el;
    }

    private static _isFixedPositionStyle(style: string): boolean {
        const fixedStyles = ['fixed', '-ms-device-fixed'];
        return fixedStyles.some(fixedStyle => style == fixedStyle);
    }
}
