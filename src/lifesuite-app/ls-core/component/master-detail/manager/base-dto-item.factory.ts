import { BaseItemFactory } from 'life-core/component/master-detail';

export abstract class BaseDTOItemFactory<TItem> extends BaseItemFactory<TItem, number> {
    protected getNextId(items: Array<TItem>, idProperty: string): number {
        const ids: number[] = items.map(item => {
            return item[idProperty];
        });
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        return maxId + 1;
    }
}
