import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabSearchCaseComponent } from './tab/tab-search-case.component';
import { SearchCaseCriteriaDataResolver } from './criteria/search-case-criteria-data.resolver';
import { SearchCaseMetaDataResolver } from './search-case-metadata.resolver';

const SearchRoutes: Routes = [
    {
        path: '',
        component: TabSearchCaseComponent,
        resolve: { data: SearchCaseCriteriaDataResolver, metaData: SearchCaseMetaDataResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(SearchRoutes)],
    exports: [RouterModule]
})
export class SearchRoutingModule {}
