export abstract class ClientErrorLogger {
    constructor() {}

    public abstract logError(error: Error): void;
}
