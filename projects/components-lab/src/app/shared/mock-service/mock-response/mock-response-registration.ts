import { MockResponseRegistration } from 'life-core/testing/mock-backend';
import {
    DataServiceParams as LsDataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    MetadataRequestDTO,
    MetadataLookupDTO
} from 'ls-core/service';
import {
    DataServiceParams as LplaDataServiceParams,
    WebServiceAndMethodIds,
    BusinessServiceAndMethodIds
} from 'lpla-core/service';

import { FormFieldsRequestDTO, LsFormTypes } from 'ls-core/component/dynamic-form';

import { metaData } from './metadata/metadata.response';
import { formFieldsConfig } from './formdata/formdata.response';
// import { fieldsData } from './fieldsdata/fieldsdata.response';

export class LsMockResponseRegistration extends MockResponseRegistration<LsDataServiceParams> {
    protected setupRegistration(): void {
        this.addToRegistrationMap(
            new LsDataServiceParams({
                serviceInterface: UIServiceNames.METADATA_SERVICE,
                serviceMethod: UIServiceMethods.RETRIEVE_METADATA,
                requestPayload: this.getMetadataRequestPayload(['coverageType'])
            }),
            metaData
        );
        this.addToRegistrationMap(
            new LsDataServiceParams({
                serviceInterface: UIServiceNames.FORM_FIELDS,
                serviceMethod: UIServiceMethods.GET_DATA,
                requestPayload: this.getFormFieldsRequestPayload(LsFormTypes.PolicyCoverage)
            }),
            formFieldsConfig
        );
    }

    private getMetadataRequestPayload(metaTypes: string[]): MetadataRequestDTO {
        let dto = new MetadataRequestDTO();
        dto.lookups = [];
        metaTypes.forEach(metaType => {
            dto.lookups.push(new MetadataLookupDTO(metaType));
        });
        return dto;
    }

    private getFormFieldsRequestPayload(formType: string): FormFieldsRequestDTO {
        return new FormFieldsRequestDTO(formType);
    }
}

export class LplaMockResponseRegistration extends MockResponseRegistration<LplaDataServiceParams> {
    protected setupRegistration(): void {
        // this.addToRegistrationMap(
        //     new LplaDataServiceParams({
        //         webServiceId: WebServiceAndMethodIds.BaseTemplateDataBusinessInputDataService,
        //         webMethodId: WebServiceAndMethodIds.BaseBusinessDataMethod,
        //         serviceId: BusinessServiceAndMethodIds.TemplateFieldDataService,
        //         methodId: BusinessServiceAndMethodIds.Method_Get,
        //         targetPageId: 'src/app/lpla/test-fields-vm-binding'
        //     }),
        //     fieldsData
        // );
    }
}
