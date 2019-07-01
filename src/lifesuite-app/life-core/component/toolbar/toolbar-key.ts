export class ToolBarKey {
    /**
     * Defined in RootTabTypeEnum: Home, Policy, etc.
     */
    public toolBarName: string;

    /**
     * Unique Id of the object associated with the toolBar; usually PolicyId
     */
    public objectId: string;

    constructor({ toolBarName, objectId }: { toolBarName: string; objectId: string }) {
        this.toolBarName = toolBarName;
        this.objectId = objectId;
    }
}
