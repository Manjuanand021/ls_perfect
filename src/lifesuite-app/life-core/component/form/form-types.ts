import { FormInput } from './form-input';

export type FormErrors = { [controlId: string]: string };

export type CombinedFormInputs = Array<Array<FormInput>>;
