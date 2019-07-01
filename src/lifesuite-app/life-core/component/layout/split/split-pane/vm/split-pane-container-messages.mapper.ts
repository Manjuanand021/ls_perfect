import { Injectable } from '@angular/core';

@Injectable()
export class SplitPaneContainerMessagesMapper {
    public getMessage(areaId: string): string {
        // override in specific project
        return '';
    }
}
