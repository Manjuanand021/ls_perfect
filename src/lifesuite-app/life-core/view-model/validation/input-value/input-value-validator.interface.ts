export enum InputValueValidationResult {
    fail = 0,
    pass = 1
}

export interface InputValueValidator {
    validate(...params: any[]): InputValueValidationResult;
}
