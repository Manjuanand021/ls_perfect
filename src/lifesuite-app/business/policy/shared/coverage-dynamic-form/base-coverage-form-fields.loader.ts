import { FieldConfig, ListFieldConfig, FormListFieldsUtil } from 'life-core/component/dynamic-form';
import { FormLoadFieldsService, FormFieldNames, DynamicFormFieldsManager } from 'ls-core/component/dynamic-form';
import { PolicyDTO, CoverageDTO, MetadataItem } from 'ls-core/model';
import { MetadataLoader } from 'ls-core/util';
import { ListUtil } from 'life-core/util';
import { ListItem } from 'life-core/model';
import { PlanCoverageFormFields } from './plan-coverage-form-fields';
import { CoverageFormDataBuilder, CoverageFormData } from './coverage-form-data.builder';

export abstract class BaseCoverageFormFieldsLoader {
    protected _formLoadFieldsService: FormLoadFieldsService;
    protected _metadataLoader: MetadataLoader;
    protected _planCoverageFormFields: PlanCoverageFormFields;
    protected _dynamicFormFieldsManager: DynamicFormFieldsManager;

    constructor(
        formLoadFieldsService: FormLoadFieldsService,
        metadataLoader: MetadataLoader,
        planCoverageFormFields: PlanCoverageFormFields,
        dynamicFormFieldsManager: DynamicFormFieldsManager
    ) {
        this._formLoadFieldsService = formLoadFieldsService;
        this._metadataLoader = metadataLoader;
        this._planCoverageFormFields = planCoverageFormFields;
        this._dynamicFormFieldsManager = dynamicFormFieldsManager;
    }

    public load(coverages: Array<CoverageDTO>, policy: PolicyDTO): Promise<void> {
        return this.loadFormCoverageMetadata(policy, coverages);
    }

    private loadFormCoverageMetadata(policy: PolicyDTO, coverages: Array<CoverageDTO>): Promise<void> {
        const metaCoverageFieldConfigNames = this.getCoverageConfigurationCodeType();
        const metaPlanCodeNames = 'plan_code';
        return this._metadataLoader.load([metaCoverageFieldConfigNames, metaPlanCodeNames]).then(metadata => {
            return this.loadFormFieldsForCoverages(
                metadata[metaCoverageFieldConfigNames],
                metadata[metaPlanCodeNames],
                policy,
                coverages
            );
        });
    }

    protected abstract getCoverageConfigurationCodeType(): string;

    private loadFormFieldsForCoverages(
        coverageFieldConfig: Array<ListItem>,
        planCodes: Array<MetadataItem>,
        policy: PolicyDTO,
        coverages: Array<CoverageDTO>
    ): Promise<void> {
        if (!this._planCoverageFormFields.loaded) {
            return this._dynamicFormFieldsManager.getFormFields(this.getFormType()).then(response => {
                const fields = response.value as Array<FieldConfig>;
                const includedFormFieldNamesForPlans = this.getIncludedFormFieldsForPlans(
                    coverageFieldConfig,
                    planCodes,
                    fields
                );
                this.preProcessFormFields(response.value as Array<FieldConfig>);
                return this._formLoadFieldsService
                    .load(
                        this.getFormType(),
                        response.value as Array<FieldConfig>,
                        includedFormFieldNamesForPlans,
                        this.getFormData(policy, coverages),
                        policy
                    )
                    .then(planFormFieldsArray => this.setupPlanCoverageFormFields(planFormFieldsArray, planCodes));
            });
        }
    }

    private getFormData(policy: PolicyDTO, coverages: Array<CoverageDTO>): CoverageFormData {
        return CoverageFormDataBuilder.build(policy, coverages[0]);
    }

    private getIncludedFormFieldsForPlans(
        coverageFieldConfig: Array<ListItem>,
        planCodes: Array<MetadataItem>,
        formFields: Array<FieldConfig>
    ): Array<FormFieldNames> {
        return planCodes.map(planCode => {
            const includedFieldsForPlan = ListUtil.getLabelByValue(
                coverageFieldConfig,
                planCode.externalCode.toLowerCase()
            ).split(',');
            // Temporary filter the list until all form fields are defined
            const implementedFormFields = formFields.map(fieldConfig => fieldConfig.name);
            return includedFieldsForPlan.filter(field => implementedFormFields.indexOf(field) >= 0);
        });
    }

    private setupPlanCoverageFormFields(planFormFieldsArray: Array<FieldConfig[]>, planCodes: Array<ListItem>): void {
        planCodes.forEach((planCode, index) => {
            this._planCoverageFormFields.set(planCode.value.toUpperCase(), planFormFieldsArray[index]);
        });
    }

    protected preProcessFormFields(formFields: Array<FieldConfig>): void {
        FormListFieldsUtil.getListFieldsWithDynamicMetaType(formFields).forEach(fieldConfig => {
            if ((fieldConfig as ListFieldConfig) && (<ListFieldConfig>fieldConfig).dynamicType) {
                const fnGetDynamicType = (fieldConfig: ListFieldConfig, formData: Object): string => {
                    const coverage = formData as CoverageDTO;
                    return `${fieldConfig.metaType}${coverage.PlanCodeId ? coverage.PlanCodeId.toLowerCase() : ''}`;
                };
                (<ListFieldConfig>fieldConfig).getDynamicType = fnGetDynamicType;
            }
        });
    }

    protected abstract getFormType(): string;
}
