import { Component, Injector, ViewChild } from '@angular/core';

import { I18n } from 'life-core/i18n';

import {
    SplitArea,
    SplitPaneArea,
    SplitAreasInfo,
    LfSplitPaneComponent,
    SplitPaneContainerViewModel
} from 'life-core/component/layout/split';
import { TabPolicySplitPaneAreaDefs } from './tab-policy-split-pane-areas';

@Component({
    selector: 'tab-policy-split-container',
    templateUrl: './tab-policy-split-container.component.html',
    styleUrls: ['./tab-policy-split-container.component.scss']
})
export class TabPolicySplitContainerComponent extends SplitPaneContainerViewModel {
    @ViewChild(LfSplitPaneComponent)
    protected splitPane: LfSplitPaneComponent;

    constructor(injector: Injector, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
    }

    protected getContainerAreasInfo(): SplitAreasInfo {
        return {
            left: new SplitArea({ id: 'split-left', index: 1 }),
            right: new SplitArea({ id: 'split-right', index: 2 })
        };
    }

    protected createSplitPaneArea(areaId: string): SplitPaneArea {
        return SplitPaneAreaFactory.createSplitPaneArea(areaId);
    }

    protected setContainerAreasSize(splitPaneSize: number): void {
        const SplitTotalSize = 100;
        this.containerAreasInfo.right.size = splitPaneSize;
        this.containerAreasInfo.left.size = SplitTotalSize - splitPaneSize;
    }

    protected get splitPaneInitialSize(): number {
        const SplitPanelInitialSize = 35;
        return SplitPanelInitialSize;
    }

    protected get splitPaneStateValueKey(): string {
        return 'policy_split_pane';
    }

    protected getErrorItemDialogTitle(): string {
        return this.i18n({ value: 'Message from webpage', id: 'dialog.message.from.webpage.error' });
    }

    protected getSplitAreaType(areaId: string): string {
        return TabPolicySplitPaneAreaDefs[areaId] ? TabPolicySplitPaneAreaDefs[areaId].type : '';
    }
}

class SplitPaneAreaFactory {
    public static createSplitPaneArea(areaId: string): SplitPaneArea {
        const splitPaneArea: SplitPaneArea = TabPolicySplitPaneAreaDefs[areaId];
        if (!splitPaneArea) {
            throw new Error(`Undefined Split Pane Area ID: '${areaId}'.`);
        }
        return splitPaneArea;
    }
}
