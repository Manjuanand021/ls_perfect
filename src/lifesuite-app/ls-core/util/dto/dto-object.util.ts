import { ObjectUtil, IDefaultConstructor } from 'life-core/util/lang';
import { BaseDTO, DataCollectionNameToDTOMap } from 'ls-core/model';
import { DTOObjectDescriptor } from 'ls-core/service/model/dto-object.model';
import { DependentListHelper } from 'ls-core/service/list-data/dependent-list.helper';
import { ExpandTreeType } from 'ls-core/service/load-bypk';
import { LazyLoadUtil } from '../lazy-load/lazy-load.util';

export class DTOObjectUtil {
    public static getDescriptor(dto: Object): DTOObjectDescriptor {
        const descriptor = new DTOObjectDescriptor();

        if (dto instanceof BaseDTO) {
            const dtoObject = <BaseDTO>dto;
            const id = dtoObject.getIdentifier();
            if (id) {
                descriptor.ClassNameMapped = id.ClassNameMapped;
                descriptor.ObjectID = id.ObjectID;
            }
        }

        const objectType: string = (<any>dto).$type;
        const className: string = DTOObjectUtil.getClassNameFromType(objectType);
        descriptor.DTOClassName = className;
        descriptor.DTOObjectMembers = DependentListHelper.getDependencies(dto, className);
        return descriptor;
    }

    /**
     *  Get class name from object type
     * e.g., get 'life.ls.ui.ria.dto.PolicyDTO' from 'life.ls.ui.ria.dto.PolicyDTO, LifeSuite.UIServiceDTO'
     */
    public static getClassNameFromType(classType: string): string {
        const index = classType.indexOf(',');
        return index > 0 ? classType.substring(0, index) : classType;
    }

    public static convertObjectType(object: Object, expandTree: ExpandTreeType): void {
        const childNodeNames: Array<string> = expandTree.children.map(child => {
            return child.data;
        });
        if (childNodeNames == null || childNodeNames.length == 0) return;
        Object.keys(object).forEach(key => {
            const childNodeName = childNodeNames.find(child => {
                return `${child}_LazyLoad` == key;
            });
            if (childNodeName) {
                object[key] = ObjectUtil.createObjectOfType(object[key], DataCollectionNameToDTOMap[childNodeName]);
                (object as BaseDTO).recordLazyLoadedProperty(key);
                const childNode = expandTree.children.find(child => {
                    return child.data == childNodeName;
                });
                if (childNode != null) {
                    object[key].forEach(dto => {
                        this.convertObjectType(dto, childNode);
                    });
                }
            }
        });
    }

    /**
     *  Returns random Id
     */
    public static generateDTOObjectId(obj?: Object): number {
        const ObjectIdOffset = 10000000;
        return Math.floor(Math.random() * ObjectIdOffset);
    }

    public static deepConvertObjectOfType<T>(object: Object, dataType: IDefaultConstructor<T>): T | T[] {
        if (!dataType) {
            throw new Error('Exception, Type not found in collection!');
        }
        const result = ObjectUtil.createObjectOfType(object, dataType);
        Object.keys(object).forEach(key => {
            if (LazyLoadUtil.isLazyLoadProperty(key)) {
                const tempArray: Array<any> = result[key];
                if (tempArray && tempArray.length > 0) {
                    const lazyName = LazyLoadUtil.getLazyPropertyName(key);
                    for (let i = 0; i < tempArray.length; i++) {
                        tempArray[i] = DTOObjectUtil.deepConvertObjectOfType(
                            tempArray[i],
                            DataCollectionNameToDTOMap[lazyName]
                        );
                    }
                }
            }
        });

        return result;
    }
}
