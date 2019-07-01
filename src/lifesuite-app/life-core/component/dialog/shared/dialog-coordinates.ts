export class DialogCoordinates {
    public left: number;
    public top: number;
    public right: number;
    public bottom: number;

    constructor(left: number, top: number, right?: number, bottom?: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    public static different(c1: DialogCoordinates, c2: DialogCoordinates): boolean {
        return c1.left != c2.left || c1.top != c2.top || c1.right != c2.right || c1.bottom != c2.bottom;
    }
}
