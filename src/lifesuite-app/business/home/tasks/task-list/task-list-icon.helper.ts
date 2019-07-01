import { DBDateUtil } from 'ls-core/util';
import { DateUtil } from 'life-core/util';

export class TaskListIconHelper {
    public static getIcon(params: any): string {
        if (params.data && params.data.DiaryDate) {
            const today = new Date();
            if (
                DateUtil.isDateSet(params.data.DiaryDate.datetime) &&
                DBDateUtil.serverDateTime(params.data.DiaryDate) <= today
            ) {
                return '<div class="ls-task-expired-icon grid-cell-icon"/>';
            }
        }
        return '';
    }

    public static getIconForImgReceived(params: any): string {
        if (params.data && params.data.IsNew.toString() === 'true') {
            return '<div class="ls-task-expired-icon grid-cell-icon"/>';
        }
        return '';
    }

    public static getDeleteIconForImgReceived(params: any): string {
        return '<div class="ls-task-cancel-icon grid-cell-icon"/>';
    }
}
