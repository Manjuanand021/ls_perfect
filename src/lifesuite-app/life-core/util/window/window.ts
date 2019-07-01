import { Provider } from '@angular/core';

export function nativeWindow(): any {
    return window;
}

export abstract class WindowRef {
    public abstract get window(): any;
}

export class BrowserWindowRef extends WindowRef {
    constructor() {
        super();
    }
    public get window(): any {
        return nativeWindow();
    }
}

export const WINDOW_PROVIDERS: Provider[] = [{ provide: WindowRef, useClass: BrowserWindowRef }];
