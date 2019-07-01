import { Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { ClickEventResolver } from 'life-core/component/shared/event/click-event.resolver';
import { SplitAreasInfo, GutterSize, GutterColor } from '../../lf-split.model';
import { SplitPaneArea, SplitPaneAreaData, SplitPaneStateData } from '../lf-split-pane.model';
import { LfSplitPaneComponent } from '../lf-split-pane.component';
import { LfSplitPaneChannels } from '../lf-split-pane-channels';
import { SplitPaneResult } from './split-pane-dialog.vm';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component';
import { SplitPaneContainerMessagesMapper } from './split-pane-container-messages.mapper';

export abstract class SplitPaneContainerViewModel extends ViewModel {
    public containerAreasInfo: SplitAreasInfo;

    public splitPaneAreas: SplitPaneArea[] = [];

    public splitterVisible: boolean;

    public splitContainerClass: string;

    public gutterSize: number = GutterSize.large;

    public gutterColor: string = GutterColor.default;

    public dragGutterColor: string = GutterColor.drag;

    public splitterMinimized: boolean = false;

    protected abstract splitPane: LfSplitPaneComponent;

    protected messagingService: IMessagingService;

    protected splitPaneSize: number;

    private _splitPaneStateValueAccessor: TabStateValueAccessor<SplitPaneStateData>;

    private _gutterClickEventResolver: ClickEventResolver;

    private _confirmDialog: ConfirmDialog;

    private _splitPaneContainerMessagesMapper: SplitPaneContainerMessagesMapper;

    constructor(injector: Injector) {
        super(injector);
        this.messagingService = injector.get(MessagingService);
        this._confirmDialog = injector.get(ConfirmDialog);

        this._splitPaneContainerMessagesMapper = injector.get(SplitPaneContainerMessagesMapper);
        this.createStateValueAccessor(injector.get(TabStateManager));
        this.initContainerAreas();
        this.initSubscribers();
        this.initClickEventResolver();
    }

    public loadData(): Promise<void> {
        const splitPaneStateData = this._splitPaneStateValueAccessor.getValue();
        if (splitPaneStateData) {
            this.restoreSplitPaneState(splitPaneStateData);
        } else {
            this.setContainerSplitVisible(false);
        }
        return Promise.resolve();
    }

    public addSplitArea(areaData: SplitPaneAreaData): SplitPaneArea {
        if (this.splitPaneTypeAlreadyExists(areaData.areaId)) {
            this.showSplitAreaExistMessage(areaData.areaId);
            return;
        }
        if (!this.splitterVisible) {
            this.showSplitter();
        }
        const splitPaneArea = this.createSplitPaneArea(areaData.areaId);
        splitPaneArea.index = this.splitPaneAreas.length + 1;
        splitPaneArea.context = areaData.context;
        this.splitPaneAreas.push(splitPaneArea);
        return splitPaneArea;
    }

    public removeSplitArea(splitPaneResult: SplitPaneResult): void {
        const area = this.splitPaneAreas.find(area => area.id == splitPaneResult.areaId);
        if (area) {
            area.context = undefined;
            this.splitPaneAreas.splice(this.splitPaneAreas.indexOf(area), 1);
            if (this.splitPaneAreas.length == 0) {
                this.hideSplitter();
            }
        }
    }

    public onSplitGutterDragStart(e: { gutterNum: number; sizes: Array<number> }): void {
        this.gutterColor = GutterColor.drag;
        this.splitPaneSize = e.sizes[1];
    }

    public onSplitGutterDragEnd(e: { gutterNum: number; sizes: Array<number> }): void {
        this.gutterColor = GutterColor.default;
        this.splitPaneSize = e.sizes[1];
    }

    public onSplitGutterClick(e: { gutterNum: number; sizes: Array<number> }): void {
        this.gutterColor = GutterColor.default;
        this._gutterClickEventResolver.onClick(e);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.messagingService.closeChannel(LfSplitPaneChannels.AddSplitPaneArea);
        this.messagingService.closeChannel(LfSplitPaneChannels.RemoveSplitPaneArea);
        if (this.messagingService.channelExist(LfSplitPaneChannels.SplitPaneVisible)) {
            this.messagingService.closeChannel(LfSplitPaneChannels.SplitPaneVisible);
        }
        if (this.messagingService.channelExist(LfSplitPaneChannels.SplitPaneHidden)) {
            this.messagingService.closeChannel(LfSplitPaneChannels.SplitPaneHidden);
        }

        this.saveSplitPaneState();
    }

    protected getErrorItemMessage(areaId: string): string {
        return this._splitPaneContainerMessagesMapper.getMessage(areaId);
    }

    protected abstract getErrorItemDialogTitle(): string;

    protected abstract createSplitPaneArea(areaId: string): SplitPaneArea;

    protected handleSplitGutterClick(e: { gutterNum: number; sizes: Array<number> }): void {
        const SplitPaneMinimizedSize = 0.5;
        if (this.splitterVisible) {
            this.splitterMinimized = !this.splitterMinimized;
            this.splitPaneSize = this.splitterMinimized ? SplitPaneMinimizedSize : this.splitPaneInitialSize;
            this.setContainerAreasSize(this.splitPaneSize);
            this.containerAreasInfo.right.size = this.splitPaneSize;
        }
    }

    protected handleSplitGutterDoubleClick(e: { gutterNum: number; sizes: Array<number> }): void {}

    protected abstract getContainerAreasInfo(): SplitAreasInfo;

    protected abstract setContainerAreasSize(splitPaneSize: number): void;

    protected abstract get splitPaneInitialSize(): number;

    protected abstract getSplitAreaType(areaId: string): string;

    // State management
    protected abstract get splitPaneStateValueKey(): string;

    private createStateValueAccessor(tabStateManager: TabStateManager): void {
        this._splitPaneStateValueAccessor = new TabStateValueAccessor<SplitPaneStateData>(
            tabStateManager,
            this.splitPaneStateValueKey
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
        this.setContainerAreasSize(this.splitPaneSize);
        this.splitPaneAreas = splitPaneStateData.splitPaneAreas;
        this.setContainerSplitVisible(this.splitPaneAreas.length > 0);
    }

    private initSubscribers(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribe(LfSplitPaneChannels.AddSplitPaneArea, (value: SplitPaneAreaData) => {
                if (this.addSplitArea(value)) {
                    this.publishSplitPaneVisibleMessage();
                }
            })
        );

        this.subscriptionTracker.track(
            this.messagingService.subscribe(LfSplitPaneChannels.RemoveSplitPaneArea, splitPaneResult => {
                this.removeSplitArea(splitPaneResult);
                this.publishSplitPaneHiddenMessage();
            })
        );
    }

    private publishSplitPaneVisibleMessage(): void {
        if (this.isSplitPaneVisible()) {
            this.messagingService.publish(LfSplitPaneChannels.SplitPaneVisible);
        }
    }

    private publishSplitPaneHiddenMessage(): void {
        if (this.isSplitPaneHidden()) {
            this.messagingService.publish(LfSplitPaneChannels.SplitPaneHidden);
        }
    }

    private isSplitPaneVisible(): boolean {
        return this.splitPaneAreas.length === 1;
    }

    private isSplitPaneHidden(): boolean {
        return this.splitPaneAreas.length === 0;
    }

    private splitPaneTypeAlreadyExists(areaId: string): boolean {
        const areaType = this.getSplitAreaType(areaId);
        return this.splitPane && this.splitPane.hasSplitArea(areaId, areaType);
    }

    private showSplitAreaExistMessage(areaId: string): void {
        this._confirmDialog.open({
            message: this.getErrorItemMessage(areaId),
            title: this.getErrorItemDialogTitle(),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private initContainerAreas(): void {
        this.splitPaneSize = this.splitPaneInitialSize;
        this.containerAreasInfo = this.getContainerAreasInfo();
        this.setContainerAreasSize(this.splitPaneInitialSize);
    }

    private initClickEventResolver(): void {
        this._gutterClickEventResolver = new ClickEventResolver(
            event => this.handleSplitGutterClick(event),
            event => this.handleSplitGutterClick(event)
        );
    }

    private showSplitter(): void {
        this.setContainerSplitVisible(true);
    }
    private hideSplitter(): void {
        this.setContainerSplitVisible(false);
    }

    private setContainerSplitVisible(visible: boolean): void {
        if (visible) {
            this.splitterVisible = true;
            this.splitContainerClass = 'tab-split-container';
        } else {
            this.splitterVisible = false;
            this.splitContainerClass = 'tab-no-split-container';
        }
    }
}
