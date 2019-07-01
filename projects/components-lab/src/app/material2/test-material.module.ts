import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { MaterialModule, MdInputModule } from '@angular/material';

import { ComponentsModule } from 'life-core/component/components.module';

import { TestMaterial2AppComponent, DialogContent } from './test-material';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		//MaterialModule.forRoot(),
		//MdInputModule,
		ComponentsModule
	],
	declarations: [
		TestMaterial2AppComponent,
		DialogContent
   ],
	entryComponents: [	// Components loaded dynamically (not via Router)
		DialogContent
	],
})
export class TestMaterial2AppModule { }
