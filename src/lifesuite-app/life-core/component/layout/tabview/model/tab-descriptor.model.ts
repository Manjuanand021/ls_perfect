import { TabDefinition, TabContainerType } from './tab-definition.model';
import { CompositeTabId } from './composite-tab-id';
import { TabViewHostViewModel } from '../vm/tabview-host.vm';
import { AuthorizationLevel } from 'life-core/authorization';

export class TabDescriptor {
    /**
     *  Tab name
     */
    public tabName: string = null;

    /**
     *  Id of the object associated with the tab
     */
    public objectId: string = null;

    /**
     *  Tab type
     */
    public tabType: any = null;

    /**
     *  Tab root object type
     */
    public tabRootObject: any = null;

    /**
     *  Route of the component to show in the tab
     */
    public route: string = null;

    /**
     *  Route of the current content to show inside the tab
     */
    public contentRoute: string;

    /**
     *  Tab title
     */
    public title: string = null;

    /**
     *  Tab title resource Id
     */
    public titleId: string = null;

    /**
     *  Tab left-side icon css class
     */
    public leftIcon: string;

    /**
     *  Id of the menu associated with the tab
     */
    public menuId: string = null;

    /**
     *  defines whether tab is closable or not
     */
    public closable: boolean = false;

    /**
     *  defines whether tab needs to save before closed
     */
    public saveBeforeClose: boolean = true;

    /**
     *  indicates whether tab is disabled or not
     */
    public disabled: boolean = false;

    /**
     *  true for selected tab
     */
    public selected: boolean = false;

    /**
     *    State property bag for any state data
     *    tab content needs to keep between tab activations
     */
    public stateData: Map<string, any> = new Map<string, any>();

    /**
     *  Determines container type: PRIMARY / SECONDARY, etc
     */
    public containerType: TabContainerType;

    /**
     *  allows to get the title dynamically from server, when used
     */
    public isDynamicTitle: boolean = false;

    /**
     *  external close button handler
     */
    public externalCloseHandler: Function = null;
    /**
     *  reference to parent tab
     */
    public parentTab: TabViewHostViewModel;

    /**
     *  Authorization level
     */
    public authorizationLevel: AuthorizationLevel;

    /**
     *  Max Number of Same type of tabs allowed to be opened
     */
    public maxNumberOfOpenTabs?: number;

    /**
     *  indicates whether tab to be hidden or not
     */
    public hidden: boolean = false;

    constructor({
        tab,
        objectId,
        title,
        leftIcon,
        route,
        contentRoute,
        disabled,
        selected
    }: {
        tab: TabDefinition;
        objectId?: string;
        title?: string;
        leftIcon?: string;
        route?: string;
        contentRoute?: string;
        disabled?: boolean;
        selected?: boolean;
    }) {
        this.tabName = tab.name;
        this.tabType = tab.tabType;
        this.containerType = tab.containerType;
        this.objectId = objectId;
        this.title = title || tab.title;
        this.leftIcon = tab.leftIcon;
        this.route = route;
        this.contentRoute = contentRoute;
        this.menuId = tab.menuId;
        this.closable = tab.closable;
        this.disabled = disabled;
        this.selected = selected;
        this.maxNumberOfOpenTabs = tab.maxNumberOfOpenTabs;
    }

    public get compositeTabId(): CompositeTabId {
        return new CompositeTabId(this.tabName, this.objectId);
    }
}
