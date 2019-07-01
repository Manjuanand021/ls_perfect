import {
    Component,
    ChangeDetectionStrategy,
    NgZone,
    ElementRef,
    ChangeDetectorRef,
    Input,
    Renderer2
} from '@angular/core';

import { SplitComponent } from 'angular-split';

@Component({
    selector: 'lf-split',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: flex;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: stretch;
                overflow: hidden;
                /* 
                Important to keep following rules even if overrided later by 'HostBinding' 
                because if [width] & [height] not provided, when build() is executed,
                'HostBinding' hasn't been applied yet so code:
                this.elRef.nativeElement["offsetHeight"] gives wrong value!  
             */
                width: 100%;
                height: 100%;
            }
            split-gutter {
                flex-grow: 0;
                flex-shrink: 0;
                background-position: center center;
                background-repeat: no-repeat;
            }
        `
    ],
    template: `
        <ng-content></ng-content>
        <ng-template ngFor let-area [ngForOf]="displayedAreas" let-index="index" let-last="last">
            <lf-split-gutter
                *ngIf="last === false"
                [order]="index * 2 + 1"
                [direction]="direction"
                [useTransition]="useTransition"
                [size]="gutterSize"
                [color]="gutterColor"
                [dragColor]="dragGutterColor"
                [imageH]="gutterImageH"
                [imageV]="gutterImageV"
                [disabled]="disabled"
                [minimized]="splitterMinimized"
                (click)="clickGutter($event, index + 1)"
                (mousedown)="startDragging($event, index * 2 + 1, index + 1)"
                (touchstart)="startDragging($event, index * 2 + 1, index + 1)"
            >
            </lf-split-gutter>
        </ng-template>
    `
})
export class LfSplitComponent extends SplitComponent {
    @Input() public splitterMinimized: boolean;
    @Input() public dragGutterColor: string;

    constructor(ngZone: NgZone, elRef: ElementRef, cdRef: ChangeDetectorRef, renderer: Renderer2) {
        super(ngZone, elRef, cdRef, renderer);
    }

    // remove this after angular-split upgrade to latest version
    public clickGutter(event: MouseEvent, gutterNum: number): void {
        event.preventDefault();
        event.stopPropagation();
        this.notify('click');
    }
}
