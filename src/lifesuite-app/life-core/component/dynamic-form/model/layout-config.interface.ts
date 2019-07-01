export interface FormLayout {
    colsPerField: number;
    calculate(): void;
}

export interface FormLayoutConfig {
    fieldsPerRow: number;
}

export interface FieldLayoutConfig {
    colspan?: number;
}
