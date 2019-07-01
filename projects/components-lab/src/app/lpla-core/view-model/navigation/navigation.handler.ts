import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NavigationTopics } from './navigation-topics';
import { INavigableView } from './navigable-view.interface';
import { NavigationType } from './navigation-type';

@Injectable()
export class NavigationHandler {
    private _navigationSubscription: Subject<string>;

    private _navigableView: INavigableView;

    constructor(/* navigableView: INavigableView */) {
        this._navigationSubscription = new Subject<string>();
        // TODO: Angular 6 Upgrdage
        // Temporary fix for AOT compilation warning
        // this._navigableView = navigableView;
        this.initializeSubscription();
    }

    private initializeSubscription(): void {
        this._navigableView.trackSubscription(
            this._navigationSubscription.subscribe(navigationTopic => {
                this.onNavigate(navigationTopic);
            })
        );
    }

    private onNavigate(navigationTopic: string): void {
        if (navigationTopic == NavigationTopics.NAVIGATE_BACK) {
            this.navigateBack();
        } else if (navigationTopic == NavigationTopics.NAVIGATE_FORWARD) {
            this.navigateForward();
        }
    }

    private navigateBack(): void {
        this._navigableView.getViewValidationStrategy().setNavigationType(NavigationType.PREVIOUS);
        this._navigableView.navigateBack();
    }

    private navigateForward(): void {
        this._navigableView.getViewValidationStrategy().setNavigationType(NavigationType.NEXT);
        this._navigableView.navigateForward();
    }
}
