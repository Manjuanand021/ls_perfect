import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartupPolicyContextResolver } from 'ls-core/startup';
import { NotesDataResolver } from '../notes-data.resolver';
import { ViewNotesComponent } from './view-notes.component';
import { NotesMetaDataResolver } from '../notes-meta-data.resolver';

const ViewNotesRoutes: Routes = [
    {
        path: '',
        resolve: { context: StartupPolicyContextResolver },
        children: [
            {
                // Setup NotesDataResolver in the child route because
                // it depends on some data preloaded in the parent route.
                path: '',
                component: ViewNotesComponent,
                resolve: {
                    data: NotesDataResolver,
                    metaData: NotesMetaDataResolver
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ViewNotesRoutes)],
    exports: [RouterModule]
})
export class ViewNotesRoutingModule {}
