import { Injectable } from '@angular/core';

import { BaseDataServiceStatus } from 'life-core/service';
import { DataService } from './data.service';
import { UIResponse } from './data-service.model';

@Injectable({ providedIn: 'root' })
export class DataServiceStatus extends BaseDataServiceStatus<UIResponse> {
    constructor(dataService: DataService) {
        super(dataService);
    }
}
