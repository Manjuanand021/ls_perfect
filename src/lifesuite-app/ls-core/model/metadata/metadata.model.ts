import { ListItem } from 'life-core/model';

export class MetadataItem extends ListItem {
    public externalCode: string;

    constructor(label: string, value: string, externalCode?: string) {
        super(label, value);
        this.externalCode = externalCode;
    }
}
