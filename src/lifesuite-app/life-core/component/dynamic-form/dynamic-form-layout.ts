import { FormLayoutConfig, FormLayout, FieldLayoutConfig } from './model/layout-config.interface';

export class DynamicFormLayout implements FormLayout {
    protected _colsPerField: number;

    public layout: FormLayout;

    private _layoutConfig: FormLayoutConfig;

    constructor(layoutConfig: FormLayoutConfig) {
        this._layoutConfig = layoutConfig;
    }

    public get colsPerField(): number {
        return this._colsPerField;
    }

    public calculate(): void {
        this.setColsPerField();
    }

    private setColsPerField(): void {
        this._colsPerField =
            this._layoutConfig && this._layoutConfig.fieldsPerRow
                ? ColsPerRow / this._layoutConfig.fieldsPerRow
                : DefaultFieldsPerRow;
    }

    public getFieldColSpan(fieldLayoutConfig: FieldLayoutConfig): number {
        return fieldLayoutConfig && fieldLayoutConfig.colspan ? fieldLayoutConfig.colspan : this.colsPerField;
    }
}

const ColsPerRow = 12;
const DefaultFieldsPerRow = 3;
