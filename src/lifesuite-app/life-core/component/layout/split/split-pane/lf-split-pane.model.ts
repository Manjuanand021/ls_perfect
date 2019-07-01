import { Type } from '@angular/core';
import { SplitArea } from '../lf-split.model';

export class SplitPaneArea extends SplitArea {
    public view: Type<any>;
    public context?: any;
    public type?: string;
    constructor({
        id,
        index,
        type,
        size,
        view,
        context,
        visible
    }: {
        id: string;
        index?: number;
        type?: string;
        size: number;
        view: Type<any>;
        context?: any;
        visible?: boolean;
    }) {
        super({ id, index, size, visible });
        this.view = view;
        this.context = context;
        this.type = type;
    }
}

export type SplitPaneAreaData = {
    areaId: string;
    context?: any;
    type?: string;
};

export class SplitPaneStateData {
    public splitPaneSize: number;
    public splitPaneAreas: SplitPaneArea[];
}
