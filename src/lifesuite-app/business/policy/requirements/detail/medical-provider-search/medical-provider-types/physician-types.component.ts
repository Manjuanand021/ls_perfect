import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';

@Injectable()
export class PhysicianTypesComponent extends ViewModel implements ICompose {
	constructor(injector: Injector) {
		super(injector);
	}

	public setModel(model: any) {
		this.data = model;
	}
}