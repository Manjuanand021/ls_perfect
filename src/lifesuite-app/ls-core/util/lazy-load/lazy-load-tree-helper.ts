import { NTree } from 'ls-core/service/load-bypk';
import { LazyName } from './lazy-load.util';

export class LazyLoadTreeHelper {
    public static checkOneBranch(items: Array<any>, propertyTree: NTree<string>): boolean {
        let i: number = propertyTree.children.length;
        while (i--) {
            let oneProperty: Array<any>;
            let propertyHasValue = true;
            let resultProperty: Array<any> = new Array();
            const propertyName = propertyTree.children[i].data + LazyName;
            items.forEach(item => {
                oneProperty = item[propertyName];
                if (oneProperty != null) {
                    if (oneProperty.length > 0) {
                        resultProperty = resultProperty.concat(oneProperty);
                    }
                } else {
                    propertyHasValue = false;
                    return;
                }
            });
            if (!propertyHasValue) {
            } else if (propertyTree.children[i].children.length == 0 || resultProperty.length == 0) {
                propertyTree.children.splice(i, 1);
            } else {
                if (!LazyLoadTreeHelper.checkOneBranch(resultProperty, propertyTree.children[i])) {
                    propertyTree.children.splice(i, 1);
                }
            }
        }
        return propertyTree.children.length > 0;
    }
}

export class LazyLoadDataMerger {
    public static addLazyCollectionToTarget(
        sourceCollection: Array<any>,
        targetObject: any,
        propertyTree: NTree<string>
    ): void {
        const propertyName: string = propertyTree.data + LazyName;
        if (targetObject[propertyName] == null) {
            targetObject[propertyName] = sourceCollection;
        } else {
            const sourceObject: any = new Object();
            sourceObject[propertyName] = sourceCollection;
            LazyLoadDataMerger.mergeTree(sourceObject, targetObject, propertyTree);
        }
    }

    private static mergeTree(sourceObject: any, targetObject: any, propertyTree: NTree<string>): void {
        const sourceArray: Array<any> = sourceObject[propertyTree.data + LazyName];
        const targetArray: Array<any> = targetObject[propertyTree.data + LazyName];
        if (targetArray == null) {
            targetObject[propertyTree.data + LazyName] = sourceArray;
        } else {
            propertyTree.children.forEach(treeItem => {
                const tempSourceArray = sourceArray.slice();
                targetArray.forEach(target => {
                    for (let i = 0; i < tempSourceArray.length; i++) {
                        if (target.identifier.ObjectID == tempSourceArray[i].identifier.ObjectID) {
                            this.mergeTree(tempSourceArray[i], target, treeItem);
                            tempSourceArray.splice(i, 1);
                            break;
                        }
                    }
                });
            });
        }
    }
}
