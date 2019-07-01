import { Component } from '@angular/core';

import { ToasterMessage, ToasterSeverity } from 'life-core/component/toaster';

@Component({
    selector: 'test-toaster',
    templateUrl: './test-toaster.html'
})
export class TestToaster {
    msgs: ToasterMessage[] = [];

    // Toaster message

    showSuccess() {
        this.msgs = [];
        this.msgs.push({ severity: ToasterSeverity.SUCCESS, summary: 'Success Message', detail: 'Order submitted' });
    }

    showInfo() {
        this.msgs = [];
        this.msgs.push({ severity: ToasterSeverity.INFO, summary: 'Info Message', detail: 'PrimeNG rocks' });
    }

    showWarn() {
        this.msgs = [];
        this.msgs.push({
            severity: ToasterSeverity.WARNING,
            summary: 'Warn Message',
            detail: 'There are unsaved changes'
        });
    }

    showError() {
        this.msgs = [];
        this.msgs.push({ severity: ToasterSeverity.ERROR, summary: 'Error Message', detail: 'Validation failed' });
    }

    clearToaster() {
        this.msgs = [];
    }
}
