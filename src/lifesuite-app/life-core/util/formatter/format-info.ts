/**
 * DateFormatInfo presents information about short date format in a convenient way.
 * Examples of time formats:
 * en-US: 'MM/dd/yyyy'
 * fr-CA: 'dd/MM/yyyy'
 */
export class ShortDateFormatInfo {
    public readonly numberOfParts: number;
    public readonly indexPartYear: number;
    public readonly indexPartMonth: number;
    public readonly indexPartDay: number;
    public readonly parts: string[];
    public readonly partSeparator: string;

    constructor(dateFormat: string) {
        this.partSeparator = this.getPartSeparator(dateFormat);
        this.parts = dateFormat.split(this.partSeparator);
        this.numberOfParts = this.parts.length;
        for (let i = 0; i < this.numberOfParts; i++) {
            const part = this.parts[i];
            if (ShortDateFormatInfo.isYearPart(part)) {
                this.indexPartYear = i;
            } else if (ShortDateFormatInfo.isMonthPart(part)) {
                this.indexPartMonth = i;
            } else if (ShortDateFormatInfo.isDayPart(part)) {
                this.indexPartDay = i;
            }
        }
    }

    public static isYearPart(part: string): boolean {
        return part.startsWith('y');
    }

    public static isMonthPart(part: string): boolean {
        return part.toLowerCase().startsWith('m');
    }

    public static isDayPart(part: string): boolean {
        return part.startsWith('d');
    }

    private getPartSeparator(timeFormat: string): string {
        const regex = /[^\w\s]/g;
        return timeFormat[timeFormat.search(regex)];
    }
}

/**
 * TimeFormatInfo presents information about time format in a convenient way.
 * Examples of time formats:
 * en-US: 'h:mm:ss a'
 * fr-CA: 'HH:mm:ss'
 */
export class TimeFormatInfo {
    public readonly numberOfParts: number;
    public readonly indexPartHours: number;
    public readonly indexPartMinutes: number;
    public readonly indexPartSeconds: number;
    public readonly is12HourFormat: boolean;
    public readonly parts: string[];
    public readonly partSeparator: string;

    public static readonly hourFormat12: string = ' a';

    constructor(timeFormat: string, needSeconds: boolean) {
        if (this.has12Hour(timeFormat)) {
            this.is12HourFormat = true;
            timeFormat = this.remove12Hour(timeFormat);
        } else {
            this.is12HourFormat = false;
        }

        this.partSeparator = this.getPartSeparator(timeFormat);
        this.parts = timeFormat.split(this.partSeparator);
        this.numberOfParts = this.parts.length;
        for (let i = 0; i < this.numberOfParts; i++) {
            const part = this.parts[i];
            if (TimeFormatInfo.isHoursPart(part)) {
                this.indexPartHours = i;
            } else if (TimeFormatInfo.isMinutesPart(part)) {
                this.indexPartMinutes = i;
            } else if (TimeFormatInfo.isSecondsPart(part)) {
                this.indexPartSeconds = i;
            }
        }
        if (needSeconds) {
            if (this.indexPartSeconds == undefined) {
                this.addPartSeconds();
                this.numberOfParts++;
                this.indexPartSeconds = this.numberOfParts - 1;
            }
        } else {
            if (this.indexPartSeconds >= 0) {
                this.deletePart(this.indexPartSeconds);
                this.numberOfParts--;
                this.indexPartSeconds = undefined;
            }
        }
    }

    public static isHoursPart(part: string): boolean {
        return part.toLowerCase().startsWith('h');
    }

    public static isMinutesPart(part: string): boolean {
        return part.startsWith('m');
    }

    public static isSecondsPart(part: string): boolean {
        return part.startsWith('s');
    }

    private deletePart(index: number): void {
        this.parts.splice(index, 1);
    }

    private addPartSeconds(): void {
        this.parts.push('s');
    }

    private has12Hour(timeFormat: string): boolean {
        return timeFormat.includes(TimeFormatInfo.hourFormat12);
    }

    private remove12Hour(timeFormat: string): string {
        return timeFormat.replace(TimeFormatInfo.hourFormat12, '');
    }

    private getPartSeparator(timeFormat: string): string {
        const regex = /[^\w\s]/g;
        return timeFormat[timeFormat.search(regex)];
    }
}
