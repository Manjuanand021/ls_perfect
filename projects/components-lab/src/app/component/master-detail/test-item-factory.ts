import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { TestItem } from './test-item.model';

export class TestItemFactory extends BaseDTOItemFactory<any> {
	public newInstance(createItemParams: any): any {
		let testItem: TestItem = new TestItem();
		testItem.id = this.getNextId(createItemParams.items, 'id');
		return testItem;
	}
}