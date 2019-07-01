import {FieldDescriptorBase} from './field-descriptor.model';
import {FieldBindingUtil} from './field-binding.util';

export class FieldDataWatcher {

    // Map of watched FieldDescriptor handlers by uiId
    private _fieldWatchHandlerMap: { [uiId: string]: Function[] } = {};

    public watchFieldDescriptor(field: FieldDescriptorBase, handler: Function): void {
        var fieldUiId: string = field.uiId;
        if (this._fieldWatchHandlerMap[fieldUiId] == null) {
            this._fieldWatchHandlerMap[fieldUiId] = new Array<Function>();
        }
        if (!this.fieldWatchHandlerExist(fieldUiId, handler)) {
            this._fieldWatchHandlerMap[fieldUiId].push(handler);
        }
        FieldBindingUtil.onFieldValueChange(field, handler);
    }

    private fieldWatchHandlerExist(fieldUiId: string, handler: Function): boolean {
        return this._fieldWatchHandlerMap[fieldUiId].indexOf(handler) != -1;
    }

    public attachWatchHandlersForFields(fields: FieldDescriptorBase[]): void {
        fields.forEach(field => {
            this.attachFieldWatchHandlers(field);
        });
    }

    private attachFieldWatchHandlers(field: FieldDescriptorBase): void {
        if (this._fieldWatchHandlerMap[field.uiId] != null) {
            this._fieldWatchHandlerMap[field.uiId].forEach(handler => {
                this.watchFieldDescriptor(field, handler);
            });
        }
    }

    public destroy(): void {
        this._fieldWatchHandlerMap = null;
    }
}
