import { Component, Injectable, Input} from '@angular/core';
import {NavigationTopics} from 'lpla-core/view-model';
import { Subject } from 'rxjs';

@Component({
    selector: 'navigation-strip',
    templateUrl: './navigation-strip.html'
})

@Injectable()
export class NavigationStrip {

	@Input() back_button_visible: boolean = true;
    @Input() back_button_enabled: boolean = true;
    @Input() next_button_visible: boolean = true;
    @Input() next_button_enabled: boolean = true;

    private _navigationEmitter: Subject<string>;

    constructor(eventAggregator: Subject<string>) {
        this._navigationEmitter = eventAggregator;
	}

    public onBackClick(): void {
		if (this.back_button_enabled) {
			this._navigationEmitter.next(NavigationTopics.NAVIGATE_BACK);
		}
	}

    public onContinueClick(): void {
		if (this.next_button_enabled) {
			this._navigationEmitter.next(NavigationTopics.NAVIGATE_FORWARD);
		}
    }
}
