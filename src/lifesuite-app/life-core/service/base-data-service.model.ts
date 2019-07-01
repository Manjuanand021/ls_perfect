export class LifeError {
    public errorType: number;
    public severityLevel: number;
    public errorCode: string[];
    public errorMessage: string;
    public date: Date;
}

export class BaseDataServiceParams {
    public nonBlocking: boolean;

    constructor({ nonBlocking = false }: { nonBlocking: boolean }) {
        this.nonBlocking = nonBlocking;
    }
}
