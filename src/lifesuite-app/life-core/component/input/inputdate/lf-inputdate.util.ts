import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class LfInputDateUtil {
    public static dateToNgbDate(value: Date): NgbDate {
        return value ? new NgbDate(value.getFullYear(), value.getMonth() + 1, value.getDate()) : null;
    }

    public static dateToNgbDateStruct(value: Date): NgbDateStruct {
        return value ? this.dateToNgbDate(value) : null;
    }

    public static ngbDateToDate(value: NgbDateStruct, timeValue?: Date): Date {
        return value
            ? timeValue
                ? new Date(
                      value.year,
                      value.month - 1,
                      value.day,
                      timeValue.getHours(),
                      timeValue.getMinutes(),
                      timeValue.getSeconds()
                  )
                : new Date(value.year, value.month - 1, value.day)
            : null;
    }
}
