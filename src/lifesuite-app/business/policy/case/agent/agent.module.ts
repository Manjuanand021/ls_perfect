import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AgentListComponent } from './agent-list.component';
import { AgentInfoComponent } from './agent-info.component';
import { AgentPersonComponent } from './type';
import { AgentDataResolver } from './type/agent-data.resolver';
import { AgentService } from './agent-service';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AgentInfoComponent, AgentListComponent, AgentPersonComponent],
    exports: [AgentInfoComponent, AgentListComponent],
    entryComponents: [AgentInfoComponent, AgentPersonComponent],
    providers: [AgentDataResolver, AgentService]
})
export class AgentModule {}
