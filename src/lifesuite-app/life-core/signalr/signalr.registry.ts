import { Injectable } from '@angular/core';

import { ISignalRService } from './signalr.service';

@Injectable()
export class SignalRServiceRegistry {
    private _services: ISignalRService[] = [];

    constructor() {}

    public register(service: ISignalRService): void {
        this._services.push(service);
    }

    public unregister(service: ISignalRService): void {
        this._services.splice(this._services.indexOf(service));
    }

    public stopAll(): void {
        this._services.forEach(service => {
            if (service.isConnected()) {
                service.stop();
            }
        });
    }

    public reset(): void {
        this._services = [];
    }
}
