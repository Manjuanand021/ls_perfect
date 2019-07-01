import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class NotesMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return [
            'note_type',
            'aus_users',
            'applicant_status',
            'Visibility',
            'System',
            'Notes_Subject_lines',
            'SortByOption'
        ];
    }
}
