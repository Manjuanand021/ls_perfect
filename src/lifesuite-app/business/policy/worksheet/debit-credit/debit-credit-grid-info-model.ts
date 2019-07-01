export class GridInfo<T> {
    public Records: Array<T>;
    public Total: number;
    constructor() {
        this.Records = [];
        this.Total = 0;
    }
}
