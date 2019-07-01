import { Subject } from 'rxjs';

export class ItemSelectedService {
    public isSelectedSubject: Subject<boolean>;

    constructor() {
        this.isSelectedSubject = new Subject<boolean>();
    }

    public setSelected(isSelected: boolean): void {
        this.isSelectedSubject.next(isSelected);
    }
}
