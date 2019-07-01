import { LifeError } from 'life-core/service';
import { ServerValidationMessage } from './server-validation-message';

export class ServerValidationUtil {
    public static formatServerMessages(serverErrors: LifeError[]): ServerValidationMessage[] {
        return serverErrors
            ? serverErrors.map(error => {
                  return new ServerValidationMessage('Error', error.errorMessage.replace('\\n', '<br>'));
              })
            : [];
    }
}
