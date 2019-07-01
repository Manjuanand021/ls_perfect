/** Dispatches a keydown event from an element. */
export function createKeyboardEvent(type: string, key: string, target?: Element): KeyboardEvent {
    const event = document.createEvent('KeyboardEvent') as any;
    const originalPreventDefault = event.preventDefault;
    const keyCode = key.charCodeAt(0);

    // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
    if (event.initKeyEvent) {
        event.initKeyEvent(type, true, true, window, 0, 0, 0, 0, 0, keyCode);
    } else {
        event.initKeyboardEvent(type, true, true, window, 0, key, 0, '', false);
    }

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        key: { get: () => key },
        target: { get: () => target }
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = function() {
        Object.defineProperty(event, 'defaultPrevented', { get: () => true });
        return originalPreventDefault.apply(this, arguments);
    };
    return event;
}

/** Creates a fake event object with any desired event type. */
export function createFakeEvent(type: string, canBubble: boolean = false, cancelable: boolean = true): Event {
    const event = document.createEvent('Event');
    event.initEvent(type, canBubble, cancelable);
    return event;
}
