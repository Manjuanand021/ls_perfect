import { Identifiable } from '../model/dto';

export interface AppState {
    readonly isDirty: boolean;
    readonly isSaving: boolean;
    readonly deleteObject: Array<Identifiable>;
}
