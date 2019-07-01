import { Directive, Input, Host, AfterContentInit } from '@angular/core';

import { ContainerType, ContainerSelector } from './container-type';

export abstract class SettableContainerComponent {
    public abstract setContainer(containerSelector: ContainerSelector): void;
}

@Directive({
    selector: '[container]'
})
/**
 * Directive to set container for components with popover sub-component, such as InputDate and Dropdown.
 * This is required to correctly show such popovers inside dialogs.
 */
export class SettableContainerDirective implements AfterContentInit {
    @Input('container') public containerType: ContainerType;

    protected settableContainerComponent: SettableContainerComponent;

    constructor(@Host() settableContainerComponent: SettableContainerComponent) {
        this.settableContainerComponent = settableContainerComponent;
    }

    public ngAfterContentInit(): void {
        this.setupComponent();
    }

    protected setupComponent(): void {
        this.settableContainerComponent.setContainer(ContainerSelector[this.containerType]);
    }
}
