import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ReviewMessagesComponent } from './review-messages.component';
import { ReviewMessagesDataResolver } from './review-messages-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ReviewMessagesComponent],
    providers: [ReviewMessagesDataResolver]
})
export class ReviewMessagesModule {}
