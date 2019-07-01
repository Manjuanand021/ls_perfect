import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TabViewModule, TabView } from 'primeng/primeng';

import { RoutedTabView } from './routed-tabview';
import { LfTabPanel } from './tabpanel/lf-tabpanel';
import { LfTabViewNav } from './tabviewnav/lf-tabview-nav';

export const ROUTED_TABVIEW_EXPORTS: Array<any> = [
    RouterModule,
    // PrimeNG input components
    TabView,
    // Custom input components
    RoutedTabView,
    LfTabPanel,
    LfTabViewNav
];

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule, TabViewModule],
    declarations: [RoutedTabView, LfTabPanel, LfTabViewNav],
    exports: [...ROUTED_TABVIEW_EXPORTS]
})
export class RoutedTabViewModule {}
