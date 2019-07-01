export abstract class ToolBarElement {
    public name: string;
}

abstract class BaseToolBarData extends ToolBarElement {
    public action: string;
    public enabled: boolean;
    public visible: boolean;
    public securityID: string;
}

export class ToolBarData extends BaseToolBarData {
    public tooltip: string;
}

export class ToolBarButtonData extends ToolBarData {}

export class ToolBarSeparator extends ToolBarElement {}

export class ToolBarLinkData extends BaseToolBarData {
    public label: string;
    public labelValue: string;
}

export class ToolBarDropdownData extends ToolBarData {
    public links: ToolBarElement[];
}
