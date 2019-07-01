export class DTOObjectDescriptor {
    public readonly $type: string = 'life.common.DTOObjectDescriptor, UICommon';
    public DTOClassNameNoNS: string;
    public ClassNameMapped: string;
    public DTOClassName: string;
    public ObjectID: Object;
    public DTOObjectMembers: any[];
}

export class ListDataProperties {
    public readonly $type: string = 'life.common.ListDataProperties, UICommon';

    public propertyName: string;

    public viewUUID: string;

    public addEmptySelection: boolean;

    public sortByValue: boolean;

    public sortASC: boolean;
}

export class DTOObjectMember {
    public readonly $type: string = 'life.common.DTOObjectMember, UICommon';
    public Name: string;
    public Value: any;

    constructor(name?: string, value?: any) {
        this.Name = name;
        this.Value = value;
    }
}
