export type SystemSettingEntryType = { name: string; type: string };

export type SystemSettingType = { readonly [key: string]: SystemSettingEntryType };

export const SystemSetting: SystemSettingType = {
    TaxIDMasking: { name: 'TaxIDMasking', type: 'System' },
    HtmlNumberLocale: { name: 'HtmlNumberLocale', type: 'HtmlFormat' },
    HtmlDateFormat: { name: 'HtmlDateFormat', type: 'HtmlFormat' },
    HtmlTimeFormat: { name: 'HtmlTimeFormat', type: 'HtmlFormat' },
    CapturePerformanceMetrics: { name: 'CapturePerformanceMetrics', type: 'System' },
    LSLegacyUrl: { name: 'LSLegacyUrl', type: 'System' },
    DefaultNoteOrderNewestToOldest: { name: 'DefaultNoteOrderNewestToOldest', type: 'System' },
    WorksheetFANoteRequired: { name: 'WorksheetFANoteRequired', type: 'System' },
    FinalActionReasonRequired: { name: 'FinalActionReasonRequired', type: 'System' }
};

export const StartupSetting = {
    ClientLogLevel: 'ClientLogLevel',
    ClientLogDestinations: 'ClientLogDestinations'
};
