import { Component, Input, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AnimationTransitionBehaviour } from 'life-core/util/animation';
import { ScrollUpAnimations } from './scroll-up.animation';

@Component({
    selector: 'scroll-up',
    templateUrl: './scroll-up.html',
    styleUrls: ['./scroll-up.css'],
    animations: ScrollUpAnimations
})
export class ScrollUp implements OnDestroy {
    /**
     * Distance to top of the window. When current position exceeds this distance, ScrollUp will show up.
     */
    @Input()
    public showDistanceFromTop: number = DEFAULT_SHOW_DISTANCE_FROM_TOP;
    public displayScrollUp: boolean = false;
    private _document: Document;
    private _renderer: Renderer2;
    private _unregisterWindowListenersFn: Function;

    constructor(@Inject(DOCUMENT) document: Document, renderer: Renderer2) {
        this._document = document;
        this._renderer = renderer;
        this.addWindowScrollEventListener();
    }

    public scrollUp(): void {
        window.scrollTo({ left: 0, top: 0, behavior: AnimationTransitionBehaviour.Smooth });
    }

    private addWindowScrollEventListener(): void {
        const listeners = [];
        listeners.push(
            this._renderer.listen(window, 'scroll', event => {
                this.onScroll();
            })
        );
        this._unregisterWindowListenersFn = () => {
            listeners.forEach(unsubscribeFn => unsubscribeFn());
        };
    }

    private onScroll(): void {
        this.displayScrollUp = this.exceedsShowDistanceFromTop();
    }

    private exceedsShowDistanceFromTop(): boolean {
        return (
            this._document.body.scrollTop > this.showDistanceFromTop ||
            this._document.documentElement.scrollTop > this.showDistanceFromTop
        );
    }

    public ngOnDestroy(): void {
        if (this._unregisterWindowListenersFn) this._unregisterWindowListenersFn();
    }
}

export const DEFAULT_SHOW_DISTANCE_FROM_TOP = 100;
