import { Component, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogData, DialogViewModelResult } from 'life-core/component/dialog';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { FormInputUtil, CombinedFormInputs } from 'life-core/component/form';
import { PanelChannels } from 'life-core/component/layout/panel';
import { DOMUtil } from 'life-core/util/dom';

import { ValidationMessageData } from '../view-validation.model';
import { FormValidationMessage } from '../form/view-form.validator';
import { ServerValidationMessage } from '../server';
import { FormInputFocus } from './form-input-focus';

@Component({
    selector: 'view-validation-dialog',
    templateUrl: './view-validation.dialog.html',
    styleUrls: ['./view-validation.dialog.css']
})
export class ViewValidationDialog implements ICompose, IDialogViewModel, OnDestroy {
    public formMessages: FormValidationMessage[];
    public serverMessages: ServerValidationMessage[];

    private _messagingService: IMessagingService;
    private _combinedFormInputs: CombinedFormInputs;
    private _validationDataSubscription: Subscription;
    private _formInputFocus: FormInputFocus;

    constructor(messagingService: MessagingService, formInputFocus: FormInputFocus) {
        this._messagingService = messagingService;
        this._formInputFocus = formInputFocus;
    }

    public setModel(model: DialogData): void {
        this._validationDataSubscription = model.parameterData.subscribe(result => {
            const data = result.validationMessages as ValidationMessageData;
            this._combinedFormInputs = result.formInputs as CombinedFormInputs;
            this.formMessages = data.formMessages;
            this.serverMessages = data.serverMessages;
        });
    }

    public onMessageClick(event: Event): void {
        event.preventDefault();
        const messageElement = <HTMLElement>event.target;
        this.moveControlInFocus(messageElement);
    }

    public ngOnDestroy(): void {
        this._validationDataSubscription.unsubscribe();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(null);
    }

    private moveControlInFocus(messageElement: HTMLElement): void {
        const dialogElement = DOMUtil.getClosestElement(messageElement, '.popover');
        const controlName = this.getMessageLinkId(messageElement);
        const formInput = FormInputUtil.getFormInputByControlName(controlName, this._combinedFormInputs);
        if (formInput) {
            const enclosingPanelIds = FormInputUtil.getEnclosingPanelIds(formInput);
            enclosingPanelIds.forEach(panelId => {
                this._messagingService.publish(PanelChannels.ExpandPanel, panelId);
            });
            this._formInputFocus.setFocus(formInput, dialogElement);
        }
    }

    private getMessageLinkId(messageElement: HTMLElement): string {
        return DOMUtil.getClosestElement(messageElement, 'a').id;
    }
}
