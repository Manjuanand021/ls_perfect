import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { IViewModel } from '../view-model';
import { ViewModelUtil } from '../view-model.util';
import { ServerValidationUtil } from './server';
import { ViewValidationResult, ViewValidationParams, ValidationRenderType } from './view-validation.model';
import { ViewValidationChannels } from './view-validation-channels';
import { MessagingService } from 'life-core/messaging';
import { LifeError } from 'life-core/service';

export class ViewValidationDelegate {
    private _viewModel: IViewModel;
    private _rootViewModel: IViewModel;
    private _router: Router;
    private _messagingService: MessagingService;
    private _validationRenderType: ValidationRenderType;

    constructor(viewModel: IViewModel, rootViewModel: IViewModel, injector: Injector) {
        this._viewModel = viewModel;
        this._rootViewModel = rootViewModel;
        this._router = injector.get(Router);
        this._messagingService = injector.get(MessagingService);
    }

    public validate(validationRenderType: ValidationRenderType): Promise<ViewValidationResult> {
        this._validationRenderType = validationRenderType;
        const validationParams = this.getValidationParams();
        const viewValidator = this._viewModel.getRootViewValidator();
        return viewValidator.validate(validationParams).then(validationResponse => {
            this._viewModel.messages = validationResponse.formValidationMessages;
            if (this.needToRenderValidationMessages()) {
                this.renderValidationMessages();
            }
            return validationResponse.hasError ? ViewValidationResult.fail : ViewValidationResult.pass;
        });
    }

    public setServerMessages(serverErrors: LifeError[]): void {
        this._rootViewModel.serverMessages = serverErrors
            ? ServerValidationUtil.formatServerMessages(serverErrors)
            : [];
        this.notifyServerValidationMessagesChange();
        if (this._validationRenderType != ValidationRenderType.never) {
            this.renderValidationMessages();
        }
    }

    public resetServerMessages(): void {
        this._rootViewModel.serverMessages = [];
        this.notifyServerValidationMessagesChange();
    }

    private notifyServerValidationMessagesChange(): void {
        this._messagingService.publish(
            ViewValidationChannels.ServerValidationMessagesChange,
            this._rootViewModel.serverMessages
        );
    }

    private renderValidationMessages(): void {
        if (this.canRenderValidationMessages()) {
            this._viewModel.getViewValidator().renderValidationMessages();
        }
    }

    private canRenderValidationMessages(): boolean {
        return this._viewModel.messages.length > 0 || this._rootViewModel.serverMessages.length > 0;
    }

    private needToRenderValidationMessages(): boolean {
        let needToRender =
            !ViewModelUtil.isDialogViewModel(this._viewModel) &&
            this._validationRenderType != ValidationRenderType.never;
        if (needToRender) {
            needToRender =
                (this._viewModel.messages && this._viewModel.messages.length > 0) ||
                (this._validationRenderType == ValidationRenderType.allways &&
                    this._rootViewModel.serverMessages.length > 0);
        }
        return needToRender;
    }

    protected getValidationParams(): ViewValidationParams {
        return new ViewValidationParams(this.getRouterUrl(), this._viewModel, true, null);
    }

    protected getRouterUrl(): string {
        return this._router.url;
    }
}
