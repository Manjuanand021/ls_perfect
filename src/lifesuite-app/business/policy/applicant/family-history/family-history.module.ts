import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { FamilyHistoryComponent } from './family-history.component';
import { FamilyHistoryDialogDetailEditor } from './detail/family-history-detail-editor';
import { FamilyHistoryDialogDataResolver } from './detail/family-history-dialog-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [FamilyHistoryComponent, FamilyHistoryDialogDetailEditor],
    exports: [FamilyHistoryComponent, FamilyHistoryDialogDetailEditor],
    providers: [FamilyHistoryDialogDataResolver],
    entryComponents: [FamilyHistoryDialogDetailEditor]
})
export class FamilyHistoryModule {}
