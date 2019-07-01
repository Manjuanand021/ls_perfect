import { InsuredDTO } from 'ls-core/model/dto/insured.dto';
import { LsRadioButtonValues } from 'ls-core/component/input/radiobutton/ls-radiobutton-values';

export class ApplicantInfoDataInitializer {
    private _applicant: InsuredDTO;

    constructor(applicant: InsuredDTO) {
        this._applicant = applicant;
    }

    public initializeData(): void {
        this._applicant.Applications_LazyLoad[0].HippaAuthorizationFlag =
            this._applicant.Applications_LazyLoad[0].HippaAuthorizationFlag || LsRadioButtonValues.UNDEFINED_NUMBER;

        this._applicant.Applications_LazyLoad[0].AirmilesFlag =
            this._applicant.Applications_LazyLoad[0].AirmilesFlag || LsRadioButtonValues.UNDEFINED_NUMBER;

        this._applicant.Applications_LazyLoad[0].MedicalAuthorizationFlag =
            this._applicant.Applications_LazyLoad[0].MedicalAuthorizationFlag || LsRadioButtonValues.UNDEFINED_NUMBER;
    }
}
