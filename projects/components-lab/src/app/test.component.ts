import { Component } from '@angular/core';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'app',
    templateUrl: './test.component.html'
})
export class TestComponent {
    constructor(i18n: I18n) {
        const title = 'Components Lab';
        console.log(i18n({ value: 'Hello i18n for {{title}}!', id: 'id1' }, { title: title }));
    }
}
