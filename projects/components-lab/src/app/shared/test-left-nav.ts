import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MenuItemClickEvent } from 'life-core/component/menu';
import { TestMenu, TestMenuItem } from './test-menu';

@Component({
    selector: 'test-left-nav',
    templateUrl: './test-left-nav.html'
})
export class TestLeftNav {
    protected router: Router;

    protected selectedRoute: string;

    public menu: MenuItem[];

    constructor(router: Router) {
        this.router = router;
        this.menu = this.setupMenuData(TestMenu.menuData);
    }

    private setupMenuData(menuData: TestMenuItem[]): MenuItem[] {
        return menuData.map(dataItem => {
            return new MenuItem({
                label: dataItem.name,
                routerLink: dataItem.route,
                items: dataItem.subItems ? this.setupMenuData(dataItem.subItems) : null,
                expanded: !dataItem.collapsed
            });
        });
    }

    protected onMenuItemClick(event: MenuItemClickEvent): void {
        this.navigate(event.data.route);
    }

    protected navigate(url: string): void {
        this.router.navigateByUrl(url);
    }
}
