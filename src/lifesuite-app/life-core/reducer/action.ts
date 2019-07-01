import { Action as NgRxAction } from '@ngrx/store';

export interface Action<T> extends NgRxAction {
    payload: T;
}

/*
//From https://github.com/ngrx/platform/issues/128#issuecomment-316680916
type GenericAction<T> = {
	[K in keyof T]: T[K]
}
export default interface Action<T> extends Action {
	payload: GenericAction<T>
}
*/
