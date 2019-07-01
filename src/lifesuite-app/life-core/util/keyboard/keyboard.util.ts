export class KeyBoardUtil {
    public static isCtrlClick(clickEvent: any): boolean {
        return clickEvent && clickEvent.ctrlKey;
    }
}
