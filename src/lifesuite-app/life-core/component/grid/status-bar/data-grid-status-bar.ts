import { Component, Input, Injectable } from '@angular/core';

@Component({
    selector: 'data-grid-status-bar',
    templateUrl: './data-grid-status-bar.html'
})
@Injectable()
export class DataGridStatusBar {
    @Input() public rowCount: number;
}
