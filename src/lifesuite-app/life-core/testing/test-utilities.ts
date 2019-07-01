import { ComponentFixture, tick } from '@angular/core/testing';

import { createKeyboardEvent, createFakeEvent } from './event-objects';

export enum EventType {
    input = 'input',
    paste = 'paste',
    focus = 'focus',
    blur = 'blur',
    keypress = 'keypress',
    keydown = 'keydown'
}

export function tickAndDetectChanges<T>(fixture: ComponentFixture<T>): void {
    fixture.detectChanges();
    tick();
}

/** Utility to dispatch any event on a html element. */
export function dispatchEvent(element: HTMLElement, event: Event): Event {
    element.dispatchEvent(event);
    return event;
}

/** Shorthand to dispatch a fake event on a specified html element. */
export function dispatchFakeEvent(element: HTMLElement, type: EventType, canBubble?: boolean): Event {
    return dispatchEvent(element, createFakeEvent(type, canBubble));
}

/** Shorthand to dispatch a keyboard event with a specified key code. */
export function dispatchKeyboardEvent(
    element: HTMLElement,
    type: EventType,
    key: string,
    target?: Element
): KeyboardEvent {
    return dispatchEvent(element, createKeyboardEvent(type, key, target)) as KeyboardEvent;
}

export function emulateKeyPressEvent(fixture: any, inputElement: HTMLInputElement, char: string): void {
    const eventMock = dispatchKeyboardEvent(inputElement, EventType.keypress, char);
    if (eventMock.defaultPrevented) {
        // exceeds max length or invalid character
        return;
    }

    // change the state of underlying component
    inputElement.value += char;

    dispatchFakeEvent(inputElement, EventType.blur);
    fixture.detectChanges();
}
