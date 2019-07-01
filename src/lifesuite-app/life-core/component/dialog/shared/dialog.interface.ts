import { EventEmitter } from '@angular/core';

import { DialogButton, DialogButtonType } from './dialog-button';
import { DirectResolvedData } from 'life-core/component/shared';

/**
 * Interface to be implemented by all Dialog ViewModels
 */
export interface IDialogViewModel {
    /**
     * Communicate result back to caller when dialog button clicked.
     */
    onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult>;
}

/**
 * Optional Interfaces for Dialog ViewModels
 */
export interface IDialogResultEventEmitter {
    /**
     * Communicate result back to caller in buttonless dialogs.
     */
    dialogResultEventEmitter: EventEmitter<DialogViewModelResult>;
}

export function implementsDialogResultEventEmitter(
    component: IDialogViewModel | IDialogResultEventEmitter
): component is IDialogResultEventEmitter {
    return (<IDialogResultEventEmitter>component).dialogResultEventEmitter !== undefined;
}

export interface IDialogButtonChangeEventEmitter {
    /**
     * Communicate dialog button changes back to dialog component.
     */
    dialogButtonChangeEventEmitter: EventEmitter<DialogButtonChangeEvent>;
}

export function implementsDialogButtonChangeEventEmitter(
    component: IDialogViewModel | IDialogButtonChangeEventEmitter
): component is IDialogButtonChangeEventEmitter {
    return (<IDialogButtonChangeEventEmitter>component).dialogButtonChangeEventEmitter !== undefined;
}

/**
 * Data passed to a Dialog.
 */
export class DialogData {
    public parameterData?: any;
    public resolvedData?: DirectResolvedData;

    constructor(parameterData: any, resolvedData: DirectResolvedData) {
        this.parameterData = parameterData;
        this.resolvedData = resolvedData;
    }
}

/**
 * Result returned by dialog view model.
 */
export class DialogViewModelResult {
    public returnValue?: any;
    public closeDialog?: boolean;
    public dialogDirty?: boolean;

    constructor(returnValue?: any, closeDialog?: boolean, isDialogDirty?: boolean) {
        this.returnValue = returnValue;
        this.closeDialog = closeDialog;
        this.dialogDirty = isDialogDirty;
    }
}

/**
 * Result returned by a Dialog.
 */
export class DialogResult {
    public buttonId?: string;
    public returnValue?: any;
    public dialogDirty?: boolean;

    constructor(buttonId?: string, returnValue?: any, isDialogDirty?: boolean) {
        this.buttonId = buttonId;
        this.returnValue = returnValue;
        this.dialogDirty = isDialogDirty;
    }
}

/**
 * Event data for dialog button change events.
 */
export class DialogButtonChangeEvent {
    public type: DialogButtonType;
    public disabled?: boolean;
    public hidden?: boolean;

    constructor({ type, disabled, hidden }: { type: DialogButtonType; disabled?: boolean; hidden?: boolean }) {
        this.type = type;
        this.disabled = disabled;
        this.hidden = hidden;
    }
}

export interface DialogParams {
    title?: string;
    buttons?: DialogButton[];
}

/**
 * Dialog width size; 'md' by default.
 */
export enum DialogSize {
    small = 'sm',
    medium = 'md',
    large = 'lg'
}

export const DefaultDialogSize = DialogSize.medium;
