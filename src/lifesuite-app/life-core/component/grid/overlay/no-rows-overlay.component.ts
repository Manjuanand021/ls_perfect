import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';

@Component({
    selector: 'no-rows-overlay',
    template: `
        <div class="ag-bl-overlay" ref="overlay" style="">
            <div class="ag-overlay-panel" role="presentation">
                <div class="ag-overlay-wrapper ag-overlay-no-rows-wrapper" ref="noRowsOverlayWrapper">
                    <span class="ag-overlay-no-rows-center" i18n="@@component.grid.overlay.norows">No Rows To Show</span>
                </div>
            </div>
        </div>
    `
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp {
    constructor() {}

    public agInit(params: any): void {}

    public init(params: INoRowsOverlayParams): void {}

    public getGui(): HTMLElement {
        return null;
    }
}
