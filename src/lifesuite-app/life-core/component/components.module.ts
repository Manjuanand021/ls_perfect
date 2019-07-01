import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SecureComponentDirective } from './authorization';
/* Components */
import { LfInputsModule, LF_INPUT_EXPORTS } from 'life-core/component/input/lf-inputs.module';
import { DataGridModule, DATA_GRID_EXPORTS } from 'life-core/component/grid/data-grid.module';
import { MenuModule, MENU_EXPORTS } from 'life-core/component/menu/menu.module';
import { MasterDetailModule, MASTERDETAIL_EXPORTS } from 'life-core/component/master-detail/master-detail.module';
import { RoutedTabViewModule, ROUTED_TABVIEW_EXPORTS } from 'life-core/component/layout/tabview';
import { LfDialogModule, LF_DIALOG_EXPORTS } from 'life-core/component/dialog/dialog.module';
import { BlockUIModule, BLOCKUI_EXPORTS } from 'life-core/component/blockui/blockui.module';
import { ToasterModule, TOASTER_EXPORTS } from 'life-core/component/toaster/toaster.module';
import { ScrollUpModule, SCROLLUP_EXPORTS } from 'life-core/component/scroll-up/scroll-up.module';
import { ComposeModule } from 'life-core/component/compose/compose.module';
import { Compose } from 'life-core/component/compose';
import { ItemListModule, ITEMLIST_EXPORTS } from 'life-core/component/item-list/item-list.module';
import { LfFormsModule, LF_FORMS_EXPORTS } from 'life-core/component/form/lf-forms.module';
import { LfDynamicFormModule, LF_DYNAMIC_FORM_EXPORTS } from 'life-core/component/dynamic-form/lf-dynamic-form.module';
import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { ToolbarModule, TOOLBAR_EXPORTS } from 'life-core/component/toolbar/toolbar.module';
import {
    OptionalSectionModule,
    OPTIONAL_SECTION_EXPORTS
} from 'life-core/component/optional-section/optional-section.module';
import { PipeModule, PIPE_EXPORTS } from 'life-core/util/pipe/pipe.module';
import {
    StickyElementModule,
    STICKY_ELEMENT_EXPORTS
} from 'life-core/component/layout/sticky-element/sticky-element.module';
import { LfPanelModule, LF_PANEL_EXPORTS } from 'life-core/component/layout/panel/lf-panel.module';
import { LfSplitModule, LF_SPLIT_EXPORTS } from 'life-core/component/layout/split/lf-split.module';
import {
    SettableContainerModule,
    SETTABLE_CONTAINER_EXPORTS
} from 'life-core/component/container/settable-container.module';

import { CanvasSignature } from 'life-core/component/signature';
import {
    DataGridStatusBarModule,
    DATA_GRID_STATUS_BAR_EXPORTS
} from 'life-core/component/grid/status-bar/data-grid-status-bar.module';
// import { SnackBar } from 'life-core/component/snackbar';

export const COMPONENTS_EXPORTS: Array<any> = [
    SecureComponentDirective,
    ...LF_INPUT_EXPORTS,
    ...LF_BUTTON_EXPORTS,
    ...TOOLBAR_EXPORTS,
    ...LF_DIALOG_EXPORTS,
    ...LF_FORMS_EXPORTS,
    ...LF_DYNAMIC_FORM_EXPORTS,
    ...DATA_GRID_EXPORTS,
    ...MENU_EXPORTS,
    ...BLOCKUI_EXPORTS,
    ...TOASTER_EXPORTS,
    ...SCROLLUP_EXPORTS,
    ...OPTIONAL_SECTION_EXPORTS,
    ...PIPE_EXPORTS,
    Compose,
    ...ITEMLIST_EXPORTS,
    ...MASTERDETAIL_EXPORTS,
    ...ROUTED_TABVIEW_EXPORTS,
    CanvasSignature,
    ...LF_PANEL_EXPORTS,
    ...STICKY_ELEMENT_EXPORTS,
    ...DATA_GRID_STATUS_BAR_EXPORTS,
    ...LF_SPLIT_EXPORTS,
    ...SETTABLE_CONTAINER_EXPORTS
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        LfFormsModule,
        LfDynamicFormModule,
        LfInputsModule,
        LfButtonModule,
        ToolbarModule,
        MenuModule,
        ItemListModule,
        MasterDetailModule,
        RoutedTabViewModule,
        DataGridModule,
        LfDialogModule,
        ComposeModule,
        BlockUIModule,
        ToasterModule,
        ScrollUpModule,
        OptionalSectionModule,
        PipeModule,
        // FormatterModule,
        StickyElementModule,
        DataGridStatusBarModule,
        LfSplitModule,
        LfPanelModule,
        SettableContainerModule
    ],
    declarations: [CanvasSignature, SecureComponentDirective],
    exports: [COMPONENTS_EXPORTS],
    entryComponents: [
        // Components loaded dynamically (not via Router)
    ]
})
export class ComponentsModule {}
