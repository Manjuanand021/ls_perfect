import { LifeError } from 'life-core/service';
import { IIPObjectError } from 'ls-core/service/data-service.model';

export class ErrorHandlerUtil {
    public static mapError(error: IIPObjectError): LifeError {
        const lifeError = new LifeError();
        lifeError.errorCode = error.errorCodes;
        lifeError.errorMessage = error.formattedMessage;
        lifeError.errorType = error.errorType;
        lifeError.date = error.date;
        lifeError.severityLevel = error.severityLevel;
        return lifeError;
    }

    public static mapErrors(errors: IIPObjectError[]): LifeError[] {
        return errors.map(error => ErrorHandlerUtil.mapError(error));
    }
}
