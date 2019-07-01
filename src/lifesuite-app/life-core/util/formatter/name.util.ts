import { NamePattern } from 'life-core/util/formatter/name-pattern';

export class NameUtil {
    public static getFullName({
        title,
        firstName,
        middleName,
        lastName,
        suffix,
        delimiter = ' '
    }: {
        title?: string;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        suffix?: string;
        delimiter?: string;
    }): string {
        let nameParts = [title, firstName, middleName, lastName, suffix];
        nameParts = nameParts.filter(part => part && part.length > 0);
        return nameParts.length > 0 ? nameParts.join(delimiter) : '';
    }

    public static getFullNameWithMiddleInitial({
        firstName,
        middleName,
        lastName,
        pattern
    }: {
        firstName: string;
        middleName?: string;
        lastName: string;
        pattern?: NamePattern;
    }): string {
        const middleInitial = middleName ? ` ${middleName.charAt(0)}.` : '';
        firstName = firstName || '';
        lastName = lastName || '';
        return pattern === NamePattern.FirstAndLastName
            ? `${firstName} ${lastName}`.concat(middleInitial)
            : `${lastName}, ${firstName}`.concat(middleInitial);
    }

    public static getInitials({
        firstName,
        middleName,
        lastName
    }: {
        firstName: string;
        middleName: string;
        lastName: string;
    }): string {
        const nameParts = [firstName, middleName, lastName];
        let names = nameParts.filter(part => part && part.length > 0);
        names = names.map(name => name.substr(0, 1));
        return names.join('');
    }
}
