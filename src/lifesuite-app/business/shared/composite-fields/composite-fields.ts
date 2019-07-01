const CompositeFieldsMap: { readonly [field: string]: string[] } = {
    InsuredNameFull: ['InsuredLastName', 'InsuredFirstName', 'InsuredMiddleName'],
    UnderwriterName: ['UnderwriterLastName', 'UnderwriterFirstName'],
    ServiceAssociateNameShort: ['ServiceAssociateLastName', 'ServiceAssociateFirstName'],
    UnderwriterNameShort: ['UnderwriterLastName', 'UnderwriterFirstName'],
    InsuredNameShort: ['InsuredNameShort'],
    ServiceAssociateName: ['ServiceAssociateLastName', 'ServiceAssociateFirstName'],
    AuthorName: ['AuthorLastName', 'AuthorFirstName'],
    ReferredToName: ['ReferredToLastName', 'ReferredToFirstName'],
    ApplicantName: ['ApplicantLastName', 'ApplicantFirstName'],
    CaseManagerName: ['CaseManagerLastName', 'CaseManagerFirstName'],
    Agent: ['AgentLastName', 'AgentFirstName'],
    InsuredName: ['InsuredLastName', 'InsuredFirstName']
};

export class CompositeFields {
    /**
     *Get mapping information for composite field
     * @param field name of the field to look up mapping for
     * @return array of one ore more field names.
     * For a composite field return array of fields included in a composite field;
     * For a simple field return an array with the field name itself
     */
    public static getFieldMap(field: string): string[] {
        return CompositeFieldsMap[field] || [field];
    }
}
