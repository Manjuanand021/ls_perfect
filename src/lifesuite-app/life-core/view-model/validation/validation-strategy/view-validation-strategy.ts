import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewValidationStrategy implements IViewValidationStrategy {
    public needToValidate(): boolean {
        return true;
    }

    public destroy(): void {}
}

export interface IViewValidationStrategy {
    needToValidate(): boolean;
    destroy(): void;
}
