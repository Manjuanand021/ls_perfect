import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FormSectionActiveService {

    public isActiveSubject: Subject<boolean>;

    constructor() {
        this.isActiveSubject = new Subject<boolean>()
    }

	public setActive(isActive: boolean): void {
        this.isActiveSubject.next(isActive);
	}
}
