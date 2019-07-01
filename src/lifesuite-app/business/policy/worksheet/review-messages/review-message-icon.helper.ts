import { IconData } from 'life-core/model';
import { ReviewMessagesType } from './review-messages-type';
import { ReviewMessageDataContext } from './review-message-data-context';
import { ConvertUtil } from 'life-core/util/lang';

export class ReviewMessageIconHelper {
    private static REQUIREMENT_REPORT_RECEIVED_CLOSED_DISPOSITION: string = 'R';

    public static getIcon(message: any, reviewMessagesDataContext: ReviewMessageDataContext): string {
        const iconData = this.getIconData(message, reviewMessagesDataContext);
        return `<div class="${iconData.cssClass} grid-cell-icon"/>`;
    }

    private static getIconData(message: any, reviewMessagesDataContext: ReviewMessageDataContext): IconData {
        let iconData: IconData;

        if (this.isRequirementReportReceived(message, reviewMessagesDataContext)) {
            iconData = new IconData(
                'ls-requirement-report-received-message-icon',
                'Requirement Report Received Message'
            );
        } else {
            switch (ConvertUtil.toNumber(message.MessageType)) {
                case ReviewMessagesType.CHECKABLE: {
                    iconData = new IconData('ls-checkable-message-icon', 'Checkable Message');
                    break;
                }
                case ReviewMessagesType.NOT_CHECKABLE: {
                    iconData = new IconData(
                        'ls-requirement-outstanding-message-icon',
                        'Requirement Outstanding Message'
                    );
                    break;
                }
                case ReviewMessagesType.INFO_ONLY:
                case ReviewMessagesType.INFO_PERM: {
                    iconData = message.NoteId
                        ? new IconData(
                              'ls-system-information-message-with-note-icon',
                              'System Information Message with Note'
                          )
                        : new IconData('ls-system-information-message-icon', 'System Information Message');
                    break;
                }
                default: {
                    iconData = new IconData('ls-message-checked-off-icon', 'Message Checked Off');
                }
            }
        }
        return iconData;
    }

    private static getRequirementReport(message: any, reviewMessagesDataContext: ReviewMessageDataContext): any {
        let requirementReport;
        const applicant = reviewMessagesDataContext.applicant;

        if (reviewMessagesDataContext.policy.Requirements_LazyLoad) {
            reviewMessagesDataContext.policy.Requirements_LazyLoad.some(requirement => {
                if (
                    requirement.PolicyPersonId == applicant.PolicyPersonId &&
                    requirement.ReviewMessageId == message.ReviewMessageId
                ) {
                    requirementReport = requirement;
                    return true;
                }
                return false;
            });
        }
        return requirementReport;
    }
    public static isRequirementReportReceived(
        message: any,
        reviewMessagesDataContext: ReviewMessageDataContext
    ): boolean {
        const requirementReport = this.getRequirementReport(message, reviewMessagesDataContext);
        return (
            requirementReport &&
            requirementReport.ClosedDisposition == this.REQUIREMENT_REPORT_RECEIVED_CLOSED_DISPOSITION
        );
    }
}
