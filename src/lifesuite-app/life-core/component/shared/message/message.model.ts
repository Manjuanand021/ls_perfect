export enum MessageSeverity {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error'
}

const MessageSeverityToCssClassMap = {
    [MessageSeverity.SUCCESS]: 'alert-success',
    [MessageSeverity.INFO]: 'alert-info',
    [MessageSeverity.WARNING]: 'alert-warning',
    [MessageSeverity.ERROR]: 'alert-danger'
};

export class Message {
    public message: string;
    public severity: MessageSeverity;

    constructor(message: string, severity: MessageSeverity) {
        this.message = message;
        this.severity = severity;
    }

    public get messageCssClass(): string {
        return MessageSeverityToCssClassMap[this.severity];
    }
}
