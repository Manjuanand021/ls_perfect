import { Component, Input, Injectable, Output, EventEmitter, Injector } from '@angular/core';
import { ViewModel } from 'life-core/view-model';

@Component({
    selector: 'ls-policy-alert',
    templateUrl: './ls-policy-alert.html',
    styleUrls: ['./ls-policy-alert.css']
})
@Injectable()
export class LsPolicyAlert extends ViewModel {
    @Input() public policyCount: number;
    @Input() public description: string;
    @Input() public iconTitle: string;
    @Input() public iconCssClass: string;

    @Output() public click: EventEmitter<any> = new EventEmitter();

    constructor(injector: Injector) {
        super(injector);
    }

    public onAlertClick(event: Event): void {
        this.click.emit(event);
    }
}
