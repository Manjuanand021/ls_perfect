import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessagingService } from 'life-core/messaging/messaging.service';
import { ComponentsModule } from 'life-core/component/components.module';
import { TestMessaging, CompA, CompB } from './test-messaging';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [TestMessaging, CompA, CompB],
    providers: [MessagingService]
})
export class TestMessagingModule {}
