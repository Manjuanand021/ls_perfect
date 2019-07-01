import { FieldConfig } from 'life-core/component/dynamic-form';

/**
* Maps Plan code to array of form field definitions
*/
export type PlanFormFieldsMap = Map<string, Array<FieldConfig>>; 

/**
* Data holder class to store form field definitions per plan code
*/
export abstract class PlanCoverageFormFields {
	/**
	* Maps plan code to form field definitions for given plan
	*/
	private _map: PlanFormFieldsMap = new Map<string, Array<FieldConfig>>();

	public get loaded(): boolean {
		return this._map.size > 0;
	}

	public set(key: string, value: FieldConfig[]): void {
		this._map.set(key, value);
	}

	public get(key: string): FieldConfig[] {
		return this._map.get(key);
	}

}
