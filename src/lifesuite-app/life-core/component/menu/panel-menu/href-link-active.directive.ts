import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';

import { DOMUtil } from 'life-core/util';

/**
 * @whatItDoes Lets you add a CSS class to an element when the link's url becomes active.
 *
 * @howToUse
 *
 * ```
 * <a href="/user/bob" hrefLinkActive="active-link">Bob</a>
 * ```
 *
 * @description
 *
 * The HrefLinkActive directive lets you add a CSS class to an element when the link's url
 * becomes active.
 *
 * Adopted from Angular's RouterLinkActive directive.
 */
@Directive({
    selector: '[hrefLinkActive]',
    exportAs: 'hrefLinkActive'
})
export class HrefLinkActiveDirective implements OnChanges, OnDestroy, AfterContentInit {
    @ContentChildren('urlLink', { descendants: true })
    public links: QueryList<any>;

    private classes: string[] = [];
    private _routerEventsSubscription: Subscription;
    private _linkChangesSubscription: Subscription;
    public readonly isActive: boolean = false;

    constructor(
        private router: Router,
        private element: ElementRef,
        private renderer: Renderer2,
        private platformLocation: PlatformLocation
    ) {
        this._routerEventsSubscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    public ngAfterContentInit(): void {
        this._linkChangesSubscription = this.links.changes.subscribe(_ => this.update());
        setTimeout(_ => this.update(), 0);
    }

    @Input()
    public set hrefLinkActive(data: string[] | string) {
        const classes = Array.isArray(data) ? data : data.split(' ');
        this.classes = classes.filter(c => !!c);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }
    public ngOnDestroy(): void {
        this._routerEventsSubscription.unsubscribe();
        this._linkChangesSubscription.unsubscribe();
    }

    private update(): void {
        if (!this.links || !this.router.navigated) return;
        const hasActiveLinks = this.hasActiveLinks();

        // react only when status has changed to prevent unnecessary dom updates
        if (this.isActive !== hasActiveLinks) {
            this.classes.forEach(c => {
                if (hasActiveLinks) {
                    this.renderer.addClass(this.element.nativeElement, c);
                } else {
                    this.renderer.removeClass(this.element.nativeElement, c);
                }
            });
            Promise.resolve(hasActiveLinks).then(
                active =>
                    ((this as {
                        isActive: boolean;
                    }).isActive = active)
            );
        }
    }

    private isLinkActive(router: Router): (link: ElementRef<HTMLAnchorElement>) => boolean {
        return (link: ElementRef<HTMLAnchorElement>) => {
            let pathname: string = DOMUtil.getPathname(link);
            pathname = this.removeBaseHref(pathname);
            // router.url has encoded content, hence decoding URI content to compare with pathname
            return pathname && pathname.length > 0 && decodeURIComponent(router.url).includes(pathname);
        };
    }

    private removeBaseHref(pathname: string): string {
        const baseHref = this.platformLocation.getBaseHrefFromDOM();
        if (pathname && baseHref.length > 1) {
            return pathname.replace(baseHref, '');
        } else {
            return pathname;
        }
    }

    private hasActiveLinks(): boolean {
        return this.links.some(this.isLinkActive(this.router));
    }
}
