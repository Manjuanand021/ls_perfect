import { INavigationSequence, NavigationTarget, NavigationTargetTypes } from 'ls-core/model/auto-navigation';

// for future use

export class AutoNavigationProcessor {
    constructor() {}

    public navigationSequenceProcessor(sequence: INavigationSequence): void {
        const target = sequence.getNextNavigationTarget();
        if (target) {
            switch (target.targetType) {
                case NavigationTargetTypes.Tab: {
                    this.processTabNavigationTarget(target);
                    break;
                }
                case NavigationTargetTypes.SubTab: {
                    this.processSubTabNavigationTarget(target);
                    break;
                }
                case NavigationTargetTypes.Popup: {
                    this.processPopupNavigationTarget(target);
                    break;
                }
                case NavigationTargetTypes.Route: {
                    this.processRouteNavigationTarget(target);
                    break;
                }
            }
        }
    }

    private processTabNavigationTarget(target: NavigationTarget): void {
        // TODO
    }
    private processSubTabNavigationTarget(target: NavigationTarget): void {
        // TODO
    }
    private processPopupNavigationTarget(target: NavigationTarget): void {
        // TODO
    }
    private processRouteNavigationTarget(target: NavigationTarget): void {
        // TODO
    }
}
