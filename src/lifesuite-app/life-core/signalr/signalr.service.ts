import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

import { SignalRServiceRegistry } from './signalr.registry';
import { ILogger, Logger } from 'life-core/logging';

export interface ISignalRService {
    start(): Promise<void>;
    stop(): void;
    isConnected(): boolean;
}

export abstract class SignalRService implements ISignalRService {
    private _hubConnection: HubConnection;

    private _isConnected: boolean;

    protected logger: ILogger;

    constructor(signalRServiceRegistry: SignalRServiceRegistry, logger: Logger) {
        signalRServiceRegistry.register(this);
        this.logger = logger;
    }

    public start(): Promise<void> {
        if (!this._hubConnection) {
            this.createConnection();
        }
        return this._hubConnection
            .start()
            .then(() => {
                this._isConnected = true;
                this.onConnectionStarted();
                this.initSubscribers();
            })
            .catch(error => {
                this._isConnected = false;
                this.onConnectionFailedToStart(error);
            });
    }

    public stop(): void {
        this._hubConnection.stop();
        this._isConnected = false;
    }

    public isConnected(): boolean {
        return this._isConnected;
    }

    private createConnection(): void {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .configureLogging(LogLevel.Trace)
            .build();

        hubConnection.onclose((e?: Error) => {
            if (e) {
                this.logger.error('SignalR connection closed; error: ', e);
            }
        });
        this._hubConnection = hubConnection;
    }

    protected abstract get connectionUrl(): string;

    protected abstract initSubscribers(): void;

    protected onConnectionStarted(): void {
        this.logger.log('SignalR connection started! HubConnection: ', this._hubConnection);
    }

    protected onConnectionFailedToStart(error: any): void {
        this.logger.error('Error while establishing SignalR connection', error);
    }

    protected invoke(methodName: string, ...args: any[]): Promise<any> {
        return this._hubConnection.invoke(methodName, ...args).catch(error => {
            // TODO: Cange this back to output as error after all SignalR issues are resolved.
            this.logger.error(`Error invoking SignalR method: '${methodName}'`, error);
        });
    }

    protected subscribe(methodName: string, method: (...args: any[]) => void): void {
        this._hubConnection.on(methodName, method);
    }
}
