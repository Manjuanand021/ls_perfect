import { DTOObjectDescriptor } from 'ls-core/service';

export class ListsDataRequest {
    public readonly $type: string = 'life.common.ListsDataRequest, UICommon';
    public rootDTODescriptor: DTOObjectDescriptor;
    public listDataRequests: ListDataRequest[];

    constructor() {
        this.listDataRequests = [];
    }
}

export class ListDataRequest {
    public readonly $type: string = 'life.common.ListDataRequest, UICommon';
    public workingDTODescriptor: DTOObjectDescriptor;
    public listProperties: any[];

    constructor() {
        this.listProperties = [];
    }
}

export class ListDataItem {
    public Id: string;
    public value: string;
    public externalCode: string;

    constructor(Id: string, value: string, externalCode?: string) {
        this.Id = Id;
        this.value = value;
        this.externalCode = externalCode;
    }
}

export class ListDataItems {
    public list: Array<ListDataItem>;
    public codeType: string;
    public propertyName: string;
    public viewUUID: string;
}

export class ListDataResponse {
    public listItems: Array<ListDataItems>;
}

export class ListDataResponses {
    public responseList: Array<ListDataResponse>;
}

export const ListFields = {
    ID: 'Id',
    VALUE: 'value',
    EXTERNAL_CODE: 'externalCode'
};
