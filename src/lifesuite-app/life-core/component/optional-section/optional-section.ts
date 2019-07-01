import { Component, Input, Output, Type, ViewChild, EventEmitter, forwardRef } from '@angular/core';

import { Compose } from 'life-core/component/compose';
import { ButtonActionType } from 'life-core/component/shared';
import { AuthorizationLevel } from 'life-core/authorization';
import { ISecureComponent, AuthorizationUtil, SecureComponent } from 'life-core/component/authorization';
import { OptionalSectionButton, OptionalSectionButtonType } from './model/optional-section-button';
import { OptionalSectionButtonLabels } from './model/optional-section-button-labels';

@Component({
    selector: 'optional-section',
    templateUrl: './optional-section.html',
    styleUrls: ['./optional-section.css'],
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => OptionalSection) }]
})
export class OptionalSection implements ISecureComponent {
    @Input()
    public name: string;

    @Input()
    public dataExists: boolean;

    @Input()
    public item: any;

    @Input()
    public itemComponentType: Type<any>;

    @Output()
    public createItem: EventEmitter<any> = new EventEmitter();

    @Output()
    public removeItem: EventEmitter<any> = new EventEmitter();

    @ViewChild(Compose)
    private refCompose: Compose;

    private _buttons: OptionalSectionButton[];
    private _optionalSectionButtonLabels: OptionalSectionButtonLabels;
    private _authorizationLevel: AuthorizationLevel;

    private _hidden: boolean;

    constructor(optionalSectionButtonLabels: OptionalSectionButtonLabels) {
        this._optionalSectionButtonLabels = optionalSectionButtonLabels;
        this.createButtons();
    }

    public onCreateItem(): void {
        this.createItem.emit();
    }

    public onRemoveItem(): void {
        this.removeItem.emit();
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public getItemViewModel(): any {
        return this.refCompose.component;
    }

    private createButtons(): void {
        this._buttons = [
            new OptionalSectionButton({
                type: OptionalSectionButtonType.ADD,
                actionType: ButtonActionType.DataChange,
                handler: () => {
                    this.onCreateItem();
                }
            }),
            new OptionalSectionButton({
                type: OptionalSectionButtonType.DELETE,
                actionType: ButtonActionType.DataChange,
                handler: () => {
                    this.onRemoveItem();
                }
            })
        ];
        this.setupButtons();
    }

    @Input()
    public set buttons(buttons: OptionalSectionButton[]) {
        this._buttons = buttons;
        this.setupButtons();
    }

    public get buttons(): OptionalSectionButton[] {
        return this._buttons;
    }

    private setupButtons(): void {
        for (const button of this._buttons) {
            this.setupButton(button);
        }
    }

    private setupButton(button: OptionalSectionButton): void {
        if (!button.label) {
            button.label = this._optionalSectionButtonLabels.byType[button.type];
        }
    }

    public isButtonDisabled(button: OptionalSectionButton): boolean {
        return button.type == OptionalSectionButtonType.ADD
            ? this.dataExists
            : button.type == OptionalSectionButtonType.DELETE
            ? !this.dataExists
            : false;
    }

    public onButtonClick(button: OptionalSectionButton): void {
        if (button.handler) {
            button.handler();
        }
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.setupButtonsAuthorization();
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateHidden(value: boolean): void {
        this._hidden = !AuthorizationUtil.isLayoutComponentVisible(this._authorizationLevel) ? true : value;
    }

    private setupButtonsAuthorization(): void {
        this.buttons.forEach(button => {
            if (button.authorizationLevel == undefined) {
                this.setButtonAuthorizationLevel(button);
            }
        });
    }

    private setButtonAuthorizationLevel(button: OptionalSectionButton): void {
        button.authorizationLevel =
            this.authorizationLevel == AuthorizationLevel.EDIT || this.authorizationLevel == undefined
                ? this.authorizationLevel
                : AuthorizationLevel.NONE;
    }
}
