import { Component, Input, ElementRef, forwardRef, ViewChild, AfterViewInit } from '@angular/core';

import { IStatefulComponent, StatefulComponent, ComponentState } from 'life-core/component/shared';
import { LfSplitComponent } from '../split-component';
import { SplitDirection, GutterSize, GutterColor } from '../lf-split.model';
import { SplitPaneArea, SplitPaneAreaData } from './lf-split-pane.model';

@Component({
    selector: 'lf-split-pane',
    templateUrl: './lf-split-pane.component.html',
    providers: [{ provide: StatefulComponent, useExisting: forwardRef(() => LfSplitPaneComponent) }]
})

/**
 * Split pane component represents a pane containing one or more split areas.
 */
export class LfSplitPaneComponent implements IStatefulComponent, AfterViewInit {
    @Input()
    public splitPaneAreas: SplitPaneArea[];

    @Input()
    public direction: SplitDirection;

    @ViewChild(LfSplitComponent)
    protected splitComponent: LfSplitComponent;

    public gutterSize: number = GutterSize.large;

    public gutterColor: string = GutterColor.default;

    public dragGutterColor: string = GutterColor.drag;

    private _stateId: string;

    private _elementRef: ElementRef<HTMLElement>;

    constructor(elementRef: ElementRef<HTMLElement>) {
        this._elementRef = elementRef;
    }

    public ngAfterViewInit(): void {
        // hideArea()/showArea() - workaround to correctly layout multiple areas inside split pane;
        // (without it split component shows first area as collapsed).
        // setTimeout() - additional IE workaround for the same issue.
        setTimeout(() => {
            this.splitComponent.displayedAreas.forEach(area => {
                this.splitComponent.hideArea(area.comp);
                this.splitComponent.showArea(area.comp);
            });
        }, 0);
    }

    public hasSplitArea(areaId: string, areaType: string): boolean {
        return this.splitPaneAreas.some(area => area.id == areaId || area.type == areaType);
    }

    public onSplitDragStart(e: { gutterNum: number; sizes: Array<number> }): void {
        this.gutterColor = GutterColor.drag;
    }

    public onSplitDragEnd(e: { gutterNum: number; sizes: Array<number> }): void {
        this.gutterColor = GutterColor.default;
        e.sizes.forEach((size, index) => {
            this.splitPaneAreas[index].displayedSize = size;
        });
    }

    public onSplitGutterClick(e: { gutterNum: number; sizes: Array<number> }): void {
        // console.debug('splitGutterClick =', e.gutterNum);
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
        componentState.set('splitPaneAreas', this.splitPaneAreas);
        return componentState;
    }

    @Input()
    public set state(componentState: ComponentState) {
        if (componentState) {
            const savedAreas = componentState.get('splitPaneAreas') as SplitPaneArea[];
            this.setAreaSizes(savedAreas);
        }
    }

    private setAreaSizes(savedAreas: SplitPaneArea[]): void {
        savedAreas.forEach(savedArea => {
            const adjustArea = this.splitPaneAreas.find(area => area.id == savedArea.id);
            adjustArea.size = savedArea.displayedSize;
        });
    }

    private setNameAttribute(name: string): void {
        const paneHtmlElement = this._elementRef.nativeElement;
        if (!paneHtmlElement.getAttribute('name')) {
            paneHtmlElement.setAttribute('name', name);
        }
    }
}
