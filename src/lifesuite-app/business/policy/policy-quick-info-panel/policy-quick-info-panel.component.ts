import { Component, Injector, Input } from '@angular/core';

import { LsDynamicFormViewModel } from 'ls-core/component/dynamic-form';
import { PolicySubscriber, AppSession } from 'ls-core/session';
import { PolicyDTO, MetadataItem } from 'ls-core/model';
import { FormLayoutConfig } from 'life-core/component/dynamic-form';
import { ListMap } from 'life-core/model';
import { DirectDataResolve } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicyQuickInfoFormDataBuilder, PolicyQuickInfoFormFields, PolicyQuickInfoFieldsLoader } from './form';
import {
    ApplicantStatusResolver,
    LineofBusinessDescriptionResolver,
    ApplicationTypeDescriptionResolver,
    PolicyAssociationDescriptionResolver,
    TPANameResolver,
    ServiceAssociateResolver,
    UnderwriterResolver,
    ApplicantsCountResolver,
    ReceivedRequirementsListResolver,
    OutstandingRequirementsListResolver,
    RelatedPoliciesCountResolver,
    AgentPhoneResolver,
    AgentNameResolver,
    AgentEmailResolver
} from './form/resolvers';
import { PolicyQuickInfoPanelMetaDataResolver } from './policy-quick-info-panel-metadata.resolver';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Component({
    selector: 'policy-quick-info-panel',
    templateUrl: './policy-quick-info-panel.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }]
})
export class PolicyQuickInfoPanelComponent extends LsDynamicFormViewModel {
    @Input() public index: string;
    public formLayoutConfig: FormLayoutConfig = {
        fieldsPerRow: 1
    };

    private _policy: PolicyDTO;
    private _policyQuickInfoFormFields: PolicyQuickInfoFormFields;
    private _policyQuickInfoFieldsLoader: PolicyQuickInfoFieldsLoader;
    private _policyQuickInfoFormDataBuilder: PolicyQuickInfoFormDataBuilder;
    private _directDataResolves: Array<DirectDataResolve>;
    private _policyQuickInfoPanelMetaDataResolver: PolicyQuickInfoPanelMetaDataResolver;
    private _metaDataInformation: ListMap<MetadataItem>;
    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        policyQuickInfoPanelMetaDataResolver: PolicyQuickInfoPanelMetaDataResolver,
        policyQuickInfoFormFields: PolicyQuickInfoFormFields,
        policyQuickInfoFieldsLoader: PolicyQuickInfoFieldsLoader,
        policyQuickInfoFormDataBuilder: PolicyQuickInfoFormDataBuilder,
        appSession: AppSession
    ) {
        super(injector);
        this._policyQuickInfoFormFields = policyQuickInfoFormFields;
        this._policyQuickInfoFieldsLoader = policyQuickInfoFieldsLoader;
        this._policyQuickInfoFormDataBuilder = policyQuickInfoFormDataBuilder;
        this._policyQuickInfoPanelMetaDataResolver = policyQuickInfoPanelMetaDataResolver;
        const appSesson = appSession;
        this.subscriptionTracker.track(
            appSesson.policyObservable.subscribe(policy => {
                if (policy) {
                    this._policy = policy;
                    this.setFormData();
                }
            })
        );
    }

    protected initFormData(): void {
        // do nothing as setting form data is handled in this class itself
    }

    private _setDirectDataResolves(): void {
        this._directDataResolves = [
            {
                resolveName: 'ApplicantStatusResolver',
                resolverClass: ApplicantStatusResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'LineofBusinessResolver',
                resolverClass: LineofBusinessDescriptionResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'ApplicationTypeResolver',
                resolverClass: ApplicationTypeDescriptionResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'PolicyAssociationResolver',
                resolverClass: PolicyAssociationDescriptionResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'TPANameResolver',
                resolverClass: TPANameResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'ServiceAssociateResolver',
                resolverClass: ServiceAssociateResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'UnderwriterResolver',
                resolverClass: UnderwriterResolver,
                context: this._metaDataInformation
            },
            { resolveName: 'ApplicantsCountResolver', resolverClass: ApplicantsCountResolver },
            {
                resolveName: 'ReceivedRequirementsListResolver',
                resolverClass: ReceivedRequirementsListResolver,
                context: this._metaDataInformation
            },
            {
                resolveName: 'OutstandingRequirementsListResolver',
                resolverClass: OutstandingRequirementsListResolver,
                context: this._metaDataInformation
            },
            { resolveName: 'RelatedPoliciesCountResolver', resolverClass: RelatedPoliciesCountResolver },
            { resolveName: 'AgentPhoneResolver', resolverClass: AgentPhoneResolver },
            { resolveName: 'AgentNameResolver', resolverClass: AgentNameResolver },
            { resolveName: 'AgentEmailResolver', resolverClass: AgentEmailResolver }
        ];
    }

    protected setFormData(): void {
        this.loadMetaData().then(metaData => {
            this._metaDataInformation = metaData;
            this._setDirectDataResolves();
            this._policyQuickInfoFormDataBuilder
                .build(this._policy, this._directDataResolves)
                .then(policyQuickFormData => {
                    this.formData = policyQuickFormData;
                    this.resolvedData = policyQuickFormData.resolvedData;
                    this.setFormFields();
                });
        });
    }

    private loadMetaData(): Promise<ListMap<MetadataItem>> {
        return this._policyQuickInfoPanelMetaDataResolver.directResolve();
    }

    protected setFormFields(): Promise<void> {
        return this.loadFormFields().then(() => {
            this.formFields = this.copyFormFields(this._policyQuickInfoFormFields.get());
            return Promise.resolve();
        });
    }

    private loadFormFields(): Promise<void> {
        return this._policyQuickInfoFieldsLoader.load();
    }
}
