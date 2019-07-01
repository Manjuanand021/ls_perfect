export const CSS_TRANSITION_LENGTH = 500; // ms
export const SCROLL_SPEED = 500; // ms

export enum AnimationTransitionBehaviour {
    Auto = 'auto',
    Smooth = 'smooth',
    Instant = 'instant'
}

export enum ViewportBlockTypes {
    Start = 'start',
    Center = 'center',
    End = 'end',
    Nearest = 'nearest'
}

export const SmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;

/**
 * Animation stub methods.
 * Will be replaced with real animation when it's available.
 */
export class AnimationUtil {
    public static scrollTo(element: HTMLElement): void {
        const clientRect = element.getBoundingClientRect();
        document.body.scrollTop = clientRect.top;
        // element.offsetTop - element.scrollTop + element.clientTop;
    }

    public static scrollToTop(): void {
        document.body.scrollTop = 0;
    }
}
