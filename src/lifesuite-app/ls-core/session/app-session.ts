import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Session } from 'life-core/session/session';
import { UserDTO, PolicyDTO } from 'ls-core/model/dto';

/**
 * Defines session data for LifeSuite app
 * for tracking client side session variables.
 */
@Injectable()
export class AppSession extends Session {
    private _user: UserDTO;

    private _policyId: number;

    private _policySubject: BehaviorSubject<PolicyDTO> = new BehaviorSubject<PolicyDTO>(null);

    constructor() {
        super();
    }

    /**
     * Get user.
     */
    public get user(): UserDTO {
        return this._user;
    }

    /**
     * Set user.
     */
    public set user(value: UserDTO) {
        this._user = value;
    }

    /**
     * Reset user.
     */
    public resetUser(): void {
        this._user = undefined;
    }

    /**
     * Reset app session.
     */
    public reset(): void {
        super.reset();
        this.resetPolicy();
        this.resetUser();
    }

    /**
     * Get policy id.
     */
    public get policyId(): number {
        const policy = this.policyDTO;
        if (policy) return <number>policy.PolicyId;
        return this._policyId;
    }

    /**
     * Set policy id.
     */
    public set policyId(policyId: number) {
        if (this._policyId != policyId) {
            this._policyId = policyId;
            this.updatePolicy(undefined);
        }
    }

    /**
     * Reset policy.
     */
    public resetPolicy(): void {
        this._policyId = undefined;
        this.updatePolicy(undefined);
    }

    /**
     * Returns true if policy selected.
     */
    public policySelected(): boolean {
        return this.policyId != undefined;
    }

    public updatePolicy(policy: PolicyDTO): void {
        this._policySubject.next(policy);
    }

    public get policyObservable(): Observable<PolicyDTO> {
        return this._policySubject.asObservable();
    }

    public get policyDTO(): PolicyDTO {
        let policy: PolicyDTO;
        const subscription = this._policySubject.subscribe(n => {
            policy = n;
        });
        subscription.unsubscribe();
        return policy;
    }

    public isPolicyLoaded(): boolean {
        return this.policyDTO != undefined;
    }
}
