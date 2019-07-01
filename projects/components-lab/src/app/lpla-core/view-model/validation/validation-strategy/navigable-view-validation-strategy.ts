import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IViewValidationStrategy } from 'life-core/view-model';
import { NavigationType } from '../../navigation/navigation-type';
import { NextRouteRecognizer } from './next-route-recognizer';

@Injectable()
export class NavigableViewValidationStrategy implements INavigableViewValidationStrategy {

	protected _navigationType: NavigationType;

	private _nextRouteRecognizer: NextRouteRecognizer;

	constructor(router: Router) {
		this._nextRouteRecognizer = new NextRouteRecognizer(router);
	}

	public setNavigationType(navigationType: NavigationType): void {
        this._navigationType = navigationType;
    }

    public needToValidate(): boolean {
        if (this._navigationType == NavigationType.NEXT) {
            return this.validateOnNavigateNext();
        } else if (this._navigationType == NavigationType.PREVIOUS) {
            return this.validateOnNavigatePrevious();
        } else {
            return this.validateOnNavigateFixed();
        }
    }

    protected validateOnNavigateNext(): boolean {
        return true;
    }

    protected validateOnNavigatePrevious(): boolean {
        return true;
    }

	protected validateOnNavigateFixed(): boolean {
		if (this._nextRouteRecognizer.nextRoute) {
			return this._nextRouteRecognizer.nextRoute.data['validateCurrent'] != false;
		}
		return true;
	}

    public resetNavigationType(): void {
        this._navigationType = null;
	}

	public destroy(): void {
		this._nextRouteRecognizer.destroy();
	}
}

export interface INavigableViewValidationStrategy extends IViewValidationStrategy {
	setNavigationType(navigationType: NavigationType): void;
	resetNavigationType(): void;
}
