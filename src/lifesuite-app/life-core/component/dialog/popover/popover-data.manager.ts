import { OnDestroy } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

export class PopoverDataManager<T> implements OnDestroy {
    private _popoverDataSubject: BehaviorSubject<T>;

    constructor() {
        this._popoverDataSubject = <BehaviorSubject<T>>new BehaviorSubject(null);
    }

    public popoverDataAsObservable(): Observable<T> {
        return this._popoverDataSubject.asObservable();
    }

    public updatePopoverData(data: T): void {
        this._popoverDataSubject.next(data);
    }

    public ngOnDestroy(): void {
        this._popoverDataSubject.complete();
    }
}
