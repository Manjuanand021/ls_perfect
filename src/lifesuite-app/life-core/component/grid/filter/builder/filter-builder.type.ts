import { Type } from '@angular/core';

import { GridFilter } from 'life-core/component/grid';
import { IServerFilter } from 'life-core/service';

export interface IFilterBuilder {
    build(fields: string[], gridFilter: GridFilter): IServerFilter;
}

export type GridFilterBuilderRegistryType = { readonly [type: string]: Type<IFilterBuilder> };
