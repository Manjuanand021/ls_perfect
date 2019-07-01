import { FormInput } from './form-input';
import { CombinedFormInputs } from './form-types';

export class FormInputUtil {
    public static getFormInputByControlName(controlName: string, combinedFormInputs: CombinedFormInputs): FormInput {
        let formInput;
        combinedFormInputs.find(formInputsArray => {
            formInputsArray.find(formInputItem => {
                if (formInputItem.control.name == controlName) {
                    formInput = formInputItem;
                    return true;
                }
            });
            if (formInput) return true;
        });
        return formInput;
    }

    public static getEnclosingPanels(formInput: FormInput): Element[] {
        const PanelCssClass = '.ui-panel';
        const panelElements: Element[] = [];
        let panelElement = formInput.control.elementRef.nativeElement.closest(PanelCssClass);
        while (panelElement) {
            panelElements.push(panelElement);
            panelElement = panelElement.parentElement.closest(PanelCssClass);
        }
        return panelElements;
    }

    public static getEnclosingPanelIds(formInput: FormInput): string[] {
        const panelElements = this.getEnclosingPanels(formInput);
        return panelElements.map(panelElement => panelElement.parentElement.getAttribute('name'));
    }
}
