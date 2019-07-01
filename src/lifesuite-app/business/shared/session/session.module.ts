import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Idle, KeepaliveSvc, IdleExpiry, SimpleExpiry } from '@ng-idle/core';

import { ComponentsModule } from 'life-core/component/components.module';
import { SessionTimeoutManager, KeepAlive, PingService } from 'life-core/session';
import { LsPingService } from 'ls-core/session';
import { ApplicationSessionTimeoutManager, SessionTimeOut } from 'business/shared/session';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [SessionTimeOut],
    providers: [
        { provide: SessionTimeoutManager, useClass: ApplicationSessionTimeoutManager },
        { provide: PingService, useClass: LsPingService },
        KeepAlive,
        { provide: KeepaliveSvc, useExisting: KeepAlive },
        Idle,
        SimpleExpiry,
        { provide: IdleExpiry, useExisting: SimpleExpiry }
    ],
    entryComponents: [SessionTimeOut]
})
export class SessionModule {}
