import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

import { DomHandler } from 'primeng/components/dom/domhandler';

@Directive({
    selector: '[lfInfo]',
    providers: [DomHandler]
})
export class LfInfoDirective implements AfterViewInit, OnDestroy {
    @Input()
    public cornerStyleClass: string = 'ui-corner-all';

    private _infoLabel: string = '';

    private _initialized: boolean;

    private readonly infoTextClass: string = 'ui-info-text';

    constructor(public el: ElementRef, public domHandler: DomHandler) {}

    public ngAfterViewInit(): void {
        const labelElement = document.createElement('span');
        labelElement.className = this.infoTextClass;
        labelElement.appendChild(document.createTextNode(this._infoLabel));
        this.el.nativeElement.appendChild(labelElement);
        this._initialized = true;
    }

    public get infoLabel(): string {
        return this._infoLabel;
    }

    @Input()
    public set infoLabel(val: string) {
        this._infoLabel = val;

        if (this._initialized) {
            (this.domHandler.findSingle(
                this.el.nativeElement,
                `.${this.infoTextClass}`
            ) as HTMLElement).innerHTML = this._infoLabel;
        }
    }

    public ngOnDestroy(): void {
        while (this.el.nativeElement.hasChildNodes()) {
            this.el.nativeElement.removeChild(this.el.nativeElement.lastChild);
        }
        this._initialized = false;
    }
}
