export type DataSaveCallback = (closeStatus: DataSaveStatus) => void;

export enum DataSaveStatus {
    successDataSaved = 0,
    failToSave = 1,
    failToValidate = 3,
    successNoNeedToSave = 2,
    failAndContinue = 4,
    failAndCancel = 5
}
