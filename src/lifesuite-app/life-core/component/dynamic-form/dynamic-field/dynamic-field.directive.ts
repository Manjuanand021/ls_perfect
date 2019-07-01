import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    Output,
    Inject,
    EventEmitter,
    OnChanges,
    OnInit,
    Optional,
    ViewContainerRef,
    forwardRef,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DirectResolvedData } from 'life-core/component/shared';
import { AuthorizationData, AuthorizationProvider, AuthorizationLevel } from 'life-core/authorization';
import { Field } from '../model/field.interface';
import { FieldConfig } from '../model/field-config.interface';

import { DynamicFormInput } from '../dynamic-form-input/dynamic-form-input';
import { DYNAMIC_FIELDS_REGISTRY, DynamicFieldsRegistryType } from './dynamic-fields.registry';
import { FormFieldEvent } from '../event/dynamic-form.event';

@Directive({
    selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit, OnDestroy {
    @Input()
    public config: FieldConfig;

    @Input()
    public data: Object;

    @Input()
    public resolvedData: DirectResolvedData;

    @Input()
    public index: string;

    @Output()
    public fieldEvent: EventEmitter<FormFieldEvent> = new EventEmitter<FormFieldEvent>();

    public component: ComponentRef<DynamicFormInput>;

    private resolver: ComponentFactoryResolver;

    private container: ViewContainerRef;

    private dynamicFieldsRegistry: DynamicFieldsRegistryType;

    private _authorizationProvider: AuthorizationProvider;

    private _authorizationData: AuthorizationData;

    private _eventSourceSubscription: Subscription;

    constructor(
        resolver: ComponentFactoryResolver,
        container: ViewContainerRef,
        @Inject(forwardRef(() => DYNAMIC_FIELDS_REGISTRY)) dynamicFieldsRegistry: DynamicFieldsRegistryType,
        @Optional() authorizationProvider: AuthorizationProvider
    ) {
        this.resolver = resolver;
        this.container = container;
        this.dynamicFieldsRegistry = dynamicFieldsRegistry;
        this._authorizationProvider = authorizationProvider;
    }

    public ngOnChanges(): void {
        if (this.component) {
            this.updateComponent(this.component);
        }
    }

    public ngOnInit(): void {
        if (!this.dynamicFieldsRegistry[this.config.type]) {
            const supportedTypes = Object.keys(this.dynamicFieldsRegistry).join(', ');
            throw new Error(
                `Trying to use an unsupported type (${this.config.type}).
            	 Supported types: ${supportedTypes}`
            );
        }
        this.component = this.createComponent();
        this.setupAuthorization();
        this.updateComponent(this.component);
    }

    public ngOnDestroy(): void {
        if (this._eventSourceSubscription) {
            this._eventSourceSubscription.unsubscribe();
        }
        this.component.destroy();
        this.container = undefined;
    }

    private createComponent(): ComponentRef<DynamicFormInput> {
        const factory = this.resolver.resolveComponentFactory<DynamicFormInput>(
            this.dynamicFieldsRegistry[this.config.type]
        );
        const componentRef = this.container.createComponent(factory);
        if (componentRef.instance.eventSource) {
            this._eventSourceSubscription = componentRef.instance.eventSource.subscribe(value => {
                this.onEvent(value);
            });
        }
        return componentRef;
    }

    private updateComponent(component: ComponentRef<DynamicFormInput>): void {
        component.instance.config = this.config;
        component.instance.data = this.getData();
        component.instance.index = this.index;
        component.instance.authorizationData = this._authorizationData;
    }

    private getData(): Object {
        let data = this.data;
        if (this.config.dataPath) {
            const dataPathParts = this.config.dataPath.split('.');
            while (dataPathParts.length > 0) {
                data = data[dataPathParts.shift()];
            }
        }
        return data;
    }

    private onEvent(event: FormFieldEvent): void {
        this.fieldEvent.emit(event);
    }

    private setupAuthorization(): void {
        this._authorizationData = this._authorizationProvider
            ? this._authorizationProvider.getAuthorizationData()
            : new AuthorizationData(AuthorizationLevel.EDIT);
    }
}
