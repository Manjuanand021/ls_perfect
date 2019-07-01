import {
    Component,
    Input,
    AfterContentInit,
    AfterViewInit,
    ElementRef,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';
import { TabView } from 'primeng/primeng';
import { TabData, TAB_INDEX_UNDEFINED } from './model';
import { TabChangeEvent } from './event/tab.event';
import { AuthorizationUtil } from 'life-core/component/authorization';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { LfTabPanel } from './tabpanel/lf-tabpanel';

@Component({
    selector: 'lf-routedTabView',
    templateUrl: './routed-tabview.html',
    styleUrls: ['./routed-tabview.css'],
    encapsulation: ViewEncapsulation.None
})
export class RoutedTabView extends TabView implements AfterContentInit, AfterViewInit, OnDestroy {
    /**
     * Identifier.
     */
    @Input()
    public id: string;
    /**
     * Observable of TabView data model.
     */
    @Input('tabs')
    public tabsData: Observable<TabData[]>;

    /**
     * Initial selected tab index.
     */
    @Input()
    public initialSelectedIndex: Observable<number>;

    /**
     * Type of the TabView: Primary, Secondary, etc.
     */
    @Input()
    public tabViewType: TabViewType;

    /**
     * tabPanels defined in base class as ContentChildren.
     * Override as ViewChildren to make delayed component loading work.
     */
    @ViewChildren(LfTabPanel)
    public tabPanels: QueryList<LfTabPanel>;

    /**
     * Index of currently selected tab.
     */
    protected selectedIndex: number = TAB_INDEX_UNDEFINED;

    private _subscriptionTracker: SubscriptionTracker;

    constructor(el: ElementRef<HTMLElement>) {
        super(el);
        this._subscriptionTracker = new SubscriptionTracker();
    }

    /**
     * Override base method to disable its logic
     * Required to make delayed component loading work.
     */
    public ngAfterContentInit(): void {}

    /**
     * Use Timeout() to avoid "EXCEPTION: Expression has changed after it was checked."
     * The exception is caused by timing of the change detection mechanizm.
     * For explanation and possible solution see these links:
     * https://github.com/angular/angular/issues/10131
     * http://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked/34364881#34364881
     * https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html#!#wait-a-tick
     */
    public ngAfterViewInit(): void {
        this.setupSubscriptions();

        setTimeout(() => {
            this.initTabs();
        }, 0);

        this._subscriptionTracker.track(
            this.tabPanels.changes.subscribe(_ => {
                setTimeout(() => {
                    this.initTabs();
                }, 0);
            })
        );
    }

    protected setupSubscriptions(): void {
        this._subscriptionTracker.track([
            this.tabsData.subscribe(tabsData => {
                setTimeout(() => {
                    this.updateTabsData(tabsData);
                }, 0);
            }),
            this.initialSelectedIndex.subscribe(index => {
                this.updateSelectedIndex(index);
            })
        ]);
    }

    private updateTabsData(tabsData: TabData[]): void {
        tabsData.forEach(tabData => {
            tabData.disabled = !AuthorizationUtil.isLayoutComponentEnabled(tabData.authorizationLevel)
                ? true
                : tabData.disabled;
        });
    }

    private updateSelectedIndex(index: number): void {
        this.selectedIndex = index;
    }

    /**
     * Override base method to allow external tab selection.
     */
    public initTabs(): void {
        this.tabs = this.tabPanels.toArray();
        for (const tab of this.tabs) {
            // Angular 5 Conversion
            // tab.lazy = this.lazy;
        }
        const oldSelectedTab = this.findSelectedTab();
        const newSelectedTab = this.setNewSelectedTab();
        if (newSelectedTab) {
            this.onChange.emit(
                new TabChangeEvent({
                    fromIndex: oldSelectedTab ? this.findTabIndex(oldSelectedTab) : TAB_INDEX_UNDEFINED,
                    toIndex: this.findTabIndex(newSelectedTab),
                    fnChange: () => {}
                })
            );
        }
    }

    private setNewSelectedTab(): LfTabPanel {
        let newSelectedTab = null;
        if (this.selectedIndex != TAB_INDEX_UNDEFINED) {
            const oldSelectedTab: LfTabPanel = this.findSelectedTab();
            const oldSelectedTabIndex = this.findTabIndex(oldSelectedTab);
            if (this.selectedIndex != oldSelectedTabIndex) {
                if (oldSelectedTab) {
                    oldSelectedTab.selected = false;
                }
                newSelectedTab = this.tabs[this.selectedIndex];
                newSelectedTab.selected = true;
            }
        } else {
            if (this.tabs.length) {
                newSelectedTab = this.tabs[0];
                newSelectedTab.selected = true;
                this.selectedIndex = 0;
            }
        }
        return newSelectedTab;
    }

    /**
     * Override base method to allow callback and external tab selection.
     */
    public open(event: Event, tab: LfTabPanel): void {
        if (tab.disabled) {
            event.preventDefault();
            return;
        }
        const selectedTab: LfTabPanel = this.findSelectedTab();
        if (!tab.selected) {
            if (selectedTab) {
                this.onChange.emit(
                    new TabChangeEvent({
                        originalEvent: event,
                        fromIndex: this.findTabIndex(selectedTab),
                        toIndex: this.findTabIndex(tab),
                        fnChange: () => {
                            selectedTab.selected = false;
                            this.openTab(tab);
                        }
                    })
                );
            } else {
                this.openTab(tab);
                this.onChange.emit(
                    new TabChangeEvent({
                        originalEvent: event,
                        fromIndex: TAB_INDEX_UNDEFINED,
                        toIndex: this.findTabIndex(tab)
                    })
                );
            }
        }
        event.preventDefault();
    }

    public openTab(tab: LfTabPanel): void {
        tab.selected = true;
        const selectedTab = this.findSelectedTab();
        this.selectedIndex = selectedTab ? this.findTabIndex(selectedTab) : TAB_INDEX_UNDEFINED;
    }

    /**
     * Override base method to allow external tab selection.
     */
    public closeTab(tab: LfTabPanel): void {
        if (tab.selected) {
            tab.selected = false;
            this.selectedIndex = TAB_INDEX_UNDEFINED;
        } else if (this.selectedIndex > this.findTabIndex(tab)) {
            this.selectedIndex--;
        }
        tab.closed = true;
    }

    public ngOnDestroy(): void {
        this._subscriptionTracker.destroy();
    }
}

export type TabViewType = 'primary' | 'secondary' | 'tertiary';
