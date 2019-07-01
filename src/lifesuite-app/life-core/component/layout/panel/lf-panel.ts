import {
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Panel } from 'primeng/primeng';

import { AuthorizationLevel } from 'life-core/authorization';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from 'life-core/component/authorization';
import { IStatefulComponent, StatefulComponent, ComponentState } from 'life-core/component/shared';
import { MessagingService } from 'life-core/messaging';
import { CSS_TRANSITION_LENGTH } from 'life-core/util/animation';
import { PanelChannels } from './panel-channels';

export const PANEL_ANIMATIONS: Array<any> = [
    trigger('panelContent', [
        state(
            'hidden',
            style({
                height: '0',
                opacity: 0
            })
        ),
        state(
            'visible',
            style({
                height: '*',
                opacity: 1
            })
        ),
        transition('visible <=> hidden', animate('{{transitionParams}}'))
    ])
];

@Component({
    selector: 'lf-panel',
    templateUrl: './lf-panel.html',
    // StatefulComponent provider required to reference all stateful components
    // of different classes as a QueryList in ViewModel
    providers: [
        { provide: SecureComponent, useExisting: forwardRef(() => LfPanel) },
        { provide: StatefulComponent, useExisting: forwardRef(() => LfPanel) }
    ],
    animations: PANEL_ANIMATIONS,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfPanel extends Panel implements ISecureComponent, IStatefulComponent, OnInit, OnDestroy {
    @Input()
    public panelType: PanelType;

    @Input()
    public name: string;

    @Input()
    public iconVisible: boolean;

    public icon: string;

    private _stateId: string;

    private _authorizationLevel: AuthorizationLevel;

    private _hidden: boolean;

    private _messagingService: MessagingService;

    private _subscriptions: Subscription[] = [];

    private _loading: boolean;

    private _elementRef: ElementRef<HTMLElement>;

    private _iconClass: string;

    private _cd: ChangeDetectorRef;

    // Override declaration in base class to use constant for transition length value
    @Input() public transitionOptions: string = `${CSS_TRANSITION_LENGTH}ms cubic-bezier(0.86, 0, 0.07, 1)`;

    constructor(el: ElementRef<HTMLElement>, cd: ChangeDetectorRef, messagingService: MessagingService) {
        super(el);
        this._elementRef = el;
        this._cd = cd;
        this._loading = true;
        this._messagingService = messagingService;
        this.collapsed = undefined;
        // Custom change start
        // changed default toggler value to header.
        // panel should be toggled on clicking header and icon
        this.toggler = 'header';
        // Custom change end
        this.setExpandCollapseIcons();
        this.subscribeToCollapsedChangeEvent();
        this.subscribeToExpandCollapseMessages();
    }

    public ngOnInit(): void {
        this._loading = false;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateHidden(value: boolean): void {
        this._hidden = !AuthorizationUtil.isLayoutComponentVisible(this._authorizationLevel) ? true : value;
    }

    // State management
    public get stateId(): string {
        return this._stateId;
    }

    @Input()
    public set stateId(id: string) {
        this._stateId = id;
        this.setNameAttribute(this._stateId);
    }

    public get state(): ComponentState {
        const componentState = new Map<string, any>();
        componentState.set('collapsed', this.collapsed);
        return componentState;
    }

    @Input()
    public set state(componentState: ComponentState) {
        if (componentState) {
            this.collapsed = componentState.get('collapsed');
        }
    }

    @Input()
    public set initCollapsed(value: boolean) {
        if (this.collapsed == undefined) {
            this.collapsed = value;
        }
    }

    @Input()
    public set iconClass(value: string) {
        this.updateIcon(value);
    }

    public get iconClass(): string {
        return this._iconClass;
    }

    // Custom change start
    // setting appropriate toggler value
    public onHeaderClick(event: Event): void {
        this.toggler = 'header';
        super.onHeaderClick(event);
    }

    public onIconClick(event: Event): void {
        this.toggler = 'icon';
        super.onIconClick(event);
        event.stopPropagation();
    }
    // Custom change end

    private updateIcon(iconClass: string): void {
        this.icon = `<span class="${iconClass} ui-panel-title"></span>`;
    }

    private setNameAttribute(name: string): void {
        const panelHtmlElement = this._elementRef.nativeElement;
        if (!panelHtmlElement.getAttribute('name')) {
            panelHtmlElement.setAttribute('name', name);
        }
    }

    private setExpandCollapseIcons(): void {
        // Custom change start
        // corrected expand and collapse icon classes
        this.collapseIcon = 'pi pi-fw pi-caret-down';
        this.expandIcon = 'pi pi-fw pi-caret-right';
        // Custom change end
    }

    private subscribeToCollapsedChangeEvent(): void {
        this._subscriptions.push(this.collapsedChange.subscribe(collapsed => this.onCollapsedChange(collapsed)));
    }

    private subscribeToExpandCollapseMessages(): void {
        this._subscriptions.push(
            this._messagingService.subscribe(PanelChannels.ExpandPanel, panelId => this.onExpandPanel(panelId)),
            this._messagingService.subscribe(PanelChannels.CollapsePanel, panelId => this.onCollapsePanel(panelId)),
            this._messagingService.subscribe(PanelChannels.ExpandAllPanels, () => this.onExpandAllPanels()),
            this._messagingService.subscribe(PanelChannels.CollapseAllPanels, () => this.onCollapseAllPanels())
        );
    }

    private onExpandPanel(panelId: string): void {
        // Ignore previously published notifications
        if (this.canExpandOrCollapse(panelId)) {
            this.expand(null);
            this._cd.markForCheck();
        }
    }

    private onCollapsePanel(panelId: string): void {
        // Ignore previously published notifications
        if (this.canExpandOrCollapse(panelId)) {
            this.collapse(null);
            this._cd.markForCheck();
        }
    }

    private onExpandAllPanels(): void {
        // Ignore previously published notifications
        if (this.canExpandOrCollapseAll()) {
            this.expand(null);
            this._cd.markForCheck();
        }
    }

    private onCollapseAllPanels(): void {
        // Ignore previously published notifications
        if (this.canExpandOrCollapseAll()) {
            this.collapse(null);
            this._cd.markForCheck();
        }
    }

    private canExpandOrCollapse(panelId: string): boolean {
        return !this._loading && this.stateId == panelId && this.toggleable != false;
    }

    private canExpandOrCollapseAll(): boolean {
        return !this._loading && this.toggleable != false;
    }

    private onCollapsedChange(collapsed: boolean): void {
        this.animating = false;
        // Setting it out of timeout as the class ui-panel-content-wrapper-overflown is not getting removed.
        // setTimeout(() => {
        //     // Temporary fix for IE11 error "TypeError: Object doesn't support this action".
        //     // TODO: find out why onAfterToggle.emit() in base class causes IE error.
        //     // this.onToggleDone(new AnimationEvent(''));
        //     this.animating = false;
        // }, CSS_TRANSITION_LENGTH);
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}

export type PanelType = 'primary' | 'secondary' | 'tertiary';
