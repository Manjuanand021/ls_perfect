import {
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    Injector,
    ViewChild,
    ViewChildren,
    QueryList
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ParentChildRegistry, ParentChildRegistryValidator } from './parent-child-registry';
import { ViewModelUtil } from './view-model.util';
import { IViewValidator, ViewValidator, ViewValidationResult, ValidationRenderType } from './validation';
import { IViewModelChangeManager, ViewModelChangeManager } from 'life-core/view-model/view-model-change.manager';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { IViewValidationStrategy, ViewValidationStrategy, ViewValidationDelegate } from './validation';
import { ListMap } from 'life-core/model';
import { AnimationUtil } from 'life-core/util/animation';
import { BaseSaveDataDelegate, SaveDataContext, SaveDataResult } from 'life-core/service';
import { FormInput, FormErrors } from 'life-core/component/form';
import { ServerValidationMessage } from './validation/server';
import { ResolvedDataNames } from './data-resolver/resolved-data-names';
import {
    AuthorizationService,
    AuthorizationProvider,
    AuthorizationData,
    AuthorizationLevel
} from 'life-core/authorization';
import { StatefulComponent, ComponentsStateManager, ComponentsState, ComponentState } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';
import { Logger } from 'life-core/logging';
import { RouterAccessor } from 'life-core/routing';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * IViewModel interface.
 */
export interface IViewModel {
    loadData(): Promise<void>;
    saveData(context?: SaveDataContext): Promise<SaveDataResult>;
    getDataForSave(): any;
    isRoot: boolean;
    isChild: boolean;
    validate(validationRenderType?: ValidationRenderType): Promise<ViewValidationResult>;
    getViewValidationStrategy(): IViewValidationStrategy;
    getViewValidator(): IViewValidator;
    getRootViewValidator(): IViewValidator;
    hasForm: boolean;
    form: NgForm;
    getRootForm(): NgForm;
    getFormInputs(): Array<FormInput>;
    formErrors: FormErrors;
    serverMessages: Array<ServerValidationMessage>;
    messages: Array<any>;
    authorizationData: AuthorizationData;
    deactivating: boolean;
    componentTreeDeactivating: boolean;
    prepareDataToSave(context?: SaveDataContext): void;
    doCustomValidation(validationRenderType: ValidationRenderType): ViewValidationResult;
}

/**
 * Defines base ViewModel class to use for all view models (pages).
 */
export abstract class ViewModel<TData = any> implements IViewModel, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    protected injector: Injector;

    /**
     *  Parent/Child registry; keeps track of components tree
     */
    protected parentChildRegistry: ParentChildRegistry;

    /**
     *  Holds data of the view model.
     */
    public data: TData = {} as TData;

    /**
     *  Holds list data of the view model.
     */
    public listData: ListMap<any> = {};

    /**
     *  Notification/error messages
     */
    public messages: any[] = [];

    /**
     *  Server validation messages
     */
    public serverMessages: ServerValidationMessage[] = [];

    protected routerAccessor: RouterAccessor;

    protected routeName: string;

    protected saveDataDelegate: BaseSaveDataDelegate<any, any>;

    protected subscriptionTracker: SubscriptionTracker;

    protected viewValidationStrategy: IViewValidationStrategy;

    protected viewValidator: IViewValidator;

    protected viewValidationDelegate: ViewValidationDelegate;

    protected changeManager: IViewModelChangeManager;

    // remove this later - this is temporary to avoid unnecessary build errors
    protected authorizationService: AuthorizationService;

    protected i18n: I18n;

    /**
     *  Form field validation errors
     */
    private _formErrors: FormErrors = {};

    public authorizationData: AuthorizationData;

    public deactivating: boolean;

    // Angular NgForm directive for the form
    // that needs to be validated.
    @ViewChild('form')
    public form: NgForm;

    @ViewChildren(FormInput)
    protected formInputs: QueryList<FormInput>;

    @ViewChildren(StatefulComponent)
    private _statefulComponents: QueryList<StatefulComponent>;

    public componentsState: ComponentsState;
    protected componentsStateManager: ComponentsStateManager;

    protected logger: Logger;

    constructor(injector: Injector) {
        this.injector = injector;
        this.changeManager = injector.get(ViewModelChangeManager);
        this.componentsStateManager = injector.get(ComponentsStateManager, null);
        this.authorizationService = injector.get(AuthorizationService);
        this.routerAccessor = new RouterAccessor(injector.get(Router), injector.get(ActivatedRoute));
        this.subscriptionTracker = new SubscriptionTracker();
        this.logger = injector.get(Logger);
    }

    /**
     *  **First** Angular component lifecycle method in the chain:
     *		ngOnInit() -> ngAfterContentInit() -> ngAfterViewInit()
     *  Called after Angular displays the data-bound properties
     *  and sets the component's input properties.
     */
    public ngOnInit(): void {
        this.registerWithParentChildRegistry();
        this.loadData().then(() => {
            this.setupData();
        });
        this.onViewModelInitialized();
    }

    /**
     *  **Second** Angular component lifecycle method in the chain:
     *		ngOnInit() -> ngAfterContentInit() -> ngAfterViewInit()
     *  Called after Angular projects external content into the component's view.
     */
    public ngAfterContentInit(): void {
        this.setupAuthorization();
        this.getComponentsState();
    }

    /**
     *  **Third** Angular component lifecycle method in the chain:
     *		ngOnInit() -> ngAfterContentInit() -> ngAfterViewInit()
     *  Called after Angular initializes the component's views and child views.
     */
    public ngAfterViewInit(): void {
        this.setupViewValidation();
        this.routeName = this.routerAccessor.getRouteName();
        this.resetComponentsState();
    }

    /**
     *  **Last** Angular component lifecycle method.
     *  Called just before Angular destroys the component.
     *  Unsubscribe Observables and detach event handlers here to avoid memory leaks.
     */
    public ngOnDestroy(): void {
        this.subscriptionTracker.destroy();
        this.saveComponentsState();
        if (this.viewValidator) {
            this.viewValidator.destroy();
            this.viewValidationStrategy.destroy();
        }
        this.unregisterFromParentChildRegistry();
    }

    public canDeactivate(): Promise<boolean> {
        return this.validate().then(result => {
            return result == ViewValidationResult.pass ? true : false;
        });
    }

    // ParentChild Registry
    protected registerWithParentChildRegistry(): void {
        const parentChildRegistry = this.injector.get(ParentChildRegistry, undefined);
        if (this.isValidParentChildRegistry(parentChildRegistry)) {
            this.parentChildRegistry = parentChildRegistry;
            this.parentChildRegistry.register(this);
        } else {
            throw new Error(`No ParentChildRegistry provider for component ${this.constructor.name}.`);
        }
    }

    private isValidParentChildRegistry(parentChildRegistry: ParentChildRegistry): boolean {
        const parentChildRegistryValidator = new ParentChildRegistryValidator(this);
        return parentChildRegistryValidator.isValidParentChildRegistry(parentChildRegistry);
    }

    private unregisterFromParentChildRegistry(): void {
        if (this.parentChildRegistry) {
            this.parentChildRegistry.unregister(this);
        }
    }

    public get isRoot(): boolean {
        return this.parentChildRegistry.isRoot(this);
    }

    public get isChild(): boolean {
        return this.parentChildRegistry.isChild(this);
    }

    // Data Management

    /**
     * Loads data.
     */
    public loadData(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Saves updated data.
     */
    public saveData(context?: SaveDataContext): Promise<SaveDataResult> {
        if (context) {
            this.deactivating = context.isNavigatingAway;
        }
        const delegate = this.getSaveDataDelegate();
        const data = this.getDataToSave();
        if (delegate && data && this.isAnyDataDirty()) {
            this.prepareChildrenDataToSave(context);
            return delegate.updateData(data, context).then(result => {
                const saveDataResult = delegate.getSaveDataResult(result);
                if (saveDataResult != SaveDataResult.fail) {
                    this.viewValidationDelegate.resetServerMessages();
                    this.resetDirtyFlag();
                } else {
                    if (this.deactivating) {
                        this.deactivating = false;
                    }
                    this.viewValidationDelegate.setServerMessages(delegate.getErrorsFromUpdateDataResult(result));
                }
                return saveDataResult;
            });
        } else {
            this.updateChangeManagerIfFormDirty();
        }
        return Promise.resolve(SaveDataResult.noNeedToSave);
    }

    protected getDataToSave(): any {
        return this.data;
    }

    protected getSaveDataDelegate(): BaseSaveDataDelegate<any, any> {
        return null;
    }
    // we need to do this when we switch secondary tab, but didn't save data. At this time, the dirty flag on form is cleared.
    private updateChangeManagerIfFormDirty(): void {
        if (this.isDirty() && !this.changeManager.isDirty()) {
            this.changeManager.setIsDirty(true);
        }
    }

    private isAnyDataDirty(): boolean {
        return this.isDirty() || this.changeManager.isDirty();
    }
    /**
     * Returns data to be saved for this and nested ViewModel.
     */
    public getAllDataForSave(): Array<any> {
        const data = [this.getDataForSave()];
        const children = this.parentChildRegistry.getChildrenOf(this);
        for (const child of children) {
            data.push(child.getDataForSave());
        }
        return this.sanitizeDataForSave(data);
    }

    /**
     * Returns data to be saved for this ViewModel only.
     */
    public getDataForSave(): any {
        return this.data;
    }

    /**
     * to be overwrittedn by subclass to perform work before save.
     */
    public prepareDataToSave(context: SaveDataContext): void {}

    /**
     * to be overwrittedn by subclass to perform custom valiadtion before save.
     */
    public doCustomValidation(validationRenderType: ValidationRenderType): ViewValidationResult {
        return ViewValidationResult.pass;
    }

    private prepareChildrenDataToSave(context: SaveDataContext): void {
        const children = this.parentChildRegistry.getChildrenOf(this);
        for (const child of children) {
            child.prepareDataToSave(context);
        }
    }
    private sanitizeDataForSave(data: Array<Object>): any {
        return data.filter(dataItem => {
            return Object.keys(dataItem).length > 0;
        });
    }

    /**
     * Returns view-model's dirty status based on Form's status only.
     * Override this method for view-models where dirty status
     * depends on some other changes.
     */
    protected isDirty(): boolean {
        const ngForm = this.getRootForm();
        return ngForm ? ngForm.dirty : false;
    }

    protected resetDirtyFlag(): void {
        const ngForm = this.getRootForm();
        if (ngForm && ngForm.dirty) {
            ngForm.form.markAsPristine();
        }
    }

    public get componentTreeDeactivating(): boolean {
        let anyParentDeactivating: boolean;
        if (this.parentChildRegistry) {
            const parents = this.parentChildRegistry.getParentsOf(this);
            anyParentDeactivating = parents.find(parent => parent.deactivating) != undefined;
        } else {
            anyParentDeactivating = false;
        }
        return this.deactivating || anyParentDeactivating;
    }

    /**
     * Setup data before view is shown.
     */
    protected setupData(): void {}

    // Authorization

    /**
     * Setup authorization
     */
    protected setupAuthorization(): void {
        const authorizationProvider = this.injector.get(AuthorizationProvider, null) as AuthorizationProvider;
        this.authorizationData = authorizationProvider
            ? authorizationProvider.getAuthorizationData()
            : new AuthorizationData(AuthorizationLevel.EDIT);
    }

    // Data resolve
    /**
     *  Sets data retrieved in data resolver to the current view model.
     *  @param setToProperty property name to assign resolved data to
     *  @param resolvedDataName property name of the resolved data stored under route
     */
    protected setResolvedData(setToProperty: string, resolvedDataName: string = ResolvedDataNames.data): void {
        this.setData(setToProperty, this.routerAccessor.getDataFromRoute(resolvedDataName));
    }

    /**
     *  Sets list data retrieved in list data resolver to the current view model.
     *  @param resolvedListDataName property name of the resolved list data stored under route
     */
    protected setResolvedListData(resolvedListDataName: string = ResolvedDataNames.listData): void {
        this.setListData(this.routerAccessor.getDataFromRoute(resolvedListDataName));
    }

    /**
     *  Sets meta data retrieved in meta data resolver to the current view model.
     *  @param resolvedMetaDataName property name of the resolved meta data stored under route
     */
    protected setResolvedMetaData(resolvedMetaDataName: string = ResolvedDataNames.metaData): void {
        this.setListData(this.routerAccessor.getDataFromRoute(resolvedMetaDataName));
    }

    /**
     *  Sets data to the view model's 'data{}' object.
     *  @param setToProperty property name to assign data to
     *  @param data to set
     */
    protected setData(setToProperty: string, data: any): void {
        this.data[setToProperty] = data;
    }

    /**
     * Sets list data to the current view model.
     */
    protected setListData<T>(listData: ListMap<T>): void {
        Object.assign(this.listData, listData);
    }

    // Validation

    protected needToValidate(): boolean {
        return this.getViewValidationStrategy().needToValidate();
    }

    protected isValidatable(): boolean {
        return this.hasForm;
    }

    public getViewValidationStrategy(): IViewValidationStrategy {
        return this.viewValidationStrategy;
    }

    private setupViewValidation(): void {
        this.setViewValidationStrategy();
        this.viewValidator = new ViewValidator({
            injector: this.injector,
            viewModel: this,
            parentChildRegistry: this.parentChildRegistry
        });
        this.viewValidationDelegate = new ViewValidationDelegate(this, this.parentChildRegistry.root, this.injector);
    }

    private setViewValidationStrategy(): void {
        this.viewValidationStrategy = this.injector.get(ViewValidationStrategy);
    }

    public getFormInputs(): Array<FormInput> {
        return this.formInputs.toArray();
    }

    protected onFormInputsChange(): void {
        this.getRootViewValidator().onFormInputsChange();
    }

    public get formErrors(): FormErrors {
        return this._formErrors;
    }

    public set formErrors(value: FormErrors) {
        this._formErrors = value;
        this.updateFormErrors(this._formErrors);
    }

    protected updateFormErrors(formErrors: FormErrors): void {
        this.formInputs.forEach(formInput => {
            formInput.formErrors = formErrors;
        });
    }

    public get hasForm(): boolean {
        return !!this.getRootForm();
    }

    public getRootForm(): NgForm {
        return this.parentChildRegistry ? this.parentChildRegistry.root.form : null;
    }

    public validate(
        validationRenderType: ValidationRenderType = ValidationRenderType.ifNeeded
    ): Promise<ViewValidationResult> {
        if (this.isValidatable() && this.needToValidate()) {
            return this.viewValidationDelegate.validate(validationRenderType).then(result => {
                if (result == ViewValidationResult.pass) {
                    return this.performCustomValidationOnChildren(validationRenderType);
                } else {
                    return ViewValidationResult.fail;
                }
            });
        } else {
            return Promise.resolve(ViewValidationResult.pass);
        }
    }

    private performCustomValidationOnChildren(validationRenderType: ValidationRenderType): ViewValidationResult {
        const children = this.parentChildRegistry.getChildrenOf(this);
        for (const child of children) {
            if (child.doCustomValidation(validationRenderType) == ViewValidationResult.fail) {
                return ViewValidationResult.fail;
            }
        }
        return ViewValidationResult.pass;
    }

    public getViewValidator(): IViewValidator {
        return this.viewValidator;
    }

    public getRootViewValidator(): IViewValidator {
        return this.isRoot ? this.viewValidator : this.parentChildRegistry.root.getViewValidator();
    }

    protected resetValidationMessages(): void {
        this.messages = [];
    }

    protected onViewModelInitialized(): void {
        if (this.isRoot) {
            AnimationUtil.scrollToTop();
        }
    }

    protected renderValidationMessages(): void {
        if (!ViewModelUtil.isDialogViewModel(this)) {
            this.viewValidator.renderValidationMessages();
        }
    }

    /**
     * Logs and shows data service call error message.
     */
    // protected showErrorMessage(reason: any): void {
    //     this.messages = [reason];
    //     console.error(`ViewModel -> error: ${reason}`);
    // }

    // Visual Components State
    private getComponentsState(): void {
        this.componentsState = this.componentsStateManager
            ? this.componentsStateManager.getAllComponentsState()
            : new Map<string, ComponentState>();
    }

    private saveComponentsState(): void {
        if (this.componentsStateManager && this.needToSaveComponentsState()) {
            this.componentsStateManager.saveComponentsState(this._statefulComponents);
        }
    }

    private resetComponentsState(): void {
        if (this.componentsStateManager) {
            setTimeout(_ => {
                // We assume by this time all components of the view finished restoring their states,
                // and their state could be deleted from the global states collection.
                this.componentsStateManager.deleteComponentsState(this._statefulComponents);
            }, 0);
        }
    }

    protected needToSaveComponentsState(): boolean {
        return true;
    }

    public trackSubscription(s: Subscription): void {
        this.subscriptionTracker.track(s);
    }
}
