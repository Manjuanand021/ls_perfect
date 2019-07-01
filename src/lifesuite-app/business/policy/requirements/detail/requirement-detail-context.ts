import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { RequirementDTO } from 'ls-core/model';

@Injectable()
export class RequirementDetailContext {
    private _contextSubject: BehaviorSubject<RequirementDetailContextModel> = new BehaviorSubject<
        RequirementDetailContextModel
    >(null);

    public updateContext(context: RequirementDetailContextModel): void {
        this._contextSubject.next(context);
    }

    public get contextObservable(): Observable<RequirementDetailContextModel> {
        return this._contextSubject.asObservable();
    }
}

export class RequirementDetailContextModel {
    public requirement: RequirementDTO;

    constructor(requirement: RequirementDTO) {
        this.requirement = requirement;
    }
}
