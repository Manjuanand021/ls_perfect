import { Injectable } from '@angular/core';

import { IGetDataDelegate } from 'life-core/service';
import { MenuItem, MenuItemClickEvent } from 'life-core/component/menu';
import { LangUtil } from 'life-core/util/lang/lang.util';
import { ObfuscateIdUtil } from 'life-core/util';

import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

import { MenuHandlerFactory, MenuUrlHandlerId } from './handler';

@Injectable()
export class LeftMenuDataDelegate implements IGetDataDelegate<LeftNavigationMenuRequest> {
    private _dataService: DataService;
    private _objectId: string;
    private _menuHandlerFactory: MenuHandlerFactory;

    constructor(dataService: DataService, menuHandlerFactory: MenuHandlerFactory) {
        this._dataService = dataService;
        this._menuHandlerFactory = menuHandlerFactory;
    }

    public getData(request: LeftNavigationMenuRequest): Promise<MenuItem[]> {
        this._objectId = request.objectID;
        const serviceParams: DataServiceParams = this.getServiceParams(request);
        return this._dataService.getData(serviceParams).then(response => {
            const payload = response.responsePayload ? (response.responsePayload as Array<BaseMenuData[]>) : [];
            return this.convertToUIMenuData(payload);
        });
    }

    protected getServiceParams(request: LeftNavigationMenuRequest): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.LEFT_NAV_MENU,
            serviceMethod: UIServiceMethods.LOAD_DATA,
            requestPayload: request
        });
    }

    private convertToUIMenuData(menuData: Array<BaseMenuData[]>): MenuItem[] {
        return menuData.map(dataItem => {
            let menuNodeData: BaseMenuData;
            let menuItemsData: BaseMenuData[] = [];
            if (LangUtil.isArray(dataItem) && dataItem.length > 0) {
                // 1-st item is a sub-menu node
                menuNodeData = dataItem[0];
                if (dataItem.length > 1) {
                    // 2+ items are sub-menu items
                    menuItemsData = dataItem.slice(1, dataItem.length);
                }
            } else {
                // Fallback
                menuNodeData = <any>dataItem;
            }
            return this.createUIMenuDataItem(menuNodeData, menuItemsData);
        });
    }

    private createUIMenuDataItem(menuData: BaseMenuData, subItemsData?: BaseMenuData[]): MenuItem {
        const subItems = subItemsData
            ? subItemsData.map(subItemData => {
                  return this.createUIMenuDataItem(subItemData);
              })
            : null;
        const hasNestedMenuItems = subItems != null;
        const menuItem: MenuItem = new MenuItem({
            id: menuData.id,
            label: menuData.label,
            icon: this.getIconCssClass(menuData.icon),
            expanded: !menuData.isCollapsed,
            items: subItems,
            url: menuData['url']
            // target: menuData.target;
            // disabled: menuData.disabled;
            // visible: menuData.visible;
        });
        if (this.routeExists(menuItem, menuData, hasNestedMenuItems)) {
            menuItem.route = this.getRoute(menuData as PolicyMenuData);
            menuItem.url = this.getRouterLink(menuItem.route);
            menuItem.disabled = !this.isRouteImplemented(menuData);
        } else if (this.commandExists(menuData, hasNestedMenuItems)) {
            if (this.isCommandImplemented(menuData as LinkMenuData)) {
                menuItem.command = this.getCommand(menuData as LinkMenuData);
            } else {
                menuItem.disabled = true;
            }
        } else if (menuItem.url || menuItem.target) {
            // Do nothing
        } else {
            if (!hasNestedMenuItems) {
                menuItem.disabled = true;
            }
        }
        return menuItem;
    }

    private routeExists(menuItem: MenuItem, menuData: BaseMenuData, hasNestedMenuItems: boolean): boolean {
        return !menuItem.url && this.hasRoute(menuData) && !hasNestedMenuItems;
    }

    private commandExists(menuData: BaseMenuData, hasNestedMenuItems: boolean): boolean {
        return this.hasCommand(menuData) && !hasNestedMenuItems;
    }

    private hasRoute(menuData: BaseMenuData): boolean {
        return LangUtil.has(menuData, PolicyPageNameProp);
    }

    private isRouteImplemented(menuData: BaseMenuData): boolean {
        const implemented = [
            'Worksheet',
            'WorksheetF',
            'Case',
            'CaseF',
            'Case Notes',
            'Case NotesF',
            'UW Notes',
            'UW NotesF',
            'Requirements',
            'RequirementsF',
            'Evidence',
            'EvidenceF',
            'Applicant',
            'ApplicantF',
            'Related Cases',
            'Related CasesF',
            'Documents',
            'DocumentsF',
            'Images',
            'ImagesF'
        ];
        return implemented.find(item => item == menuData.label) !== undefined;
    }

    private getRoute(menuData: PolicyMenuData): string {
        const pageName = menuData[PolicyPageNameProp];
        const nameParts = pageName.split('.');
        return nameParts.length > 0 ? nameParts[nameParts.length - 1] : pageName;
    }

    private getRouterLink(route: string): string {
        return `./policy/${ObfuscateIdUtil.obfuscate(this._objectId)}/${route}`;
    }

    private hasCommand(menuData: BaseMenuData): boolean {
        return LangUtil.has(menuData, LinkTypeProp);
    }

    private isCommandImplemented(menuData: LinkMenuData): boolean {
        const implemented = [
            'Search Case',
            'Search CaseF',
            'Reassign Case',
            'Reassign CaseF',
            'Maintain Tables and Codes',
            'Maintain Tables and CodesF',
            'Application Data Entry',
            'Application Data EntryF',
            'Administration Reports',
            'Administration ReportsF',
            'Audit Desktop',
            'Audit DesktopF',
            'Manage Users',
            'Manage UsersF',
            'Manage Teams',
            'Manage TeamsF',
            'Manage Roles',
            'Manage RolesF',
            'Maintain Rules',
            'Maintain RulesF',
            'Error Administration',
            'Error AdministrationF',
            'View Audit',
            'View AuditF',
            'Setup Audit',
            'Setup AuditF',
            'User Reports',
            'User ReportsF'
        ];
        return (
            (menuData.linkType == LinkType.PAGE || menuData.linkType == LinkType.URL) &&
            implemented.find(item => item == menuData.label) !== undefined
        );
    }

    private getCommand(menuData: LinkMenuData): (event: MenuItemClickEvent) => void {
        const command = (event: MenuItemClickEvent): void => {
            let menuHandlerId: string;
            if (menuData.linkType == LinkType.PAGE) {
                menuHandlerId = menuData.linkURL;
            } else if (menuData.linkType == LinkType.URL) {
                menuHandlerId = MenuUrlHandlerId;
            }
            const menuHandler = this._menuHandlerFactory.createMenuHandler(menuHandlerId);
            menuHandler.execute(menuData);
        };
        return command;
    }

    private getIconCssClass(iconPath: string): string {
        let iconClass = '';
        if (iconPath) {
            const parts = iconPath.split('/');
            iconClass = parts[parts.length - 1];
            iconClass = iconClass.replace('LS_', '').replace('.png', '');
        }
        return `lf-leftnav-menuitemicon ${iconClass}`;
    }
}

export class BaseMenuRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.BaseMenuRequest, LifeSuite.UIServiceDTO';

    public menuType: string;

    public objectID?: string;

    constructor(menuType: string, objectID?: string) {
        this.menuType = menuType;
        this.objectID = objectID;
    }
}

export class LeftNavigationMenuRequest extends BaseMenuRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.LeftNavigationMenuRequest, LifeSuite.UIServiceDTO';
}

export class BaseMenuData {
    public id: string;
    public label: string;
    public icon: string;
    public name: string;
    public isCollapsed: boolean;
    public collapsible: boolean;
    public menuSecurityID: string;
}

export class LinkMenuData extends BaseMenuData {
    public linkName: string;
    public linkType: string;
    public linkURL: string;
    public linkParam: string;
}

export class PolicyMenuData extends BaseMenuData {
    public policyID: string;
    public policyPageName: string;
    public url: string;
}

const PolicyPageNameProp = 'policyPageName';
const LinkTypeProp = 'linkType';

export const LinkType = {
    PAGE: 'page',
    URL: 'url'
};
