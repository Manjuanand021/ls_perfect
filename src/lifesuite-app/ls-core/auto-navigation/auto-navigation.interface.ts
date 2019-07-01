import { INavigationSequence } from 'ls-core/model/auto-navigation';

export interface IAutoNavigation {
    initializeAutoNavigationChannel(): void;
    processNavigationSequence(sequence: INavigationSequence): void;
}
