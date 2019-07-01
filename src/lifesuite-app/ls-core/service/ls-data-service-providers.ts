import { Provider } from '@angular/core';

import { DataService } from './data.service';
import { ListDataService } from './list-data/list-data.service';
import { DefaultDataService } from './default-data/default-data.service';
import { MetadataService } from './metadata/metadata.service';
import { ListDataUpdater } from './list-data-updater/list-data.updater';
import { LazyLoadService } from './lazy-load/lazy-load.service';
import { LoadByPKService } from './load-bypk/load-bypk.service';
import { LazyDataLoader, MetadataLoader } from 'ls-core/util';

export const LS_DATA_SERVICE_PROVIDERS: Provider[] = [
    DataService,
    LazyDataLoader,
    LazyLoadService,
    DefaultDataService,
    ListDataService,
    ListDataUpdater,
    LoadByPKService,
    MetadataLoader,
    MetadataService
];
