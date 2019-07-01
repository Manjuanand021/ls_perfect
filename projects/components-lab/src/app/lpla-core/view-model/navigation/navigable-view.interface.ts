import { Subscription } from 'rxjs';

import { INavigableViewValidationStrategy } from 'lpla-core/view-model';

export interface INavigableView {
	getViewValidationStrategy(): INavigableViewValidationStrategy;
    navigateBack(): void;
    navigateForward(): void;
    trackSubscription(s: Subscription): void;
}
