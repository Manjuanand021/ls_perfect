import { Component, Injector, Injectable, Input } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { BenefitDTO } from 'ls-core/model';

@Component({
    selector: 'ls-benefit',
    templateUrl: './benefit.component.html'
})

@Injectable()
export class BenefitComponent extends ViewModel {

	@Input() benefit: BenefitDTO;

	constructor(injector: Injector) {
		super(injector);
    }

}
