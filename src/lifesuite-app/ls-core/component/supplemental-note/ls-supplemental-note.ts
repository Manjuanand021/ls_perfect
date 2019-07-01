import { Component, Injectable, Input } from '@angular/core';

@Component({
    selector: 'ls-supplemental-note',
    templateUrl: './ls-supplemental-note.html',
    styleUrls: ['./ls-supplemental-note.css']
})
@Injectable()
export class LsSupplementalNote {
    @Input() public noteTitle: string;
    @Input() public noteCreatedOn: string;
    @Input() public noteCreatedBy: string;
    @Input() public noteReferredTo: string;
    @Input() public note: string;
}
