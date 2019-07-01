import { RequirementDTO, DBDate } from 'ls-core/model';
import { IconData } from 'life-core/model';

export class RequirementIconHelper {
    public static getMatchUnmatchIcon(requirement: RequirementDTO): string {
        const iconData = this.getMatchUnmatchIconData(requirement);
        if (iconData) {
            return `<div class="${iconData.cssClass} grid-cell-icon"/>`;
        }
        return '';
    }

    private static getMatchUnmatchIconData(requirement: RequirementDTO): IconData {
        if (!requirement || !requirement.supportsMatch) {
            return null;
        }
        return requirement.RequirementInformationId
            ? new IconData('ls-matched-icon', 'Matched')
            : new IconData('ls-unmatched-icon', 'Unmatched');
    }

    public static getNoteIcon(requirement: RequirementDTO): string {
        const iconData = this.getNoteIconData(requirement);
        if (iconData) {
            return `<div class="${iconData.cssClass} grid-cell-icon"/>`;
        }
        return '';
    }

    private static getNoteIconData(requirement: RequirementDTO): IconData {
        return requirement.Note ? new IconData('ls-note-icon', 'Note') : null;
    }

    public static getAlertIcon(requirement: RequirementDTO): string {
        const iconData = this.getAlertIconData(requirement);
        if (iconData) {
            return `<div class="${iconData.cssClass} grid-cell-icon"/>`;
        }
        return '';
    }

    private static getAlertIconData(requirement: RequirementDTO): IconData {
        if (requirement.ClosedDisposition != 'S' && this.isFollowupDateExpired(requirement.FollowupDate)) {
            return new IconData('ls-alert-icon', 'Alert');
        }
        return null;
    }

    private static isFollowupDateExpired(followupDate: DBDate): boolean {
        if (followupDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return followupDate.dateAndTimeAsString != '' && new Date(followupDate.datetime) <= today;
        }
        return false;
    }
}
