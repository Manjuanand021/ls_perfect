export interface DataGridField {
    fieldId: string;
    headerNameId: string;
}

export type DataGridFields = { readonly [fieldKey: string]: DataGridField };
