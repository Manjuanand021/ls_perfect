import { Injectable } from '@angular/core';
import { KeepaliveSvc } from '@ng-idle/core';

import { PingService } from './ping.service';

@Injectable()
export class KeepAlive extends KeepaliveSvc {
    protected pingInterval: number;
    protected pingHandle: any;
    protected pingService: PingService;

    constructor(pingService: PingService) {
        super();
        this.pingService = pingService;
    }

    public ping(): void {
        this.pingService.ping();
    }

    /*
	 * Sets the interval (in seconds) at which the ping operation will occur when start() is called.
	 * @param seconds - The ping interval in seconds.
	 * @return The current interval value.
	 */
    public interval(seconds?: number): number {
        if (!isNaN(seconds) && seconds > 0) {
            this.pingInterval = seconds;
        } else if (!isNaN(seconds) && seconds <= 0) {
            throw new Error('Interval value must be greater than zero.');
        }

        return this.pingInterval;
    }

    /*
	 * Starts pinging on an interval.
	 */
    public start(): void {
        this.stop();

        this.pingHandle = setInterval(() => {
            this.ping();
        }, this.pingInterval * 1000);
    }

    /*
	 * Stops pinging on an interval.
	 */
    public stop(): void {
        if (this.hasPingHandle()) {
            clearInterval(this.pingHandle);
            this.pingHandle = null;
        }
    }

    private hasPingHandle(): boolean {
        return this.pingHandle !== null && typeof this.pingHandle !== 'undefined';
    }
}
