import { SignalRService, SignalRServiceRegistry } from 'life-core/signalr';
import { Logger } from 'life-core/logging';

export abstract class LsSignalRService extends SignalRService {
    constructor(signalRServiceRegistry: SignalRServiceRegistry, logger: Logger) {
        super(signalRServiceRegistry, logger);
    }
}
