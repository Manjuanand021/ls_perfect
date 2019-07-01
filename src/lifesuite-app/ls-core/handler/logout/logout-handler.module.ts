import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LogoutRedirectHandler } from './logout-redirect.handler';
import { LogoutHandler } from './logout.handler';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [],
    providers: [LogoutRedirectHandler, LogoutHandler]
})
export class LogoutHandlerModule {}
