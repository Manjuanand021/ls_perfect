import { LangUtil } from 'life-core/util/lang';

/**
 *  Utility methods to remove / restore circular object references
 *  during JSON serialization / deserealization.
 *  The JSON circular reference format assumed in these methods
 *  is compatible with Newtonsoft Json.NET framework.
 *
 *  After removing circluar references, each object will have a property
 *		$id: "id_value", for example: $id: "1"
 *  and each circular reference to the objects will be replaced with a value
 *		{"$ref": "id_value"}, for example: {"$ref": "1"}
 *
 *  For example, the object construct:
 * 	  let obj = {};
 * 	  obj.childObj = {};
 * 	  obj.childObj.parent = obj;
 *
 *  will result in the following Json after removing circluar reference:
 *	{
 *		"$id": "1",
 *		"childObj: {
 *			"$id": "2",
 *			"parent": {"$ref": "1"}
 *		}
 *  }
 */

const propId = '$id';
const propRef = '$ref';
const propType = '$type';

/**
 *  Recurses the object tree, assigning property '$id' to each object
 *  and replacing circular references with { $ref: 'id' }.
 */
export function removeCircularRefs(obj: any): any {
    /**
     *  Keeps a reference to each unique object.
     */
    const objects: Map<string, Object> = new Map<string, Object>();

    /**
     *  Incremental id of each unique object.
     */
    let nextId = 0;

    const storeObject = function(obj: Object): void {
        nextId++;
        objects.set(nextId.toString(), obj);
    };

    const removeRefs = function(value: any): Object | Array<Object> {
        if (LangUtil.isObject(value)) {
            // If the value is object or array, check if we have already
            // encountered it. If so, return a {$ref: id} object.
            let matchedKey: string;
            objects.forEach((item, key) => {
                if (item == value) {
                    matchedKey = key;
                }
            });
            if (matchedKey) {
                return { [propRef]: matchedKey };
            }
            // If it is an array, replicate the array.
            if (LangUtil.isArrayOfObjects(value)) {
                let newArray: Array<Object>;
                newArray = [];
                for (const item of value) {
                    newArray.push(removeRefs(item));
                }
                return newArray;
            } else {
                // If it is an object, replicate the object.
                // Store object for future reference with a unique id
                storeObject(value);

                const newObject: Object = {};
                newObject[propId] = nextId.toString();
                if (LangUtil.has(value, propType)) {
                    newObject[propType] = value[propType];
                }

                for (const prop in value) {
                    if (LangUtil.has(value, prop)) {
                        LangUtil.isObject(value[prop])
                            ? (newObject[prop] = excludeObject(value[prop]) ? value[prop] : removeRefs(value[prop]))
                            : (newObject[prop] = value[prop]);
                    }
                }
                return newObject;
            }
        } else {
            return value;
        }
    };
    return removeRefs(obj);
}

/**
 *  Recurses the object tree, restoring circular references (if necessary),
 *  removing property '$id' of each object
 *  and replacing { $ref: 'id' } with corresponding object reference.
 */
export function restoreCircularRefs(obj: any): any {
    /**
     *  Keeps a reference to each unique object.
     */
    const objects: Map<string, Object> = new Map<string, Object>();

    /**
     *  Fills objects dictionary with unique objects based on object's '$id' property.
     */
    const fillObjectDictionary = function(value: any): void {
        if (LangUtil.isObject(value)) {
            if (LangUtil.has(value, propId)) {
                objects.set(value[propId], value);
            }
            for (const prop in value) {
                if (LangUtil.has(value, prop)) {
                    if (LangUtil.isArrayOfObjects(value[prop])) {
                        for (const item of value[prop]) {
                            fillObjectDictionary(item);
                        }
                    } else if (LangUtil.isObject(value[prop])) {
                        fillObjectDictionary(value[prop]);
                    }
                }
            }
        }
    };

    /**
     *  Walks recursively through the object tree looking for $ref properties.
     *	When it finds one that has a value, it replaces the $ref object
     *  with a reference to the object corresponding to the $ref's value.
     */
    const restoreRefs = function(value: any): Object | Array<Object> {
        if (LangUtil.isObject(value)) {
            if (LangUtil.isArrayOfObjects(value)) {
                for (const valueItem of value) {
                    restoreRefs(valueItem);
                    if (LangUtil.has(valueItem, propId)) {
                        delete valueItem[propId];
                    }
                }
            } else {
                for (const prop in value) {
                    if (LangUtil.isObject(value[prop])) {
                        if (LangUtil.has(value[prop], propRef)) {
                            value[prop] = objects.get(value[prop][propRef]);
                        } else {
                            restoreRefs(value[prop]);
                        }
                    }
                }
                if (LangUtil.has(value, propId)) {
                    delete value[propId];
                }
            }
        }
        return value;
    };

    fillObjectDictionary(obj);
    return restoreRefs(obj);
}

function excludeObject(obj: Object): boolean {
    return obj instanceof Date;
}
