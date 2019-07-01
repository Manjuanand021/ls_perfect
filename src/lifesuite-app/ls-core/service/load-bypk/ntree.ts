export class NTree<T> {
    public data: T;

    public children: Array<NTree<T>>;

    public Parent: NTree<T>;

    constructor(data: T) {
        this.data = data;
        this.children = [];
    }

    public AddChild(data: T): NTree<T> {
        const child = new NTree<T>(data);
        child.Parent = this;
        this.children.push(child);
        return child;
    }

    public AddChildren(data: T[]): NTree<T>[] {
        return data.map(dataItem => {
            const child = new NTree<T>(dataItem);
            child.Parent = this;
            this.children.push(child);
            return child;
        });
    }
}
