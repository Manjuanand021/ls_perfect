import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NavigableViewValidationStrategy } from './navigable-view-validation-strategy';

@Injectable()
export class ApplicationViewValidationStrategy extends NavigableViewValidationStrategy {

	constructor(router: Router) {
		super(router);
	}

    protected validateOnNavigateNext(): boolean {
        return true;
    }

    protected validateOnNavigatePrevious(): boolean {
        return false;
	}

}
