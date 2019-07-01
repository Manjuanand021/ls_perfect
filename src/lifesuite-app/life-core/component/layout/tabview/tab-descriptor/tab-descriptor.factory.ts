import { TabDescriptor, TabDefinition } from 'life-core/component/layout/tabview/model';

export abstract class TabDescriptorFactory {
    protected createTabDescriptor(params: {
        tab: TabDefinition;
        objectId?: string;
        title?: string;
        leftIcon?: string;
        route?: string;
        contentRoute?: string;
        disabled?: boolean;
        selected?: boolean;
    }): TabDescriptor {
        const tabDescriptor = new TabDescriptor(params);
        tabDescriptor.title = this.getTabDescriptorTitle(params.tab);
        return tabDescriptor;
    }

    protected abstract getTabDescriptorTitle(tab: TabDefinition): string;
}
