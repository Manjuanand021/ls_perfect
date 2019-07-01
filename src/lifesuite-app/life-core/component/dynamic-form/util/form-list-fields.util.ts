import { FieldConfig, ListFieldConfig } from '../model/field-config.interface';

export class FormListFieldsUtil {
    public static getListFields(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (field as ListFieldConfig) != undefined;
        });
    }

    public static getListFieldsWithListType(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (field as ListFieldConfig) != undefined && (<ListFieldConfig>field).listType != undefined;
        });
    }

    public static isListFieldsWithDynamicType(field: FieldConfig): boolean {
        return (field as ListFieldConfig) != undefined && (<ListFieldConfig>field).dynamicType;
    }

    public static getListFieldsWithDynamicType(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (field as ListFieldConfig) != undefined && (<ListFieldConfig>field).dynamicType;
        });
    }

    public static getListFieldsWithStaticMetaType(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (
                (field as ListFieldConfig) != undefined &&
                (<ListFieldConfig>field).metaType != undefined &&
                !(<ListFieldConfig>field).dynamicType
            );
        });
    }

    public static getListFieldsWithDynamicMetaType(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (
                (field as ListFieldConfig) != undefined &&
                (<ListFieldConfig>field).metaType != undefined &&
                (<ListFieldConfig>field).dynamicType
            );
        });
    }

    public static getListFieldsWithResolveType(fields: Array<FieldConfig>): Array<ListFieldConfig> {
        return fields.filter(field => {
            return (field as ListFieldConfig) != undefined && (<ListFieldConfig>field).resolveType != undefined;
        });
    }
}
