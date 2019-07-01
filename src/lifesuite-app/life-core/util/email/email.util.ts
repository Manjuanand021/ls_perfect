import { Injectable } from '@angular/core';

@Injectable()
export class EmailUtil {
    public sendEmail(receiver: string, subject: string, body: string): void {
        window.open(`mailto:${receiver}&subject=${subject}&body=${body}`, '_self');
    }
}
