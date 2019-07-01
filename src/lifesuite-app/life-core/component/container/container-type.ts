import { EnumUtil } from 'life-core/util/lang';

export type ContainerType = 'body' | 'dialog' | 'popover';

export enum ContainerSelector {
    body = 'body',
    dialog = '.modal',
    popover = '.popover'
}

export function isContainerSelector(selector: string): boolean {
    return EnumUtil.isValueInEnum(ContainerSelector, selector);
}
