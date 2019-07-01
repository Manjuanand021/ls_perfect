export interface ISubscriber {
    filter(payload: any): boolean;

    receive(payload: any): void;

    error(payload: any): void;

    complete(): void;
}

export abstract class BaseSubcriber implements ISubscriber {
    public filter(payload: any): boolean {
        return true;
    }

    public abstract receive(payload: any): void;

    public error(payload: any): void {}

    public complete(): void {}
}
