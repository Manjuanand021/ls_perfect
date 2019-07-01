/*
 * Adopted from NgbPopover in ng-bootstrap/src/popover/popover.ts
 */

import {
    Directive,
    EventEmitter,
    Injector,
    Injectable,
    Input,
    Output,
    OnInit,
    OnDestroy,
    Type,
    Renderer2,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    TemplateRef,
    ViewContainerRef,
    NgZone,
    Inject,
    SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, race } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NgbPopoverConfig, Placement } from '@ng-bootstrap/ng-bootstrap';
import { listenToTriggers } from '@ng-bootstrap/ng-bootstrap/esm5/util/triggers';
import { PopupService } from '@ng-bootstrap/ng-bootstrap/esm5/util/popup';
import { Key } from '@ng-bootstrap/ng-bootstrap/esm5/util/key';

import { positionElements } from './positioning';

import { DirectDataResolve, DirectResolvedData, resolveData } from 'life-core/component/shared';
import { DialogButton } from '../shared/dialog-button';
import { DialogButtonLabels } from '../shared/dialog-button-labels';
import { DialogData, DialogParams, DialogResult } from '../shared/dialog.interface';
import { PopoverDialogWindow } from './popover-dialog-window/popover-dialog-window';
import { LfPopoverWindow } from './lf-popover-window/lf-popover-window';
import { DOMUtil } from 'life-core/util';

// custom class
// Add keepOpenForClasses property
@Injectable()
export class PopoverConfig extends NgbPopoverConfig {
    public keepOpenForClasses: Array<string>;
}

let nextId = 0;

/**
 * Adoptation of ng-bootstrap NgbPopover class to handle component-based popovers.
 */
@Directive({ selector: '[lfPopover]', exportAs: 'lfPopover' })
export class PopoverDialog implements OnInit, OnDestroy {
    /**
     * Indicates whether the popover should be closed on Escape key and inside/outside clicks.
     *
     * - true (default): closes on both outside and inside clicks as well as Escape presses
     * - false: disables the autoClose feature (NB: triggers still apply)
     * - 'inside': closes on inside clicks as well as Escape presses
     * - 'outside': closes on outside clicks (sometimes also achievable through triggers)
     * as well as Escape presses
     *
     * @since 3.0.0
     */
    @Input()
    autoClose: boolean | 'inside' | 'outside';
    /**
     * Custom property
     * Content to be displayed as popover. If title and content are empty, the popover won't open.
     */
    @Input()
    public popover: string | TemplateRef<any>;
    /**
     * Title of a popover. If title and content are empty, the popover won't open.
     */
    @Input()
    public popoverTitle: string;
    /**
     * Placement of a popover accepts:
     *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
     *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
     * and array of above values.
     */
    @Input()
    public placement: PlacementArray;
    /**
     * Specifies events that should trigger. Supports a space separated list of event names.
     */
    @Input()
    public triggers: string;
    /**
     * A selector specifying the element the popover should be appended to.
     * Currently only supports "body".
     */
    @Input()
    public container: string;
    /**
     * A flag indicating if a given popover is disabled and should not be displayed.
     *
     * @since 1.1.0
     */
    @Input()
    disablePopover: boolean;
    /**
     * An optional class applied to ngb-popover-window
     *
     * @since 2.2.0
     */
    @Input()
    popoverClass: string;
    /**
     * Emits an event when the popover is shown
     */
    @Output()
    public shown: EventEmitter<boolean> = new EventEmitter();
    /**
     * Emits an event when the popover is hidden
     */
    @Output()
    public hidden: EventEmitter<boolean> = new EventEmitter();

    private _ngbPopoverWindowId: string = `ngb-popover-${nextId++}`;
    private _popupService: PopupService<LfPopoverWindow>;
    private _windowRef: ComponentRef<LfPopoverWindow>;
    private _unregisterHostListenersFn: Function;
    private _zoneSubscription: any;
    private _isDisabled(): boolean {
        if (this.disablePopover) {
            return true;
        }
        if (!this.popover && !this.popoverTitle) {
            return true;
        }
        return false;
    }

    // Custom properties start
    // Properties for component-based popover
    public handler: (result: DialogResult) => void | Promise<void>;
    private _elementRef: ElementRef;
    private _renderer: Renderer2;
    private _injector: Injector;
    private _componentFactoryResolver: ComponentFactoryResolver;
    private _viewContainerRef: ViewContainerRef;
    private _popoverParams: PopoverDialogParams;
    private _keepOpenForClasses: Array<string>;
    private _dialogButtonLabels: DialogButtonLabels;
    // Custom properties end

    constructor(
        elementRef: ElementRef,
        renderer: Renderer2,
        injector: Injector,
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef,
        config: PopoverConfig,
        private _ngZone: NgZone,
        @Inject(DOCUMENT) private _document: any,
        /* custom parameter */ dialogButtonLabels: DialogButtonLabels
    ) {
        // Custom change starts
        this._elementRef = elementRef;
        this._renderer = renderer;
        this._injector = injector;
        this._componentFactoryResolver = componentFactoryResolver;
        this._viewContainerRef = viewContainerRef;
        this._dialogButtonLabels = dialogButtonLabels;
        this.setupFromConfig(config);
        // Custom change ends

        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                // Custom change starts
                // Apply fixed position to improve scrolling in IE
                const hostPositionFixed = this.isHostElementPositionFixed();
                const dialogPositionFixed = this.isDialogPositionFixed();
                if (dialogPositionFixed != hostPositionFixed) {
                    this.setDialogPositionFixed(hostPositionFixed);
                }
                if (dialogPositionFixed != hostPositionFixed || !hostPositionFixed) {
                    this.applyPlacement();
                }
                // Custom change ends
            }
        });
    }

    // Custom change starts
    private setupFromConfig(config: PopoverConfig): void {
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disablePopover = config.disablePopover;
        this.popoverClass = config.popoverClass;
        this._keepOpenForClasses = config.keepOpenForClasses;
    }

    public get popoverParams(): PopoverDialogParams {
        return this._popoverParams;
    }

    @Input()
    public set popoverParams(params: PopoverDialogParams) {
        this._popoverParams = params;
        this.placement = params.placement || this.placement;
        this.triggers = params.triggers || this.triggers;
        this.popoverTitle = params.title;
        if (!this.isComponentBased(params.content)) {
            this.popover = params.content as string;
        }
        this.handler = params.handler;
        if (params.autoClose != undefined) {
            this.autoClose = params.autoClose;
        }
    }
    // Custom change ends

    public open(context?: any): void {
        // Custom change starts
        if (!this.isOpen()) {
            if (this.popoverParams && this.popoverParams.resolve) {
                resolveData(this.popoverParams.resolve, this._injector).then(resolvedData => {
                    this.popoverParams.resolvedData = resolvedData;
                    this.openPopover(context);
                });
            } else {
                this.openPopover(context);
            }
        }
        // Custom change ends
    }

    /**
     * Opens an element’s popover. This is considered a “manual” triggering of the popover.
     * The context is an optional value to be injected into the popover template when it is created.
     */
    private openPopover(context?: any): void {
        if (!this._windowRef && !this._isDisabled()) {
            this._windowRef = this.getPopupService().open(this.popover, context);
            this.setupPopover(this._windowRef.instance, this.popoverParams, context);
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);

            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }

            // apply styling to set basic css-classes on target element, before going for positioning
            this._windowRef.changeDetectorRef.detectChanges();
            this._windowRef.changeDetectorRef.markForCheck();

            this.applyPlacement();

            // Custom change starts
            // Apply fixed position to improve scrolling in IE
            if (this.isHostElementPositionFixed()) {
                this.setDialogPositionFixed(true);
            }
            // Custom change ends
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    // prevents automatic closing right after an opening by putting a guard for the time of one event handling
                    // pass
                    // use case: click event would reach an element opening the popover first, then reach the autoClose handler
                    // which would close it
                    let justOpened = true;
                    requestAnimationFrame(() => (justOpened = false));

                    const escapes$ = fromEvent<KeyboardEvent>(this._document, 'keyup').pipe(
                        takeUntil(this.hidden),
                        filter(event => event.which === Key.Escape)
                    );

                    const clicks$ = fromEvent<MouseEvent>(this._document, 'click').pipe(
                        takeUntil(this.hidden),
                        filter(() => !justOpened),
                        filter(event => this._shouldCloseFromClick(event))
                    );

                    race<Event>([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
            this.shown.emit();
        }
    }

    /**
     * Closes an element’s popover. This is considered a “manual” triggering of the popover.
     */
    public close(result?: any): void {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }

    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
     */
    public toggle(): void {
        if (this._windowRef) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Returns whether or not the popover is currently being shown
     */
    private isOpen(): boolean {
        return this._windowRef != null;
    }

    public ngOnInit(): void {
        if (this.isTargetElementEnabled(this._elementRef.nativeElement)) {
            // Customized code
            this._unregisterHostListenersFn = listenToTriggers(
                this._renderer,
                this._elementRef.nativeElement,
                this.triggers,
                this.open.bind(this),
                this.close.bind(this),
                this.toggle.bind(this)
            );
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        // close popover if title and content become empty, or disablePopover set to true
        if ((changes['popover'] || changes['popoverTitle'] || changes['disablePopover']) && this._isDisabled()) {
            this.close();
        }
    }

    public ngOnDestroy(): void {
        this.close();
        if (this._unregisterHostListenersFn) {
            this._unregisterHostListenersFn();
        }
        this._zoneSubscription.unsubscribe();
        // custom change starts
        this._viewContainerRef.clear();
        this._viewContainerRef = undefined;
        // custom change ends
    }

    private _shouldCloseFromClick(event: MouseEvent) {
        if (event.button !== 2) {
            if (this.autoClose === true) {
                return true;
            } else if (this.autoClose === 'inside' && this._isEventFromPopover(event)) {
                return true;
            } else if (this.autoClose === 'outside' && !this._isEventFromPopover(event)) {
                return true;
            }
        }
        return false;
    }

    private _isEventFromPopover(event: MouseEvent) {
        const popup = this._windowRef.instance;
        return popup ? popup.isEventFrom(event) || this.isInsidePopoverWindow(event.target) : false;
    }

    // Custom methods starts

    private isTargetElementEnabled(target: any): boolean {
        return target.getAttribute('disabled') == undefined;
    }

    // position popover along the element
    private applyPlacement(): void {
        this._windowRef.instance.applyPlacement(
            positionElements(
                this._elementRef.nativeElement,
                this._windowRef.location.nativeElement,
                this.placement,
                this.container === 'body'
            )
        );
    }

    private getPopupService(): PopupService<LfPopoverWindow> {
        if (!this._popupService) {
            if (this.popoverParams && this.isComponentBased(this.popoverParams.content)) {
                this._popupService = new PopupService<PopoverDialogWindow>(
                    PopoverDialogWindow,
                    this._injector,
                    this._viewContainerRef,
                    this._renderer,
                    this._componentFactoryResolver
                );
            } else {
                this._popupService = new PopupService<LfPopoverWindow>(
                    LfPopoverWindow,
                    this._injector,
                    this._viewContainerRef,
                    this._renderer,
                    this._componentFactoryResolver
                );
            }
        }
        return this._popupService;
    }

    private setupPopover(popoverWindow: LfPopoverWindow, params: PopoverDialogParams, context?: any): void {
        if (this.isPopoverDialogWindow(popoverWindow)) {
            popoverWindow.dialogRef = this;
            if (this.isComponentBased(params.content)) {
                popoverWindow.view = params.content as Type<any>;
            }
            popoverWindow.data = new DialogData(params.data, params.resolvedData);
            popoverWindow.title = params.title || this.popoverTitle;
            popoverWindow.buttons = this.setupButtons(params.buttons);
        } else {
            popoverWindow.title = this.popoverTitle;
        }
        popoverWindow.context = context;
        popoverWindow.popoverClass = this.popoverClass;
        popoverWindow.id = this._ngbPopoverWindowId;
    }

    private isPopoverDialogWindow(popoverWindow: LfPopoverWindow): popoverWindow is PopoverDialogWindow {
        return popoverWindow instanceof PopoverDialogWindow;
    }

    private isComponentBased(content: any): boolean {
        return content instanceof Type;
    }

    private setupButtons(buttons: DialogButton[]): DialogButton[] {
        for (const button of buttons) {
            this.setupButton(button);
        }
        return buttons;
    }

    private setupButton(button: DialogButton): void {
        if (!button.label) {
            button.label = this._dialogButtonLabels.byType[button.type];
        }
    }

    private setDialogPositionFixed(isFixed: boolean): void {
        const hostElementPositionFixed = this.isHostElementPositionFixed();
        this._renderer.setStyle(
            this._windowRef.location.nativeElement,
            'position',
            hostElementPositionFixed ? 'fixed' : 'absolute'
        );
    }

    private isHostElementPositionFixed(): boolean {
        return DOMUtil.isElementPositionFixed(this._elementRef.nativeElement);
    }

    private isDialogPositionFixed(): boolean {
        return window.getComputedStyle(this._windowRef.location.nativeElement)['position'] == 'fixed';
    }

    private isInsidePopoverWindow(target: any): boolean {
        return DOMUtil.isTargetInsideContainer(
            target,
            this._windowRef.location.nativeElement,
            this._keepOpenForClasses
        );
    }
    // Custom methods end
}

// custom interface
export interface PopoverDialogParams extends DialogParams {
    content: Type<any> | string;
    id?: string;
    data?: any;
    resolve?: Array<DirectDataResolve>;
    resolvedData?: DirectResolvedData;
    placement?: PlacementArray;
    autoClose?: boolean | 'inside' | 'outside';
    triggers?: string;
    handler?: (result: DialogResult) => void | Promise<void>;
}

export type PlacementArray = Placement | Array<Placement>;
