import { AuthorizationLevel } from './authorization-level';

export abstract class AuthorizationService {
    /**
     * Get combined authorization level for array of general privileges
     * @param subsystem - value of SubsystemType
     * @param privilegesToCheck - array of privilege names
     * @return combined authorization level value (of authorizationLevel type)
     *
     */
    public abstract getGeneralAuthorizationLevel(
        subsystem: string,
        privilegesToCheck: Array<string>
    ): AuthorizationLevel;

    /**
     * Get combined authorization level for array of policy privileges
     *
     * @param subsystem - value of SubsystemType
     * @param objectType - policy object type for checking restriction level
     * @param object - policy object for checking restriction level
     * @param privilegesToCheck - array of privilege names
     * @return combined authorization level value (of authorizationLevel type)
     *
     */
    public abstract getObjectAuthorizationLevel(
        subsystem: string,
        objectType: string,
        object: Object,
        privilegesToCheck: Array<string>
    ): AuthorizationLevel;
}

export interface IAuthorizationFinder {
    /**
     * Get authorization level for an object, such as policy
     *
     * @param subsystem - value of SubsystemType
     * @param object - object for checking restriction level
     * @param privilegeToCheck - privilege name
     * @return authorization level value (of authorizationLevel type)
     *
     */
    getObjectAuthorizationLevel(subsystem: string, object: Object, privilegeToCheck: string): AuthorizationLevel;
}
