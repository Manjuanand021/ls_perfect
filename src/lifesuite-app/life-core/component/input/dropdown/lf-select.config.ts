import { Injectable } from '@angular/core';

import { NgSelectConfig } from '@ng-select/ng-select';

import { SelectControlSearchMode } from './lf-select';

@Injectable({ providedIn: 'root' })
export class LfSelectConfig extends NgSelectConfig {
    public searchMode: SelectControlSearchMode = SelectControlSearchMode.matchFromStart;
}
