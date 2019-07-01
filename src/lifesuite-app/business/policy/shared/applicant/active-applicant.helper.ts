import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TabStateValueAccessor } from 'life-core/util';

/**
 * ActiveApplicantHelper provides access to ActiveApplicantId.
 * Registered globally to be acciessible from components AND resolvers.
 */
@Injectable()
export class ActiveApplicantHelper {
    private _applicantIdStateValueAccessor: TabStateValueAccessor<number>;

    private _activeApplicantIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    private _publishedActiveApplicantId: number;

    constructor() {}

    public setApplicantIdStateValueAccessor(applicantIdStateValueAccessor: TabStateValueAccessor<number>): void {
        this._applicantIdStateValueAccessor = applicantIdStateValueAccessor;
    }

    public setActiveApplicantId(applicantId: number): void {
        const currentActiveApplicantId = this._applicantIdStateValueAccessor.getValue();
        if (currentActiveApplicantId !== applicantId && applicantId !== All_Applicants_Id) {
            this._applicantIdStateValueAccessor.setValue(applicantId);
            this.publishActiveApplicantId(applicantId);
        }
    }

    private publishActiveApplicantId(applicantId: number): void {
        if (applicantId != this._publishedActiveApplicantId) {
            this._activeApplicantIdSubject.next(applicantId);
            this._publishedActiveApplicantId = applicantId;
        }
    }

    public get activeApplicantIdObservable(): Observable<number> {
        const activeApplicantId = this._applicantIdStateValueAccessor.getValue();
        this.publishActiveApplicantId(activeApplicantId);
        return this._activeApplicantIdSubject.asObservable();
    }
}

export const All_Applicants_Id = -1;
