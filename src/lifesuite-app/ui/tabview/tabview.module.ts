import { NgModule } from '@angular/core';

import { TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { LsTabDescriptorFactory } from './ls-tab-descriptor.factory';
import { TabDefinitionTitles } from './tab-definition-titles';

@NgModule({
    declarations: [],
    providers: [{ provide: TabDescriptorFactory, useClass: LsTabDescriptorFactory }, TabDefinitionTitles]
})
export class TabViewModule {}
