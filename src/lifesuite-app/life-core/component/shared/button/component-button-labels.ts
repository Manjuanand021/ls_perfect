import { I18n } from 'life-core/i18n';

export abstract class ComponentButtonLabels {
    protected buttonLabelMap: { readonly [buttonType: string]: string };
    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.setupButtonLabels();
        this.setupButtonLabelMap();
    }

    public get byType(): { [buttonType: string]: string } {
        return this.buttonLabelMap;
    }

    protected abstract setupButtonLabels(): void;

    protected abstract setupButtonLabelMap(): void;
}
