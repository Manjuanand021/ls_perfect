import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { DYNAMIC_FIELDS_REGISTRY } from 'life-core/component/dynamic-form';
import { LsDynamicFieldsRegistry } from 'ls-core/component/dynamic-form';

import { ListDataService, MetadataService } from 'ls-core/service';
import { ResourceManager } from 'ls-core/resource/resource-manager';
import { MetadataLoader } from 'ls-core/util';

import { TestParentFormView } from './test-parent-form-view';
import { TestChildFormView } from './test-child-form-view';
import { DynamicFormDataResolver } from './dynamic-form-data.resolver';
import { UserListResolver } from './user-list.resolver';
import { SampleDependentFieldHandler } from './sample-dependent-field.handler';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, LsComponentsModule],
    declarations: [TestParentFormView, TestChildFormView],
    providers: [
        { provide: DYNAMIC_FIELDS_REGISTRY, useValue: LsDynamicFieldsRegistry },
        MetadataLoader,
        MetadataService,
        ListDataService,
        ResourceManager,
        DynamicFormDataResolver,
        UserListResolver,
        SampleDependentFieldHandler
    ]
})
export class TestDynamicFormModule {}
