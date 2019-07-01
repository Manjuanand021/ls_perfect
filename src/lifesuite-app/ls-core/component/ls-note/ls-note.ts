import { Component, Injectable, Input } from '@angular/core';

@Component({
    selector: 'ls-note',
    templateUrl: './ls-note.html',
    styleUrls: ['./ls-note.css']
})
export class LsNote {
    @Input() public noteTitle: string;
    @Input() public noteCreatedOn: string;
    @Input() public noteCreatedBy: string;
    @Input() public noteSubject: string;
    @Input() public note: string;
}
