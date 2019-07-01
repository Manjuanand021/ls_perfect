import { DependentFieldHandler, DependentFieldHandlerContext } from 'life-core/component/dynamic-form';

export class SampleDependentFieldHandler extends DependentFieldHandler {
    public execute(context: DependentFieldHandlerContext): void {
        alert(
            `DynamicDependentFieldEvent: dependent field '${context.dependentField.name}' triggered by field '${
                context.triggerField.name
            }'`
        );
        if (context.triggerField.name == 'users') {
            context.dependentField.disabled = context.triggerFieldValue == '3';
        }
    }
}
