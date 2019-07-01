import { scrollTo } from './animation.util';

export class ScrollUp {
    private _buttonSelector: String;
    private _showDistanceFromTop: number;
    private _animateSpeed: number;

    constructor(buttonSelector: string, showDistanceFromTop?: number) {
        this._buttonSelector = buttonSelector;
        this._showDistanceFromTop = showDistanceFromTop || 100;

        // $(window).scroll(() => {
        //     this.onScroll();
        // });
    }

    public scroll(): void {
        scrollTo(0);
    }

    private onScroll() {
        // if ($(window).scrollTop() > this._showDistanceFromTop) {
        //     $(this._buttonSelector).fadeIn();
        // } else {
        //     $(this._buttonSelector).fadeOut();
        // }
    }
}
