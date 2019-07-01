import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasSignatureImpl } from './canvas-signature-impl';
import { SignatureControl } from './signature-control';

@Component({
    selector: 'canvas-signature',
    templateUrl: './canvas-signature.html',
    styleUrls: ['./canvas-signature.css']
})
export class CanvasSignature extends SignatureControl implements AfterViewInit {
    @ViewChild('mySignature')
    private mySignature: ElementRef<HTMLCanvasElement>;
    @ViewChild('refSignatureClearButton')
    private refClearButton: ElementRef<HTMLButtonElement>;
    @ViewChild('refSignatureApplyButton')
    private refApplyButton: ElementRef<HTMLButtonElement>;

    public ngAfterViewInit(): any {
        const canvas = <HTMLCanvasElement>this.mySignature.nativeElement;
        const clearButton = <HTMLButtonElement>this.refClearButton.nativeElement;
        const applyButton = <HTMLButtonElement>this.refApplyButton.nativeElement;

        const canvasSignature = new CanvasSignatureImpl({ canvas, clearButton, applyButton });
        this._ISignature = canvasSignature;
        canvasSignature.initialize();

        setTimeout(() => {
            this.eventEmitterAttachSignature.emit(this._ISignature);
        }, 0);
    }
}
