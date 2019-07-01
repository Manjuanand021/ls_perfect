import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';

import { PanelMenuSub } from './panel-menu/panel-menu-sub';
import { PanelMenu } from './panel-menu/panel-menu';
import { HrefLinkActiveDirective } from './panel-menu/href-link-active.directive';

export const MENU_EXPORTS: Array<any> = [PanelMenu, HrefLinkActiveDirective];

@NgModule({
    imports: [CommonModule, RouterModule, PanelMenuModule],
    declarations: [PanelMenuSub, PanelMenu, HrefLinkActiveDirective],
    exports: [...MENU_EXPORTS]
})
export class MenuModule {}
