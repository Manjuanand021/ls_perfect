import { Component, Input, ViewChildren, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { LfButton } from 'life-core/component/button';
import { DialogButton } from '../shared/dialog-button';

@Component({
    selector: 'dialog-buttonbar',
    templateUrl: './dialog-buttonbar.html'
})
export class DialogButtonBar implements AfterViewInit, OnDestroy {
    @Input()
    public buttons: Array<DialogButton>;
    @Output()
    public buttonClick: EventEmitter<any> = new EventEmitter();
    @ViewChildren(LfButton)
    private _buttonComponents: LfButton[];
    private _messagingService: IMessagingService;
    private _messagingSubscription: Subscription;

    constructor(messagingService: MessagingService) {
        this._messagingService = messagingService;
        this.buttons = [];
        this.setupSubscriptions();
    }

    private setupSubscriptions(): void {
        this._messagingSubscription = this._messagingService.subscribe(
            DialogButtonBarChannels.EmulateButtonClick,
            (buttonType?: string) => this.emulateButtonClick(buttonType)
        );
    }

    public emulateButtonClick(buttonType?: string): void {
        // if button type is not specified, the default button will be used
        const button = buttonType ? this.getButton(buttonType) : this.getDefaultButton();
        if (button) {
            this.setFocusOnButton(button);
            this.onDialogButtonClick(button);
        }
    }

    public onDialogButtonClick(button: DialogButton): void {
        this.buttonClick.emit(button);
    }

    private getButton(type: string): DialogButton {
        return this.buttons.find(button => button.type == type);
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.setFocus();
        }, 0);
    }

    private setFocus(): void {
        const defaultButton = this.getDefaultButton();
        if (defaultButton) {
            this.setFocusOnButton(defaultButton);
        }
    }

    private setFocusOnButton(button: DialogButton): void {
        const defaultButtonComponent = this.getButtonComponent(button);
        defaultButtonComponent.focus();
    }

    private getButtonComponent(dialogButton: DialogButton): LfButton {
        return this._buttonComponents.find(button => {
            return button.label == dialogButton.label;
        });
    }

    private getDefaultButton(): DialogButton {
        return this.buttons.find(button => {
            return button.options && button.options.isDefault;
        });
    }

    public ngOnDestroy(): void {
        if (this._messagingService.channelExist(DialogButtonBarChannels.EmulateButtonClick)) {
            this._messagingService.closeChannel(DialogButtonBarChannels.EmulateButtonClick);
        }
        this._messagingSubscription.unsubscribe();
    }
}

export const DialogButtonBarChannels = {
    EmulateButtonClick: 'button-click'
};
