export interface ValueFormatter {
    format(value: any, ...args: any[]): string;
}
