import { Provider } from '@angular/core';

import { AuthenticationService } from './auth.service';
import { LDAPAuthenticationService } from './ldap-auth.service';

export const LS_AUTHENTICATION_SERVICE_PROVIDERS: Provider[] = [AuthenticationService, LDAPAuthenticationService];
