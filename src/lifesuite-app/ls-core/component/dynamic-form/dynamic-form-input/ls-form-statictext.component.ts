import { Component, Pipe, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import {
    LfFormStaticTextComponent,
    LfFormStaticTextConfigPipe,
    StaticTextConfig
} from 'life-core/component/dynamic-form';
import { DBDate } from 'ls-core/model';

@Pipe({ name: 'lsStaticTextConfig' })
export class LsFormStaticTextConfigPipe extends LfFormStaticTextConfigPipe {
    protected prepareValue(value: any, config: StaticTextConfig): any {
        if (config.format == 'date') {
            return this.getDateValue(value);
        } else {
            return super.prepareValue(value, config);
        }
    }

    private getDateValue(value: any): any {
        return value ? (<DBDate>value).dateAsString : value;
    }
}

@Component({
    selector: 'ls-form-statictext',
    template: `
	<lf-form-input [control]="formStaticText" [label]="config.label">
		<lf-statictext 
			#formStaticText
			[name]="config.name+index"
			[authorizationLevel]="authorizationLevel"
            [value]="data? (data[config.dataProperty] | lsStaticTextConfig : config) : ''"
            [disabled]="config.disabled"
		>
		</lf-statictext>
	</lf-form-input>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LsFormStaticTextComponent extends LfFormStaticTextComponent {
    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
