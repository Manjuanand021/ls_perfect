import { Type } from '@angular/core';

import { IValidationMessageBuilder } from './index';

export type ValidationMessageBuilderRegistryType = { readonly [type: string]: Type<IValidationMessageBuilder> };
