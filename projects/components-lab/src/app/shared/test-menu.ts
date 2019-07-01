export class TestMenuItem {
    name: string;
    route: string;
    subItems?: TestMenuItem[];
    collapsed: boolean;

    constructor({
        name,
        route,
        subItems,
        collapsed
    }: {
        name: string;
        route?: string;
        subItems?: TestMenuItem[];
        collapsed?: boolean;
    }) {
        this.name = name;
        this.route = route;
        this.subItems = subItems;
        this.collapsed = collapsed;
    }
}

export class TestMenu {
    public static menuData: TestMenuItem[] = [
        new TestMenuItem({
            name: 'Inputs',
            subItems: [
                new TestMenuItem({ name: 'RadioButtonGroup', route: 'test/test-radiobutton-group' }),
                new TestMenuItem({ name: 'InputNumber', route: 'test/test-inputnumber' }),
                new TestMenuItem({ name: 'InputText', route: 'test/test-inputtext' }),
                new TestMenuItem({ name: 'DropDown', route: 'test/test-dropdown' }),
                new TestMenuItem({ name: 'InputDate and InputTime', route: 'test/test-inputdate' }),
                new TestMenuItem({ name: 'InputMask', route: 'test/test-inputmask' }),
                new TestMenuItem({ name: 'CheckBox', route: 'test/test-checkbox' }),
                new TestMenuItem({ name: 'Textarea', route: 'test/test-inputtextarea' }),
                new TestMenuItem({ name: 'InputPhone', route: 'test/test-inputphone' }),
                new TestMenuItem({ name: 'SampleCompositeInput', route: 'test/test-sample-composite-input' }),
                new TestMenuItem({ name: 'InputBankAccount', route: 'test/test-inputbankaccount' })
            ],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Misc',
            subItems: [
                new TestMenuItem({ name: 'Button', route: 'test/test-button' }),
                new TestMenuItem({ name: 'Toaster', route: 'test/test-toaster' }),
                new TestMenuItem({ name: 'Toolbar', route: 'test/test-toolbar' }),
                new TestMenuItem({ name: 'Panel', route: 'test/test-panel' }),
                new TestMenuItem({ name: 'Supplemental Note', route: 'test/test-supplemental-note' })
            ],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Authorization',
            subItems: [
                new TestMenuItem({ name: 'Test Authorization', route: 'test/authorization/components' }),
                new TestMenuItem({ name: 'Test Authorization Tree', route: 'test/authorization/tree' })
            ],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Forms',
            subItems: [new TestMenuItem({ name: 'Form Inputs', route: 'test/form-inputs' })],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Dynamic Forms',
            subItems: [new TestMenuItem({ name: 'Simple Dynamic Form', route: 'test/dynamic-form' })],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Dialogs',
            subItems: [new TestMenuItem({ name: 'Confirm and Modal', route: 'test/dialogs' })],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Containers',
            subItems: [
                new TestMenuItem({ name: 'Item List', route: 'test/item-lists' }),
                new TestMenuItem({ name: 'Master Detail', route: 'test/master-detail' }),
                new TestMenuItem({ name: 'TabView', route: 'test/tabview' })
            ],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Grids',
            subItems: [new TestMenuItem({ name: 'Data Grid', route: 'test/ag-grid' })],
            collapsed: true
        }),
        new TestMenuItem({
            name: 'Other',
            subItems: [
                new TestMenuItem({ name: 'Material Design', route: 'test/material2' }),
                new TestMenuItem({ name: 'Messaging', route: 'test/messaging' })
            ],
            collapsed: true
        })
    ];
}
