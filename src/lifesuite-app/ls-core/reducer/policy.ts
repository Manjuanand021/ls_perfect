import { Action } from 'life-core/reducer/action';

import { Identifiable } from '../model/dto';
import { DataSavingFlags, DeleteObjectAction, DataSaveStatus } from 'life-core/reducer/actions';

export function isDirty(state: boolean = false, action: Action<boolean>): any {
    switch (action.type) {
        case DataSavingFlags.DATA_DIRTY:
            return action.payload;

        default:
            return state;
    }
}

export function isSaving(state: boolean = false, action: Action<DataSaveStatus>): any {
    switch (action.type) {
        case DataSavingFlags.DATA_SAVE_STATUS:
            return action.payload == DataSaveStatus.InProgress;

        default:
            return state;
    }
}

export function deleteObject(
    state: Array<Identifiable> = new Array<Identifiable>(),
    action: Action<Identifiable>
): any {
    switch (action.type) {
        case DeleteObjectAction.DELETE_OBJECT:
            if (
                state.find(
                    n => n.ClassNameMapped == action.payload.ClassNameMapped && n.ObjectID == action.payload.ObjectID
                )
            ) {
                return state;
            } else {
                return [
                    ...state,
                    {
                        ClassNameMapped: action.payload.ClassNameMapped,
                        ParentPropertyNameRelated: action.payload.ParentPropertyNameRelated,
                        ObjectID: action.payload.ObjectID,
                        ObjectSignature: action.payload.ObjectSignature,
                        ParentIdentifier: action.payload.ParentIdentifier
                    }
                ];
            }
        case DeleteObjectAction.CLEAR_DELETE_OBJECT_CACHE:
            return new Array<Identifiable>();
        default:
            return state;
    }
}

/**
 *   this is the root reducer that holds all the reducer definition for the entire system
 */
export const rootReducer = {
    isDirty: isDirty,
    isSaving: isSaving,
    deleteObject: deleteObject
};
