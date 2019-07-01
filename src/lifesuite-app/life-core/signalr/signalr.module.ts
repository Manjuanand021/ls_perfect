import { NgModule } from '@angular/core';

import { SignalRServiceRegistry } from './signalr.registry';

@NgModule({
    imports: [],
    providers: [SignalRServiceRegistry]
})
export class SignalRModule {}
