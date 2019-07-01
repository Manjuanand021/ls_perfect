import { BaseDTO, isIIdentifiable } from 'ls-core/model';
import { ListsDataRequest, ListDataRequest } from './list-data.model';
import { DTOObjectDescriptor, ListDataProperties } from '../model/dto-object.model';
import { DTOObjectUtil } from 'ls-core/util';

export interface IListDataRequestBuilder {
    setRootDTO(rootDTO: BaseDTO): void;
    addListRequestItem(
        currentDTO: any,
        dtoProperty: string,
        addEmptySelection: boolean,
        sortByValue: boolean,
        sortAsc: boolean
    ): void;
    getRequest(): ListsDataRequest;
}

/**
 *
 */
export class ListDataRequestBuilder implements IListDataRequestBuilder {
    protected listsDataRequest: ListsDataRequest;

    constructor() {
        this.listsDataRequest = new ListsDataRequest();
    }

    public setRootDTO(rootDTO: BaseDTO): void {
        this.listsDataRequest.rootDTODescriptor = this.getDescriptor(rootDTO);
    }

    private getDescriptor(dto: Object): DTOObjectDescriptor {
        return DTOObjectUtil.getDescriptor(dto);
    }

    public addListRequestItem(
        currentDTO: Object,
        dtoProperty: string,
        addEmptySelection: boolean = false,
        sortByValue: boolean = true,
        sortAsc: boolean = true
    ): void {
        if (!currentDTO) {
            throw new Error("currentDTO can't be null");
        }
        const listRequestItem = this.getRequestItem(currentDTO);
        const listProperty = new ListDataProperties();
        listProperty.propertyName = dtoProperty;
        listProperty.addEmptySelection = addEmptySelection;
        listProperty.sortByValue = sortByValue;
        listProperty.sortASC = sortAsc;
        listRequestItem.listProperties.push(listProperty);
    }

    public getRequest(): ListsDataRequest {
        return this.listsDataRequest;
    }

    private getRequestItem(currentObject: Object): ListDataRequest {
        let currentObjectIdentifier: Object;
        let requestItem: ListDataRequest;

        if (isIIdentifiable(currentObject)) {
            if (currentObject.identifier) {
                currentObjectIdentifier = currentObject.identifier.ObjectID;
            }
        }

        if (this.listsDataRequest.listDataRequests) {
            requestItem = this.listsDataRequest.listDataRequests.find(request => {
                const requestIdentifier = request.workingDTODescriptor ? request.workingDTODescriptor.ObjectID : null;
                return requestIdentifier && requestIdentifier == currentObjectIdentifier;
            });
        }

        if (requestItem == null) {
            requestItem = new ListDataRequest();
            requestItem.workingDTODescriptor = this.getDescriptor(currentObject);
            requestItem.listProperties = [];
            this.listsDataRequest.listDataRequests.push(requestItem);
        }

        return requestItem;
    }
}
