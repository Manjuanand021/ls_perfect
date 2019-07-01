import { Injectable, Type } from '@angular/core';

import { IAuthorizationFinder, AuthorizationService, AuthorizationLevel } from 'life-core/authorization';
import { PolicyAuthorizationFinder } from './policy-authorization-finder';

import { AppSession } from 'ls-core/session/app-session';

const ObjectAuthorizationFinder: { readonly [key: string]: Type<IAuthorizationFinder> } = {
    policy: PolicyAuthorizationFinder
};

@Injectable()
export class LsAuthorizationService extends AuthorizationService {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    public getGeneralAuthorizationLevel(subsystem: string, privilegesToCheck: Array<string>): number {
        if (privilegesToCheck.length == 0) {
            return AuthorizationLevel.NONE;
        }
        let authorizationLevel: number = AuthorizationLevel.EDIT;
        privilegesToCheck.forEach(nextPrivilegeToCheck => {
            const nextAuthorizationLevel = this.getGeneralAuthorizationLevelForPrivilege(
                subsystem,
                nextPrivilegeToCheck
            );
            if (authorizationLevel > nextAuthorizationLevel) {
                authorizationLevel = nextAuthorizationLevel;
            }
        });
        return authorizationLevel;
    }

    private getGeneralAuthorizationLevelForPrivilege(subsystem: string, privilegeToCheck: string): number {
        if (!this._appSession.user) {
            return AuthorizationLevel.NONE;
        }
        const privileges = this._appSession.user.Privileges;
        privileges.forEach(privilege => {
            if (privilege.SubsystemName == subsystem && privilege.Name == privilegeToCheck) {
                return AuthorizationLevel.EDIT; // true
            }
        });
        return AuthorizationLevel.NONE;
    }

    public getObjectAuthorizationLevel(
        subsystem: string,
        objectType: string,
        object: Object,
        privilegesToCheck: Array<string>
    ): number {
        if (privilegesToCheck.length == 0) {
            return AuthorizationLevel.NONE;
        }
        let authorizationLevel: number = AuthorizationLevel.EDIT;
        privilegesToCheck.forEach(nextPrivilegeToCheck => {
            const nextAuthorizationLevel = this.getObjectAuthorizationLevelForPrivilege(
                subsystem,
                objectType,
                object,
                nextPrivilegeToCheck
            );
            if (authorizationLevel > nextAuthorizationLevel) {
                authorizationLevel = nextAuthorizationLevel;
            }
        });
        return authorizationLevel;
    }

    public getObjectAuthorizationLevelForPrivilege(
        subsystem: string,
        objectType: string,
        object: Object,
        privilegeToCheck: string
    ): number {
        const objectPrivilegeFinder = new ObjectAuthorizationFinder[objectType](this._appSession.user);
        return objectPrivilegeFinder.getObjectAuthorizationLevel(subsystem, object, privilegeToCheck);
    }
}
