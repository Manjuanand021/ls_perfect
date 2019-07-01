import {
    FieldConfig,
    NumberFieldConfig,
    ListFieldConfig,
    RadioButtonGroupFieldConfig,
    MaskFieldConfig
} from 'life-core/component/dynamic-form';

export const formFieldsConfig: FieldConfig[] = [
    {
        type: 'inputtext',
        label: 'First name',
        name: 'firstname',
        dataPath: 'applicant',
        dataProperty: 'firstName',
        placeholder: 'Enter first name',
        required: true,
        layout: { colspan: 3 }
    },
    {
        type: 'inputtext',
        label: 'Last name',
        name: 'lastname',
        dataPath: 'applicant',
        dataProperty: 'lastName',
        placeholder: 'Enter last name',
        required: true,
        layout: { colspan: 9 }
    },
    {
        type: 'inputnumber',
        label: 'Policy Amount',
        name: 'amount',
        dataPath: 'policy',
        dataProperty: 'amount',
        required: true,
        format: 'n2',
        decimals: 2,
        range: {
            min: 1000,
            max: 200000
        },
        allowNegative: false,
        layout: { colspan: 12 }
    } as NumberFieldConfig,
    {
        type: 'inputtextarea',
        label: 'Notes',
        name: 'notes',
        dataPath: 'policy',
        dataProperty: 'notes',
        placeholder: 'Provide description',
        required: false
    },
    {
        type: 'inputdate',
        name: 'autoCloseDate',
        label: 'Auto Close Date',
        dataPath: 'policy',
        dataProperty: 'autoCloseDate'
    },
    {
        type: 'daterange',
        name: 'applicantStatusDate',
        label: 'Status Date(start/end)',
        dataPath: 'policy',
        dataProperty: 'applicantStatusDate'
    },
    {
        type: 'inputmask',
        label: 'Phone',
        name: 'phone',
        dataPath: 'applicant',
        dataProperty: 'phone',
        mask: '999-999-9999',
        placeholder: '999-999-9999',
        required: true
    } as MaskFieldConfig,
    {
        type: 'inputnumber',
        label: 'Age',
        name: 'age',
        dataPath: 'applicant',
        dataProperty: 'age',
        required: true,
        format: 'n0',
        decimals: 0,
        range: {
            min: 0,
            max: 100
        }
    },
    {
        type: 'dropdown',
        label: 'Users',
        name: 'users',
        dataPath: 'system',
        dataProperty: 'user',
        resolveType: 'userList',
        style: { width: '150px' },
        placeholder: 'Select user',
        dependentFields: ['status']
    } as ListFieldConfig,
    {
        type: 'dropdown',
        label: 'Status',
        name: 'status',
        dataPath: 'policy',
        dataProperty: 'status',
        metaType: 'coverageType',
        style: { width: '150px' },
        placeholder: 'Select an option',
        clearable: false
    } as ListFieldConfig,
    {
        type: 'radiobuttongroup',
        label: 'Applicant Type',
        name: 'applicantType',
        dataPath: 'applicant',
        dataProperty: 'applicantType',
        options: [{ label: 'Primary', value: '1' }, { label: 'Additional', value: '2' }],
        required: true
    } as RadioButtonGroupFieldConfig,
    {
        type: 'checkbox',
        label: 'Is Owner',
        name: 'isOwner',
        dataPath: 'applicant',
        dataProperty: 'isOwner',
        raiseEvent: true
    },

    {
        type: 'listvaluelabel',
        label: 'Disposition',
        name: 'disposition',
        dataPath: 'policy',
        dataProperty: 'disposition',
        options: [{ label: 'Approved', value: 1 }, { label: 'Declined', value: 2 }, { label: 'Pending', value: 3 }]
    } as ListFieldConfig,
    {
        type: 'button',
        label: 'Some Action',
        name: 'SomeAction',
        layout: { colspan: 12 }
    }
];
