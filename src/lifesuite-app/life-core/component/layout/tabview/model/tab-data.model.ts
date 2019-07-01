import { AuthorizationLevel } from 'life-core/authorization';

/**
 * Model of tab-related data for a tab in TabView
 */
export class TabData {
    /** Tab Id */
    public id: string;
    /** Tab Title */
    public title: string;
    /** Tab left icon css class */
    public leftIcon: string;
    /** Tab Route */
    public route: string;
    /** Defines if tab can be closed */
    public closable: boolean;
    /** Defines if tab is disabled */
    public disabled: boolean;
    /** Defines if tab is hidden */
    public hidden: boolean;
    /** Tab Access level */
    public authorizationLevel: AuthorizationLevel;
    /** Flags already loaded tabs */
    // public loaded: boolean;

    constructor({
        id,
        title,
        leftIcon,
        route,
        closable,
        disabled,
        hidden,
        authorizationLevel
    }: {
        id?: string;
        title?: string;
        leftIcon?: string;
        route?: string;
        closable?: boolean;
        disabled?: boolean;
        hidden?: boolean;
        authorizationLevel?: AuthorizationLevel;
    }) {
        this.id = id;
        this.title = title;
        this.leftIcon = leftIcon;
        this.route = route;
        this.closable = closable;
        this.disabled = disabled;
        this.hidden = hidden;
        this.authorizationLevel = authorizationLevel;
    }
}

export const TAB_INDEX_UNDEFINED = -1;
