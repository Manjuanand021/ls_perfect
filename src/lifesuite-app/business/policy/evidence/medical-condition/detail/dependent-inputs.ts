
export class BaseInput {
    public value: string;

    constructor() {
        this.value = '';
    }
}

export class ParentInput extends BaseInput {
    public disable: boolean;

    constructor() {
        super();
    }
}

export class ChildInput extends BaseInput {
    public visible: boolean;

    constructor() {
        super();
    }
}

export abstract class DependentInputs {
    public parentInput: ParentInput;
    public childInput: ChildInput;

    constructor(parentInput?: ParentInput, childInput?: ChildInput) {
        this.parentInput = parentInput ? parentInput : new ParentInput();
        this.childInput = childInput ? childInput : new ChildInput();
    }

    /**
     * Method fetch dependentInput value.
     * Sample return value
     * concatValue = true and delimiter = '-' => '$parentValue-$childValue'
     * concatValue = false => '$parentValue'
     * @param concatValue
     * @param delimiter
     */
    public getDependentInputValue(concatValue?: boolean, delimiter: string = ''): string {
        if (this.childInput.visible) {
            return concatValue
                ? this.getParentInputValue() + delimiter + this.getChildInputValue()
                : this.getChildInputValue();
        } else {
            return this.getParentInputValue();
        }
    }

    /**
     * Set child input properties with parent dependency
     */
    protected setDependentChildInput(): void {
        if (this.parentInput.value === this.getDependencyValue()) {
            this.showChildInput()
        } else {
            this.hideChildInput();
        }
    }

    /**
     * Returns parent input value
     */
    private getParentInputValue(): string {
        return this.parentInput.value;
    }

    /**
     * Returns child input value
     */
    private getChildInputValue(): string {
        return this.childInput.value;
    }

    /**
     * disables parent input
     */
    private disableParentInput(): void {
        this.parentInput.disable = true;
    }

    /**
     * enables parent input
     */
    private enableParentInput(): void {
        this.parentInput.disable = false;
    }

    /**
     * shows child input
     */
    private showChildInput(): void {
        this.childInput.visible = true;
    }

    /**
     * hides child input
     */
    private hideChildInput(): void {
        this.childInput.visible = false;
    }

    /**
     * sets parent input value
     */
    private setParentInputValue(value: string): void {
        this.parentInput.value = value;
        this.setDependentChildInput();
    }

    /**
     * sets child input value
     */
    private setChildInputValue(value: string): void {
        this.childInput.value = value;
    }

    /**
     * Returns child input value
     */
    public abstract getDependencyValue(): string

    /**
     * Sets dependent  input
     * @param isChildInput
     * @param value
     * @param disable
     * @param reset
     */
    public updateDependentInputs(isChildInput: boolean, value: string, disable: boolean, reset?: boolean): void {
        if (isChildInput) {
            this.setParentInputValue(this.getDependencyValue());
            if (disable) this.disableParentInput();
            this.setChildInputValue(reset ? '' : value);
        } else {
            this.setParentInputValue(value);
            this.setChildInputValue('');
            this.enableParentInput();
        }
    }
}
