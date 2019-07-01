import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { FundsListComponent } from './funds-list.component';
import { FundsListDialogDetailEditor } from './detail/funds-list-detail-editor';
import { FundsListDialogDataResolver } from './detail/funds-list-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [FundsListComponent, FundsListDialogDetailEditor],
    exports: [FundsListComponent, FundsListDialogDetailEditor],
    providers: [FundsListDialogDataResolver],
    entryComponents: [FundsListDialogDetailEditor]
})
export class FundsListModule {}
