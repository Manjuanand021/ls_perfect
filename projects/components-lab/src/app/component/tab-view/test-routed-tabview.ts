import { Component, Injectable, Injector, Input, ViewChild } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ParentChildRegistry } from 'life-core/view-model';
import {
    RoutedTabView,
    TabDescriptor,
    TabDescriptorFactory,
    TabChannels,
    CompositeTabId,
    PrimaryTabViewHostViewModel,
    SecondaryTabViewHostViewModel,
    PrimaryTabHostViewModel,
    SecondaryTabHostViewModel
} from 'life-core/component/layout/tabview';
import { ComponentsStateManager } from 'life-core/component';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util/tab-state';
import { TestTabDescriptorFactory } from './test-tab-descriptor.factory';

import {
    SplitArea,
    SplitAreasInfo,
    SplitPaneArea,
    LfSplitPaneComponent,
    LfSplitPaneChannels,
    SplitPaneStateData,
    SplitPaneResult
} from 'life-core/component/layout/split';
import { SplitComponent } from 'angular-split';
import { NoteDialog, ScratchPadDialog } from './test-split-area';

// ***************************************
// Main TabView component
// ***************************************

@Component({
    selector: 'test-routed-tab-view',
    template: `
		<lf-button label="Add Simple Tab" (onClick)="addTabSimple()"></lf-button>
		<lf-button label="Add Tab with TabView" (onClick)="addTabWithTabView()"></lf-button>

		<lf-routedTabView id="primaryTabView"
			[tabs]="tabsData$" [initialSelectedIndex]="initialSelectedIndex$"
			controlClose="true" (onClose)="onTabClose($event)" (onChange)="onTabSelectionChange($event)"> 

			<router-outlet></router-outlet>

		</lf-routedTabView>
	`,
    providers: [ParentChildRegistry, TabStateManager, ComponentsStateManager]
})
export class TestRoutedTabView extends PrimaryTabViewHostViewModel {
    @ViewChild(RoutedTabView)
    refTabView: RoutedTabView;

    constructor(injector: Injector) {
        super(injector);
    }

    protected get tabViewId(): string {
        return 'primaryTabView';
    }

    protected getStaticTabs(): TabDescriptor[] {
        const tabHome = (this.tabDescriptorFactory as TestTabDescriptorFactory).createPrimaryTabDescriptorHome();
        const tabSearch = (this.tabDescriptorFactory as TestTabDescriptorFactory).createPrimaryTabDescriptorSearch();
        tabHome.selected = true;
        return [tabHome, tabSearch];
    }

    public addTabSimple(): void {
        const policyId = generatePolicyId();
        const tabPolicy = (this.tabDescriptorFactory as TestTabDescriptorFactory).createPrimaryTabDescriptorSimple(
            policyId
        );
        tabPolicy.selected = true;
        this.addTab(tabPolicy);
    }

    public addTabWithTabView(): void {
        const policyId = generatePolicyId();
        const tabPolicy = (this.tabDescriptorFactory as TestTabDescriptorFactory).createPrimaryTabDescriptorPolicy(
            policyId,
            policyId.toString()
        );
        tabPolicy.selected = true;
        this.addTab(tabPolicy);
    }
}

// ***************************************
// First level (primary) tab components
// ***************************************

export class PrimaryTabHostBase extends PrimaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
        console.debug(`Comp ${this.constructor.name} loaded`);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        console.debug(`Comp ${this.constructor.name} destroyed`);
    }

    public get tabId(): string {
        return this.tabData.compositeTabId.toString();
    }
}

@Component({
    selector: 'home',
    template: `
        <div style="height: 100vh;">
            Home
        </div>
    `
})
export class HomeComp extends PrimaryTabHostBase {
    protected tabDescriptorFactory: TestTabDescriptorFactory;

    constructor(injector: Injector, tabDescriptorFactory: TabDescriptorFactory) {
        super(injector);
        this.tabDescriptorFactory = tabDescriptorFactory as TestTabDescriptorFactory;
    }
    public addTabSimple() {
        const policyId = generatePolicyId();
        const tabPolicy = this.tabDescriptorFactory.createPrimaryTabDescriptorSimple(policyId);
        tabPolicy.selected = true;
        this.messagingService.publish(TabChannels.AddPrimaryTab, tabPolicy);
    }
    public addTabWithTabView() {
        const policyId = generatePolicyId();
        const tabPolicy = this.tabDescriptorFactory.createPrimaryTabDescriptorPolicy(policyId, policyId.toString());
        tabPolicy.selected = true;
        this.messagingService.publish(TabChannels.AddPrimaryTab, tabPolicy);
    }
}
@Component({
    selector: 'Search',
    template: '<div style="height: 100vh;">Search</div>'
})
export class SearchComp extends PrimaryTabHostBase {
    constructor(injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'comp1',
    template: '<div>Simple Tab (SimpleComp) - #{{tabId}}</div>'
})
export class SimpleComp extends PrimaryTabHostBase {
    constructor(injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'tabbed-comp',
    template: `
        <span>
            <!-- Tabbed Tab (TabbedComp) - #{{tabId}} -->
        </span>
		<div [class]="tabContainerClass">
			<lf-split direction="horizontal" [useTransition]="true" (dragEnd)="onTabSplitGutterDragEnd($event)">
				<lf-split-area [size]="tabSplitAreasInfo.left.size">
					<nested-tabview-host-comp [primaryTabId]="tabId"></nested-tabview-host-comp>
				</lf-split-area>
				<lf-split-area *ngIf="splitterVisible" [size]="tabSplitAreasInfo.right.size">
                    <lf-split-pane [splitPaneAreas]="splitPaneAreas" direction="vertical" stateId="split_pane" [state]="componentsState.get('split_pane')">
                    </lf-split-pane>
                </lf-split-area>
            </lf-split>
        </div>		
	`,
    styleUrls: ['test-routed-tabview.scss'],
    providers: [ParentChildRegistry]
})
export class TabbedComp extends PrimaryTabHostBase {
    public splitterVisible: boolean;
    public tabContainerClass: string;

    @ViewChild(LfSplitPaneComponent)
    splitPane: LfSplitPaneComponent;

    @ViewChild(SplitComponent)
    tabSplit: SplitComponent;

    public tabSplitAreasInfo: SplitAreasInfo = {
        left: new SplitArea({ id: 'left', index: 1, size: 100 - SplitPaneInitialSize }),
        right: new SplitArea({ id: 'right', index: 2, size: SplitPaneInitialSize })
    };

    public splitPaneAreas: SplitPaneArea[] = [];

    private splitPaneSize: number = SplitPaneInitialSize;

    private _splitPaneStateValueAccessor: TabStateValueAccessor<SplitPaneStateData>;

    constructor(injector: Injector) {
        super(injector);
        this.createStateValueAccessor(injector.get(TabStateManager));
        this.initSubscribers();
    }

    private initSubscribers(): void {
        this.messagingService.subscribe(LfSplitPaneChannels.AddSplitPaneArea, id => {
            this.addSplitArea(id);
        });
        this.messagingService.subscribe(LfSplitPaneChannels.RemoveSplitPaneArea, splitPaneResult => {
            this.removeSplitArea(splitPaneResult);
        });
    }

    public loadData(): Promise<void> {
        const splitPaneStateData = this._splitPaneStateValueAccessor.getValue();
        if (splitPaneStateData) {
            this.restoreSplitPaneState(splitPaneStateData);
        } else {
            this.setTabSplitVisible(false);
        }
        return Promise.resolve();
    }

    private showSplitter(): void {
        this.setTabSplitVisible(true);
    }
    private hideSplitter(): void {
        this.setTabSplitVisible(false);
    }

    private setTabSplitVisible(visible: boolean): void {
        if (visible) {
            this.splitterVisible = true;
            this.tabContainerClass = 'tab-split-container';
        } else {
            this.splitterVisible = false;
            this.tabContainerClass = 'tab-no-split-container';
        }
    }

    public addSplitArea(id: string): void {
        if (this.splitPane && this.splitPane.hasSplitArea(id, id)) {
            alert(`Split area with id='${id}' already exists.`);
            return;
        }
        if (!this.splitterVisible) {
            this.showSplitter();
        }
        this.splitPaneAreas.push(this.createSplitPaneArea(id));
    }

    private createSplitPaneArea(id: string): SplitPaneArea {
        let area: SplitPaneArea;
        if (id == SplitPaneAreaTypes.note) {
            area = new SplitPaneArea({ id: id, index: 1, size: 55, view: NoteDialog });
        } else if (id == SplitPaneAreaTypes.scratchpad) {
            area = new SplitPaneArea({ id: id, index: 2, size: 45, view: ScratchPadDialog });
        } else {
            throw new Error(`Undefined Split Pane Area ID: '${id}'.`);
        }
        return area;
    }
    public removeSplitArea(splitPaneResult: SplitPaneResult): void {
        const area = this.splitPaneAreas.find(area => area.id == splitPaneResult.areaId);
        if (area) {
            this.splitPaneAreas.splice(this.splitPaneAreas.indexOf(area), 1);
            if (this.splitPaneAreas.length == 0) {
                this.hideSplitter();
            }
        }
    }

    public onTabSplitGutterDragEnd(e: { gutterNum: number; sizes: Array<number> }): void {
        this.splitPaneSize = e.sizes[1];
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.messagingService.closeChannel(LfSplitPaneChannels.AddSplitPaneArea);
        this.messagingService.closeChannel(LfSplitPaneChannels.RemoveSplitPaneArea);
        this.saveSplitPaneState();
    }

    // State management
    private createStateValueAccessor(tabStateManager: TabStateManager) {
        this._splitPaneStateValueAccessor = new TabStateValueAccessor<SplitPaneStateData>(
            tabStateManager,
            SplitPaneStateValueKey
        );
    }

    private saveSplitPaneState(): void {
        if (this.splitterVisible) {
            const splitPaneStateData = new SplitPaneStateData();
            splitPaneStateData.splitPaneSize = this.splitPaneSize;
            splitPaneStateData.splitPaneAreas = this.splitPaneAreas;
            this._splitPaneStateValueAccessor.setValue(splitPaneStateData);
        }
    }

    private restoreSplitPaneState(splitPaneStateData: SplitPaneStateData): void {
        this.splitPaneSize = splitPaneStateData.splitPaneSize;
        this.tabSplitAreasInfo.left.size = 100 - this.splitPaneSize;
        this.tabSplitAreasInfo.right.size = this.splitPaneSize;
        this.splitPaneAreas = splitPaneStateData.splitPaneAreas;
        this.setTabSplitVisible(!!this.splitPaneAreas);
    }
}

const SplitPaneAreaTypes = {
    note: 'note',
    scratchpad: 'scratchpad'
};
const SplitPaneInitialSize = 30;
const SplitPaneStateValueKey = 'splitPaneStateValueKey';

// ***************************************
// Second level (nested) tab components
// ***************************************

export class SecondaryTabHostBase extends SecondaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
        console.debug(`Comp ${this.constructor.name} loaded`);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        console.debug(`Comp ${this.constructor.name} destroyed`);
    }

    public get tabId(): string {
        return this.tabData.compositeTabId.toString();
    }
}

@Component({
    selector: 'nested-tabview-host-comp',
    template: `
        <!--  <lf-button label="Add Tab" (onClick)="addNestedDynamicTab()"></lf-button> -->
		<lf-routedTabView id="secondaryTabView"
			[tabs]="tabsData$" [initialSelectedIndex]="initialSelectedIndex$" 
			controlClose="true" (onClose)="onTabClose($event)" (onChange)="onTabSelectionChange($event)">

			<router-outlet></router-outlet>

		</lf-routedTabView>
	`
})
export class NestedTabViewHostComp extends SecondaryTabViewHostViewModel {
    @Input()
    primaryTabId: CompositeTabId;

    constructor(injector: Injector) {
        super(injector);
    }

    protected get tabViewId(): string {
        return this.primaryTabId.toString();
    }

    //private setupPanelData(): void {
    protected getStaticTabs(): TabDescriptor[] {
        const policyId = parseInt(this.primaryTabId.objectId);
        const tabCaseDisp = (this
            .tabDescriptorFactory as TestTabDescriptorFactory).createSecondaryTabDescriptorCaseDesp(policyId);
        const tabMessages = (this
            .tabDescriptorFactory as TestTabDescriptorFactory).createSecondaryTabDescriptorReviewMessages(policyId);
        tabMessages.selected = true;
        return [tabCaseDisp, tabMessages];
    }

    public addNestedDynamicTab(): void {
        const policyId = generatePolicyId(); //parseInt(this.primaryTabId.objectId);
        const tabDescDetail = (this
            .tabDescriptorFactory as TestTabDescriptorFactory).createSecondaryTabDescriptorDetail(policyId);
        tabDescDetail.selected = true;
        this.addTab(tabDescDetail);
    }
}

@Component({
    selector: 'case-disp',
    template: '<div>Case Disposition - #{{tabId}}</div>'
})
export class CaseDispComp extends SecondaryTabHostBase {
    constructor(injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'messages',
    template: `
		<div>Messages - #{{tabId}}</div>
		<lf-panel header="Section 1" [toggleable]="true" panelType="primary" stateId="panel1" [state]="componentsState.get('panel1')">
            <div style="height: 300px;  border-width: 1px; border-style:solid; border-color:black">
                Content 1
                <br/><br/>
                <lf-button label="Add Note" (onClick)="onAddNoteClick()"></lf-button>
                <lf-button label="Open Scratchpad" (onClick)="onAddScratchpadClick()"></lf-button>
            </div>
        </lf-panel>
		<lf-panel header="Section 2" [toggleable]="true" panelType="primary" stateId="panel2" [state]="componentsState.get('panel2')">
			<div style="height: 200px;  border-width: 1px; border-style:solid; border-color:black">Content 2</div>
		</lf-panel>
    `
})
export class MessagesComp extends SecondaryTabHostBase {
    constructor(injector: Injector) {
        super(injector);
    }

    public onAddNoteClick(): void {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, SplitPaneAreaTypes.note);
    }

    public onAddScratchpadClick(): void {
        this.messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, SplitPaneAreaTypes.scratchpad);
    }
}

@Component({
    selector: 'policy-detail',
    template: '<div>Policy Details - #{{tabId}}</div>'
})
export class PolicyDetailComp extends SecondaryTabHostBase {
    constructor(injector: Injector) {
        super(injector);
    }
}

@Injectable()
export class ParentDataResolver implements Resolve<any> {
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        //console.debug("Parent Data Resolver called.", this.activatedRoute, route, state);
    }
}

@Injectable()
export class ChildDataResolver implements Resolve<any> {
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        //console.debug("Child Data Resolver called.", this.activatedRoute, route, state);
    }
}

function generatePolicyId(): number {
    return Math.floor(Math.random() * 100);
}
