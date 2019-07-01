export const PolicyStatusType = {
    Total: 0,
    NewBusiness: 1,
    Pending: 2,
    PendingMail: 3,
    FinalAct: 4,
    Hold: 5,
    ToBeIssued: 6,
    Count: 7
};

export const enum PolicyStatusLabelType {
    Total_ShortForm = 'total.short',
    NewBusiness_ShortForm = 'newbusiness.short',
    Pending_ShortForm = 'pending.short',
    PendingMail_ShortForm = 'pendingmail.short',
    FinalAct_ShortForm = 'finalaction.short',
    Hold_ShortForm = 'hold.short',
    ToBeIssued_ShortForm = 'tobeissued.short'
}

export const PolicyAgingRangeType = {
    Total: 0,
    Lower: 1,
    MidToLower: 2,
    Middle: 3,
    MidToUpper: 4,
    Upper: 5,
    Highest: 6,
    Count: 7
};
