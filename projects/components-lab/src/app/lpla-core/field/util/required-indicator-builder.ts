export class RequiredIndicatorBuilder {
    private _indicatorId: string;

    private _targetField: any;

    private _targetFieldId: string;

    // public build(targetField: JQuery): void {
    public build(targetField: any): void {
        this._targetField = targetField;
        this._targetFieldId = targetField.attr('id');
        this._indicatorId = `${this._targetFieldId}_required`;

        if (this.needToBuildIndicator()) {
            return this.buildIndicator();
        }
    }

    private needToBuildIndicator(): boolean {
        return this.labelExist() && !this.indicatorExist();
    }

    private labelExist(): boolean {
        return this.getFieldLabel(this._targetFieldId) != undefined;
    }

    private indicatorExist(): boolean {
        return document.getElementById(this._indicatorId) != undefined;
    }

    private buildIndicator(): void {
        let indicator = this.createIndicator();
        let indicatorFor: HTMLElement = this.getFieldLabel(this._targetFieldId);
        indicatorFor.appendChild(indicator);
    }

    private createIndicator(): HTMLElement {
        let indicator: HTMLDivElement = document.createElement('div');
        indicator.id = this._indicatorId;
        indicator.classList.add('field-required');
        return indicator;
    }

    private getFieldLabel(fieldId: string): HTMLElement {
        return null;
        //return $(`label[for=${fieldId}]`)[0];
    }
}
