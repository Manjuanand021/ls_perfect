import { Identifiable } from './identifiable';
import { LSFileProxy } from '../insurance/ls-file-proxy';

export class LSFileProxyDTO extends LSFileProxy {
    public static Type: string = 'life.ls.ui.ria.dto.LSFileProxyDTO, LifeSuite.UIServiceDTO';

    public readonly $type: string = LSFileProxyDTO.Type;

    public FileNavURL: string;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}