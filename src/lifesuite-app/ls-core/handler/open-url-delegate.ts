import { Injectable } from '@angular/core';

@Injectable()
export class OpenURLDelegate {
    constructor() {}

    public openURL(url?: string): void {
        window.open(url);
    }
}
