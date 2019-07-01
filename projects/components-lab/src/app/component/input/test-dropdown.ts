import { Injector, Component } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { FieldDescriptorBase, ListFieldModel, IListItem } from 'lpla-core/field';
import { ListItem } from 'life-core/model';
import { TestInputsUtil } from './shared/test-inputs.util';
import { TestInputComponent, DefaultAuthorizationProvider } from './shared/test-inputcomponent';

@Component({
    selector: 'test-dropdown',
    templateUrl: './test-dropdown.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestDropDown extends TestInputComponent {
    searchable: boolean = true;

    clearable: boolean = true;

    stringList: Array<ListItem> = [
        new ListItem('Item a', '1'),
        new ListItem('Item b', '2'),
        new ListItem('Item c', '3'),
        new ListItem('AItema', '4'),
        new ListItem('AItemb', '5'),
        new ListItem('AAItemc', '6')
    ];
    stringListValue1: string = '3';
    stringListValue2: string = '6';

    numericList: Array<ListItem<number>> = [
        new ListItem('Item 0', 0),
        new ListItem('Item 1', 1),
        new ListItem('Item 2', 2),
        new ListItem('Item 3', 3)
    ];
    numericListValue: number = 0;

    constructor(injector: Injector) {
        super(injector);
    }

    setupFieldsData() {
        let stringList: IListItem<string>[] = this.createStringValueList();
        this.fieldDescriptors.push(
            TestInputsUtil.createListFieldDescriptor<string>('stringListField', 'B', stringList)
        );
        let numberList: IListItem<number>[] = this.createNumberValueList();
        this.fieldDescriptors.push(TestInputsUtil.createListFieldDescriptor<number>('numberListField', 2, numberList));
    }

    createStringValueList(): IListItem<string>[] {
        return [
            { CodeID: 'A', StringValue: 'Item A' },
            { CodeID: 'B', StringValue: 'Item B' },
            { CodeID: 'C', StringValue: 'Item C' }
        ];
    }

    createNumberValueList(): IListItem<number>[] {
        return [
            { CodeID: 1, StringValue: 'Item 1' },
            { CodeID: 2, StringValue: 'Item 2' },
            { CodeID: 3, StringValue: 'Item 3' }
        ];
    }

    createNumberValueList2(): IListItem<number>[] {
        return [
            { CodeID: 11, StringValue: 'Item 10' },
            { CodeID: 20, StringValue: 'Item 20' },
            { CodeID: 30, StringValue: 'Item 30' }
        ];
    }

    onDropDownChange(event): void {
        console.debug('onDropDownChange:', event);
    }

    onListChange(): void {
        console.debug('stringListField value: ', this.fields['stringListField'].value);
    }

    selectFirstListItem(): void {
        let field = <ListFieldModel<number>>this.fields['numberListField'];
        this.fields['numberListField'].value = field.model.listItems[0].CodeID;
    }

    changeList(): void {
        let field = <ListFieldModel<number>>this.fields['numberListField'];
        field.setList(this.createNumberValueList2());
        this.selectFirstListItem();
    }
}
