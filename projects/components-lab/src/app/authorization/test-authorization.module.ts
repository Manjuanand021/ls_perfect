import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { DYNAMIC_FIELDS_REGISTRY } from 'life-core/component/dynamic-form';
import { LsDynamicFieldsRegistry } from 'ls-core/component/dynamic-form';
import { ValidationMessageService } from 'life-core/view-model';

import { ListDataService, MetadataService } from 'ls-core/service';
import { ResourceManager } from 'ls-core/resource/resource-manager';
import { MetadataLoader } from 'ls-core/util';
import { DynamicFormDataResolver } from 'lab/component/dynamic-form/dynamic-form-data.resolver';

import { TestAuthorization } from './test-authorization';
import { TestAuthorizationData } from './test-authorization-data';
import { TestAuthorizationInputs } from './test-authorization-inputs';
import { TestAuthorizationDynamicForm } from './test-authorization-dynamic-form';

import {
    TestAuthorizationParent,
    TestAuthorizationChild,
    TestAuthorizationGrandchild
} from './test-authorization-tree';

import { TestMasterDetailModule } from 'lab/component/master-detail/test-master-detail.module';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, LsComponentsModule, TestMasterDetailModule],
    declarations: [
        TestAuthorization,
        TestAuthorizationData,
        TestAuthorizationInputs,
        TestAuthorizationDynamicForm,
        TestAuthorizationParent,
        TestAuthorizationChild,
        TestAuthorizationGrandchild
    ],
    providers: [
        { provide: DYNAMIC_FIELDS_REGISTRY, useValue: LsDynamicFieldsRegistry },
        ValidationMessageService,
        MetadataLoader,
        MetadataService,
        ListDataService,
        ResourceManager,
        DynamicFormDataResolver
    ]
})
export class TestAuthorizationModule {}
