export class SaveDataContext {
    /**
     * Indicates that the 'Save' service call was triggered
     * because of navigating away from a view associated with root object,
     * such as when changing main tab.
     * This is used in BaseSaveDataDelegate class to decide whether
     * to rebind the root object (e.g. Policy) after saving it.
     */
    public isNavigatingAway: boolean;

    constructor(isNavigatingAway: boolean = false) {
        this.isNavigatingAway = isNavigatingAway;
    }
}
