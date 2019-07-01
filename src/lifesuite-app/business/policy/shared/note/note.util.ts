import { NoteTypes } from 'ls-core/model';
export class NoteUtil {
    public static isCaseNote(noteType: string): boolean {
        return noteType != NoteTypes.WORKSHEET && noteType != NoteTypes.MED_NOTE && noteType != NoteTypes.MEDCON_NOTE;
    }

    public static isUWNote(noteType: string): boolean {
        return noteType == NoteTypes.WORKSHEET || noteType == NoteTypes.MEDCON_NOTE;
    }

    public static isCaseOrUWNote(noteType: string): boolean {
        return NoteUtil.isCaseNote(noteType) || NoteUtil.isUWNote(noteType);
    }

    public static getNoteTypeCategory(noteType: string): string {
        return NoteUtil.isCaseNote(noteType)
            ? NoteTypeCategories.CASE
            : NoteUtil.isUWNote(noteType)
            ? NoteTypeCategories.UW
            : '';
    }
    public static launchNotePreviewReport(LegacyUrl: string, id: string, polNumber: string, noteType: string): void {
        const winName = `note print preview :${polNumber}`;
        if (!LegacyUrl.endsWith('/')) {
            LegacyUrl = LegacyUrl + '/';
        }

        const winURL = `${LegacyUrl}RptDesktop/SSRSReportViewer.aspx?id=${encodeURIComponent(
            id
        )}&polnumber=${encodeURIComponent(polNumber)}&notetype=${noteType}`;
        const windowoption = 'location=no, menubar=no, status=no, toolbar=no, scrollbars=yes, resizable=yes, top=0';
        window.open(winURL, winName, windowoption); // Checking by removing multiple implementations.

        // const form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.setAttribute('action', winURL);
        // form.setAttribute('target', winName);
        // document.body.appendChild(form);

        // const win = window.open(winURL, winName, windowoption);
        // const html = '<br><b>Loading, please wait report is loading...  <b></br>';
        // win.document.body.innerHTML = html;

        // form.target = winName;
        // form.submit();
        // document.body.removeChild(form);
    }
}

export const NoteTypeCategories = {
    ALL: 'All',
    CASE: 'Case',
    UW: 'UW'
};
