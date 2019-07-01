import { AuthorizationLevel } from 'life-core/authorization';
import { MenuItem } from 'life-core/component/menu';
import { PopoverDialogParams } from 'life-core/component';

export class ToolbarButton {
    public id: string;

    public type: ToolbarButtonType;

    public label: string;

    public icon: string;

    public disabled: boolean;

    public visible: boolean = true;

    public authorizationLevel?: AuthorizationLevel;

    public style: string;

    public styleClass: string;

    public model: MenuItem[];

    public badge?: string;

    public onClick: Function;

    public title: string;

    public popoverParams: PopoverDialogParams;

    constructor({
        id,
        type,
        label,
        icon,
        disabled,
        visible,
        authorizationLevel,
        style,
        styleClass,
        model,
        badge,
        onClick,
        title,
        popoverParams
    }: {
        id?: string;
        type: ToolbarButtonType;
        label?: string;
        icon?: string;
        disabled?: boolean;
        visible?: boolean;
        authorizationLevel?: AuthorizationLevel;
        style?: string;
        styleClass?: string;
        model?: MenuItem[];
        badge?: string;
        onClick?: Function;
        title?: string;
        popoverParams?: PopoverDialogParams;
    }) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.icon = icon;
        this.disabled = disabled;
        this.visible = visible === undefined ? true : visible;
        this.authorizationLevel = authorizationLevel;
        this.style = style;
        this.styleClass = styleClass;
        this.model = model;
        this.badge = badge;
        this.onClick = onClick;
        this.title = title;
        this.popoverParams = popoverParams;
    }
}

export type ToolbarButtonType = 'button' | 'split_button';
