import { ObjectUtil, IDefaultConstructor } from 'life-core/util/lang';

export type PredicateType<T> = (item: T) => boolean;

export class CollectionUtil {
    public static addItemIfNotFound<T>(
        collection: T[],
        itemType: IDefaultConstructor<T>,
        predicate: PredicateType<T>
    ): T | undefined {
        let item: T;
        if (!this.getItem(collection, predicate)) {
            item = this.addItem<T>(collection, itemType);
        }
        return item;
    }

    public static addItemIfCollectionEmpty<T>(collection: T[], itemType: IDefaultConstructor<T>): T | undefined {
        let item: T;
        if (collection && collection.length == 0) {
            item = this.addItem<T>(collection, itemType);
        }
        return item;
    }

    public static getItem<T>(collection: T[], predicate: PredicateType<T>): T | undefined {
        return collection.find(item => predicate(item));
    }

    public static addItem<T>(collection: T[], itemType: IDefaultConstructor<T>): T {
        const item = CollectionUtil.createItem<T>(itemType);
        collection.push(item);
        return item;
    }

    public static createItem<T>(itemType: IDefaultConstructor<T>): T {
        const item = ObjectUtil.createObjectOfType({}, itemType) as T;
        return item;
    }

    public static deleteItem<T>(collection: T[], index: number): T {
        if (collection && collection.length > 0 && index >= 0) {
            return collection.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * creates and returns new collection if collection is undefined/null
     */
    public static getNewCollection<T>(collection: T[]): T[] {
        let items: T[];
        if (!collection) {
            items = new Array<T>();
        }
        return items;
    }
}
