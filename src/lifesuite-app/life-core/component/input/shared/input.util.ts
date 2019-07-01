import { NgModel } from '@angular/forms';
import { Keys } from 'life-core/util/keyboard';

export class InputUtil {
    public static ignoreKeyPress(event: KeyboardEvent): boolean {
        return event.which === 0 || event.keyCode === Keys.backspace || event.keyCode === Keys.enter;
    }

    public static setComponentNgModelValue(componentNgModel: NgModel, value: any): void {
        componentNgModel.valueAccessor.writeValue(value);
    }
}
