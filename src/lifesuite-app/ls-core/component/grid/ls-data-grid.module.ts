import { NgModule } from '@angular/core';

import { DataGridModule, DATA_GRID_EXPORTS, GRID_FILTER_BUILDER_REGISTRY } from 'life-core/component/grid';
import { LsGridFilterBuilderRegistry } from './filter';
import { LsCellComparators } from './comparator/ls-cell-comparators';
import { LsCellFormatters } from './formatter/ls-cell-formatters';

@NgModule({
    imports: [DataGridModule],
    exports: [...DATA_GRID_EXPORTS],
    providers: [{ provide: GRID_FILTER_BUILDER_REGISTRY, useValue: LsGridFilterBuilderRegistry }]
})
export class LsDataGridModule {}
