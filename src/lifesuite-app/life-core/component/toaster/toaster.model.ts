export class ToasterMessage {
    public severity?: string;
    public summary: string;
    public detail?: string;
    public id?: any;
    constructor({ severity, summary, detail, id }: { severity?: string; summary: string; detail?: string; id?: any }) {
        this.severity = severity || ToasterSeverity.INFO;
        this.summary = summary;
        this.detail = detail || '';
        this.id = id;
    }
}

export const ToasterSeverity = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warn',
    ERROR: 'error'
};

// Time to display a message in milliseconds before removing it.
export const ToasterMessageLife = 5000;
