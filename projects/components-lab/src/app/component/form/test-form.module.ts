import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { LplaComponentsModule } from 'lpla-core/component/lpla-components.module';
import { TestFormInputs } from './test-form-inputs';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ComponentsModule,
		LplaComponentsModule
	],
	declarations: [
		TestFormInputs
	],
	exports: [
	]
}) 

export class TestFormModule { }
