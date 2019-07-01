import { Identifiable } from './identifiable';

export class LSSystemDTO {

    public readonly $type: string = 'life.ls.ui.ria.dto.LSSystemDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;
    public userId: number;
    public uwOrSaUserId: number;
    public underwriterId: number;
    public serviceAssociateId: number;
    public teamId: number;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}