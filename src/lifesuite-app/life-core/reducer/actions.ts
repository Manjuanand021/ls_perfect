export const DataSavingFlags = {
    DATA_DIRTY: 'DATA_DIRTY',
    DATA_SAVE_STATUS: 'DATA_SAVE_STATUS'
};

export enum DataSaveStatus {
    InProgress = 1,
    Succeeded = 2,
    Failed = 3
}

export const DeleteObjectAction = {
    DELETE_OBJECT: 'DELETE_OBJECT',
    CLEAR_DELETE_OBJECT_CACHE: 'CLEAR_DELETE_OBJECT_CACHE'
};
