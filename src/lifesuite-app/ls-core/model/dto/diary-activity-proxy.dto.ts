import { DiaryActivityProxy } from 'ls-core/model/insurance/diary-activity-proxy';

export class DiaryActivityProxyDTO extends DiaryActivityProxy {
    public readonly $type: string = 'life.ls.ui.ria.dto.DiaryActivityProxyDTO, LifeSuite.UIServiceDTO';

    public NoteId: number;
}
