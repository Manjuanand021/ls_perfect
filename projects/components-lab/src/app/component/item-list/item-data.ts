export class ItemData {

	id: string;

	name: string;

	type: string;

	constructor(type: string, id: string, name: string) {
		this.type = type;
		this.id = id;
		this.name = name;
	}
}