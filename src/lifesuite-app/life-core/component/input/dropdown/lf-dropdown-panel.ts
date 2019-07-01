import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    Inject,
    NgZone,
    Optional
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { ɵn as NgDropdownPanelComponent, ɵo as VirtualScrollService, ɵp as WindowService } from '@ng-select/ng-select';

@Component({
    selector: 'lf-dropdown-panel',
    templateUrl: './lf-dropdown-panel.html',
    styleUrls: ['./lf-dropdown-panel.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LfDropdownPanelComponent extends NgDropdownPanelComponent {
    constructor(
        renderer: Renderer2,
        zone: NgZone,
        virtualScrollService: VirtualScrollService,
        window: WindowService,
        elementRef: ElementRef,
        @Optional()
        @Inject(DOCUMENT)
        _document: any
    ) {
        super(renderer, zone, virtualScrollService, window, elementRef, _document);
    }
}
