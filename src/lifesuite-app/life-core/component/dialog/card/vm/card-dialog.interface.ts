import { IDialogViewModel } from 'life-core/component';

export interface ICardDialogViewModel extends IDialogViewModel {
    initData(): void;
    getState(): any;
    setState(stateData: any): void;
}
