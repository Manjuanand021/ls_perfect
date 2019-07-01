export class SplitArea {
    public id: string;
    public index?: number;
    public visible?: boolean = true;
    public size?: number;
    public displayedSize: number;

    constructor({ id, index, size, visible }: { id: string; index?: number; size?: number; visible?: boolean }) {
        this.id = id;
        this.index = index;
        this.size = size;
        if (visible != undefined) {
            this.visible = visible;
        }
    }
}

export type SplitAreasInfo = { [key: string]: SplitArea };

export type SplitDirection = 'horizontal' | 'vertical';

export const GutterSize = {
    small: 6,
    medium: 8,
    large: 11
};

export const GutterColor = {
    default: '#eeeeee',
    drag: 'lightblue'
};
