import { DateRange } from 'life-core/component/input';

import { DBDate, BaseDTO } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';

const birthdate = new DBDate();
birthdate.datetime = new Date('01/01/1980');

export class PolicyData extends BaseDTO {
    public $type: string;
    public status: string;
    public amount: number;
    public notes: string;
    public disposition: string;
    public autoCloseDate: DBDate;
    public applicantStatusDate: DateRange;
}

class ApplicantData extends BaseDTO {
    public $type: string;
    public firstName: string;
    public lastName: string;
    public age: number;
    public birthdate: DBDate;
    public applicantType: string;
    public phone: string;
    public isOwner: number;
}

class SystemData extends BaseDTO {
    public user: string;
}

export const formData1: any = {
    policy: {
        $type: 'PolicyData',
        status: 'PE',
        amount: 100000,
        notes: 'abc\ndef',
        disposition: '3',
        autoCloseDate: DBDateUtil.dateToDBDate(new Date('01/01/2020')),
        // applicantStatusDate: { minDate: new Date('3/2/2000'), maxDate: new Date('10/5/2019') } as DateRange
        applicantStatusDate: { minDate: null, maxDate: null } as DateRange
    } as PolicyData,
    applicant: {
        $type: 'ApplicantData',
        firstName: 'Applicant1',
        lastName: '1',
        age: 35,
        birthdate: DBDateUtil.dateToDBDate(new Date('01/01/1980')),
        applicantType: '1',
        phone: '1234567890',
        isOwner: 1
    } as ApplicantData,
    system: {
        user: '2'
    } as SystemData
};

export const formData2: any = {
    policy: {
        $type: 'PolicyData',
        status: 'DE',
        amount: 200000,
        notes: '111\n222',
        disposition: '2',
        autoCloseDate: DBDateUtil.dateToDBDate(new Date('01/01/2020')),
        // applicantStatusDate: { minDate: new Date('3/2/2000'), maxDate: new Date('10/5/2019') } as DateRange
        applicantStatusDate: { minDate: null, maxDate: null } as DateRange
    } as PolicyData,
    applicant: {
        $type: 'ApplicantData',
        _lazyLoadEnabled: true,
        firstName: 'Applcant2',
        lastName: '2',
        age: 55,
        birthdate: DBDateUtil.dateToDBDate(new Date('01/01/1960')),
        applicantType: '2',
        phone: '9876543210',
        isOwner: 2
    } as ApplicantData,
    system: {
        user: '1'
    } as SystemData
};
