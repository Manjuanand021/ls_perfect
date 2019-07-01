import { Injector, Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Subscription } from 'rxjs';
import { KeepAlive } from './keep-alive';

@Injectable()
export class SessionTimeoutManager {
    protected sessionTimeout: number = DefaultSessionTimeoutMinutes;

    protected idle: Idle;

    protected keepAlive: KeepAlive;

    protected timeoutSubscription: Subscription;

    constructor(injector: Injector) {
        this.idle = injector.get(Idle);
        this.keepAlive = injector.get(KeepAlive);
    }

    public start(sessionTimeout?: number): void {
        if (sessionTimeout) {
            this.sessionTimeout = sessionTimeout || this.sessionTimeout;
        }
        this.setKeepAlive();
        this.startIdleTimeOut();
    }

    protected setKeepAlive(): void {
        const keepAliveInterval = this.getKeepAliveInterval();
        this.keepAlive.interval(keepAliveInterval);
    }

    protected getKeepAliveInterval(): number {
        return DefaultKeepAliveIntervalMinutes * (Seconds_In_Minute - 1);
    }

    protected startIdleTimeOut(): void {
        const idleTimeInterval: number = this.getIdleInterval();
        this.idle.setIdle(idleTimeInterval);
        const timeoutInterval: number = this.getTimeoutInterval();
        this.idle.setTimeout(timeoutInterval);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.setupTimeoutSubscription();
        this.idle.watch();
    }

    protected getIdleInterval(): number {
        // Interval between inactivity and idle state
        return Math.floor(this.sessionTimeout * (Seconds_In_Minute - 1));
    }

    protected getTimeoutInterval(): number {
        // set 10 seconds from being idle to timeout
        // interval from inactivity to timeout event is the sum of idle interval and timeout interval
        return 10;
    }

    private setupTimeoutSubscription(): void {
        const self = this;
        this.timeoutSubscription = this.idle.onTimeout.subscribe(() => {
            self.onTimeOut();
        });
    }

    protected onTimeOut(): void {
        // Session has timed out
        this.stop();
        this.handleSessionTimeout();
    }

    public stop(): void {
        this.idle.stop();
        this.timeoutSubscription.unsubscribe();
    }

    protected handleSessionTimeout(): void {
        // handle session timout here
    }

    protected onResumeSessionTimeOut(): void {
        this.setupTimeoutSubscription();
        this.idle.watch();
    }
}

export const DefaultSessionTimeoutMinutes = 20;
export const Seconds_In_Minute = 60;
export const DefaultKeepAliveIntervalMinutes = 5;
