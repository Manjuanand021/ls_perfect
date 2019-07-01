export class Identifiable {
    public readonly $type: string = 'life.ls.ui.ria.dto.Identifiable, LifeSuite.UIServiceDTO';

    public ClassNameMapped: string;

    public ParentPropertyNameRelated: string;

    public ObjectID: Object;

    public ObjectSignature: string;

    public ChildIdentifier: Identifiable;

    public ParentIdentifier: Identifiable;
}

export interface IIdentifiable {
    identifier: Identifiable;
}

export function isIIdentifiable(arg: any): arg is IIdentifiable {
    return arg.identifier !== undefined;
}
