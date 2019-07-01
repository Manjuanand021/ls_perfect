import { BaseDTO } from '../dto/base.dto';
import { DBDate, DBDateCrypted } from '../util';

export class LSFileProxy extends BaseDTO {
  public readonly $type: string = 'vpi.aus.core.LSFileProxy, LifeSuite';
  public FileName: string;
  public FileType: string;
  public CreateDate: DBDate;
  public LastModifiedDate: DBDate;
  public SaveInProgress: Object;
  public FileStoreId: Object;
}
