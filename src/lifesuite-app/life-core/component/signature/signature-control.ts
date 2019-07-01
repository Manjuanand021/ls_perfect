import { Component, Injectable, Injector, EventEmitter } from '@angular/core';
import { ISignature } from './signature.interface';

@Injectable()
export class SignatureControl {
    public eventEmitterSaveItem: EventEmitter<string> = new EventEmitter<string>();
    public eventEmitterAttachSignature: EventEmitter<ISignature> = new EventEmitter<ISignature>();

    protected _ISignature: ISignature;

    public onSignatureClearClick(): void {
        this._ISignature.clear();
    }

    public onSignatureApplyClick(): void {
        this.eventEmitterSaveItem.emit('ApplyClick');
    }
}
