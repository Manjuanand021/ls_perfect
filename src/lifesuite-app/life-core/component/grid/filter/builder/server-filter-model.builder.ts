import { Inject, Injectable } from '@angular/core';

import { IServerFilter } from 'life-core/service';
import { IFilterBuilder, GridFilterBuilderRegistryType } from './filter-builder.type';
import { GridFilter } from '../model/grid-filter.model';
import { GRID_FILTER_BUILDER_REGISTRY } from './grid-filter-builder.registry';

@Injectable()
export class ServerFilterModelBuilder implements IFilterBuilder {
    protected gridFilterBuilderRegistry: GridFilterBuilderRegistryType;

    constructor(@Inject(GRID_FILTER_BUILDER_REGISTRY) gridFilterBuilderRegistry: GridFilterBuilderRegistryType) {
        this.gridFilterBuilderRegistry = gridFilterBuilderRegistry;
    }

    public build(fields: string[], gridFilter: GridFilter): IServerFilter {
        const filterBuilderType = this.gridFilterBuilderRegistry[gridFilter.filterType];
        if (!filterBuilderType) {
            return null;
        }
        const filterBuilder: IFilterBuilder = new filterBuilderType();
        return filterBuilder.build(fields, gridFilter);
    }
}
