import { EventEmitter } from '@angular/core';

import { FieldDescriptorBase, FieldDescriptor, ListFieldDescriptor, IListItem } from 'lpla-core/field';

// Field Model for binding with KendoUI Angular2 components
export class FieldModel {
	_value: any;
	model: FieldDescriptorBase;

	constructor(value: any, model: FieldDescriptorBase) {
		this.model = model;
		this._value = this.getModelValue(value);
	}

	get value(): any {
		return this._value;
	}

	set value(value: any) {
		let oldValue = this._value;
		this._value = this.getModelValue(value);
		if (this._valueEmitter) {
			if (value != oldValue) {
				this._valueEmitter.emit(value);
			}
		}
	}

	protected getModelValue(value: any): any {
		return value;
	}

	_valueEmitter: EventEmitter<any>;
	subscribe(f: Function) {
		if (!this._valueEmitter) {
			this._valueEmitter = new EventEmitter<any>();
		}
		this._valueEmitter.subscribe(value => f(value));
	}

	destroy(): void {
		if (this._valueEmitter) {
			this._valueEmitter.unsubscribe();
		}
	}

	protected cloneModel(): FieldDescriptorBase {
		return Object.assign({}, this.model);
	}

	setEnabled(enabled: boolean): void {
		let model = this.cloneModel();
		model.isEditable = enabled;
		this.model = model;
	}

	setAvailable(available: boolean): void {
		let model = this.cloneModel();
		model.isAvailable = available;
		this.model = model;
	}

	setRequired(required: boolean): void {
		let model = this.cloneModel();
		model.isRequired = required;
		this.model = model;
	}

}

export class ListFieldModel<T> extends FieldModel {

	model: ListFieldDescriptor<T>;

	// Uncomment to support KendoUI dropdown
	//protected getModelValue(value: any): any {
	//	let isSimpleValue = this.isSimpleValue(value);
	//	return this.model.listItems.find(listItem => isSimpleValue ? listItem.CodeID == value : listItem == value);
	//}

	private isSimpleValue(value) {
		return !(value instanceof Object);
	}

	protected cloneModel(): ListFieldDescriptor<T> {
		return Object.assign({}, this.model);
	}

	setList(listItems: IListItem<T>[]): void {
		let model = this.cloneModel();
		model.listItems = listItems;
		this.model = model;
	}


}