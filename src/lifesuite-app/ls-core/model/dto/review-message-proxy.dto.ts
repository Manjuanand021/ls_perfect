import { Identifiable } from './identifiable';
import { ReviewMessageProxy } from 'ls-core/model/insurance/review-message-proxy';

export class ReviewMessageProxyDTO extends ReviewMessageProxy {
    public readonly $type: string = 'life.ls.ui.ria.dto.ReviewMessageProxyDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public ReviewMessageId: number;

    public PolicyPersonId: number;
}
