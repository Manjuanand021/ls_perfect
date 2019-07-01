/**
 * Tab definition model
 */
export class TabDefinition {
    public readonly name: string;
    public readonly title?: string;
    public readonly leftIcon?: string;
    public readonly tabType: any; // enum TabType
    public readonly containerType: TabContainerType;
    public readonly tabObjectType?: any; // enum TabObjectType,
    public readonly menuId?: string;
    public readonly closable: boolean;
    public readonly validatable: boolean;
    public readonly maxNumberOfOpenTabs?: number;
}

export enum TabContainerType {
    Primary,
    Secondary,
    Tertiary
}
