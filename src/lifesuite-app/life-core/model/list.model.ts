export class ListItem<T = string> {
    public label: string;
    public value: T;

    constructor(label: string, value: T) {
        this.label = label;
        this.value = value;
    }

    public equalTo(target: ListItem<T>): boolean {
        return this.label === target.label && this.value === target.value;
    }
}

export type ListMap<T> = { [key: string]: Array<T> };
