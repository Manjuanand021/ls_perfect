export class GridRowDetailModel {
    public fields: Array<GridRowDetailFieldModel>;

    constructor() {
        this.fields = [];
    }
}

export class GridRowDetailFieldModel {
    public fieldHeader: string;
    public fieldValue: string;
}
