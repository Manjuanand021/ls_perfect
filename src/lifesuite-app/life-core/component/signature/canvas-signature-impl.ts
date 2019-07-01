import { ISignature } from './signature.interface';

class Point2D {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public x: number;
    public y: number;
}

class PointTime extends Point2D {
    constructor(x: number, y: number, time: number, reset: number) {
        super(x, y);
        this.time = time;
        this.reset = reset;
    }

    public time: number;
    public reset: number;

    public velocityFrom(start: PointTime): number {
        return this.time !== start.time ? this.distanceTo(start) / (this.time - start.time) : 1;
    }

    public distanceTo(start: PointTime): number {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    }
}

class TwoPoints {
    constructor(p1: PointTime, p2: PointTime) {
        this.p1 = p1;
        this.p2 = p2;
    }

    public p1: PointTime;
    public p2: PointTime;
}

class BezierCurve {
    constructor(startPoint, control1, control2, endPoint) {
        this.startPoint = startPoint;
        this.control1 = control1;
        this.control2 = control2;
        this.endPoint = endPoint;
    }

    public startPoint: PointTime;
    public control1: PointTime;
    public control2: PointTime;
    public endPoint: PointTime;

    public length(): number {
        let steps: number = 10;
        let length: number = 0;
        let indx: number, t: number, cx: number, cy: number, px: number, py: number, xdiff: number, ydiff: number;

        for (indx = 0; indx <= steps; indx++) {
            t = indx / steps;
            cx = this.pointDistance(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
            cy = this.pointDistance(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
            if (indx > 0) {
                xdiff = cx - px;
                ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }

        return length;
    }

    private pointDistance(t: number, start: number, c1: number, c2: number, end: number): number {
        return (
            start * (1.0 - t) * (1.0 - t) * (1.0 - t) +
            3.0 * c1 * (1.0 - t) * (1.0 - t) * t +
            3.0 * c2 * (1.0 - t) * t * t +
            end * t * t * t
        );
    }
}

export class CanvasSignatureImpl implements ISignature {
    private _canvas: HTMLCanvasElement;
    private _applyButton: HTMLButtonElement;
    private _clearButton: HTMLButtonElement;

    private _activePoints: PointTime[];
    private _totalPoints: PointTime[];
    private _lastVelocity: number;
    private _lastWidth: number;
    private _ctx: CanvasRenderingContext2D;
    private _minWidth: number;
    private _maxWidth: number;
    private _penColor: string;
    private _backgroundColor: string;
    private _mouseButtonDown: boolean;
    private _mouseJustOut: boolean;
    private _hasBeenSigned: boolean;
    private _velocityFilterWeight: number;
    private _minimumValidPoints: number;
    private _initialSignatureRatio: number;

    constructor({
        canvas,
        clearButton,
        applyButton
    }: {
        canvas: HTMLCanvasElement;
        clearButton: HTMLButtonElement;
        applyButton: HTMLButtonElement;
    }) {
        this._canvas = canvas;
        this._applyButton = applyButton;
        this._clearButton = clearButton;
    }

    public initialize(): void {
        this.initializeControls();

        this._ctx = this._canvas.getContext('2d');
        this._minimumValidPoints = 50;
        this._velocityFilterWeight = 0.75;
        this._minWidth = 0.5;
        this._maxWidth = 3.0;
        this._penColor = 'black';
        this._backgroundColor = 'rgba(0,0,0,0)';
        this._mouseJustOut = false;
        this._hasBeenSigned = false;

        this.hookupMouseEvents();
        this.hookupTouchEvents();
        this.clear();

        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
        this._initialSignatureRatio = this._canvas.height / this._canvas.width;
    }

    public enable(): void {
        window.addEventListener('resize', this.resize, false);

        this.hookupMouseEvents();
        this.hookupTouchEvents();
        this.enableControl();
    }

    public disable(): void {
        window.removeEventListener('resize', this.resize);

        this.unhookupMouseEvents();
        this.unhookupTouchEvents();
        this.disableControl();
    }

    public setMinimumValidPoints(pointCount: number): void {
        this._minimumValidPoints = pointCount;
    }

    public isValid(): boolean {
        return this._totalPoints != null && this._totalPoints.length >= this._minimumValidPoints;
    }

    public hasBeenSigned(): boolean {
        return this._hasBeenSigned;
    }

    public isEmpty(): boolean {
        return this._totalPoints == null || this._totalPoints.length == 0;
    }

    public clear(): void {
        this.enable();

        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._totalPoints = [];

        this.reset();
        this.showWatermark();
    }

    public getVectorAndTiffImageDatas(): string {
        let vectors = this.getVectorImageData();
        let base64Data = this.getBase64TiffImageData();
        return base64Data + '::' + vectors;
    }

    public getBase64TiffImageData(): string {
        let base64Data: string = this._canvas.toDataURL('image/tiff').split(',')[1];
        return base64Data;
    }

    public getVectorImageData(): string {
        let vectorArray: string[] = [];
        let indx: number;

        for (indx = 0; indx < this._totalPoints.length; indx++) {
            vectorArray.push(this._totalPoints[indx].x.toString());
            vectorArray.push(',');
            vectorArray.push(this._totalPoints[indx].y.toString());
            vectorArray.push(',');
            vectorArray.push(this._totalPoints[indx].time.toString());
            vectorArray.push(',');
            vectorArray.push(this._totalPoints[indx].reset.toString());
            vectorArray.push(';');
        }

        return vectorArray.join('');
    }

    public loadFromVectorAndTiffImageData(vectorData: string): void {
        let signatureData = vectorData.split('::');
        if (signatureData.length == 2) {
            this.hideWatermark();
            var imageObj = new Image();
            imageObj.src = 'data:image/tiff;base64,' + signatureData[0];
            var ctx = this._canvas.getContext('2d');
            imageObj.onload = function() {
                ctx.drawImage(imageObj, 0, 0);
            };

            this._hasBeenSigned = true;
            this.disable();
        }
    }

    public removeEventListener(): void {
        this.unhookupMouseEvents();
        this.unhookupTouchEvents();
    }

    private dotSize(): number {
        return (this._minWidth + this._maxWidth) / 2;
    }

    private hookupMouseEvents() {
        this._canvas.addEventListener('mousedown', this.mouseDown, false);
        this._canvas.addEventListener('mouseup', this.mouseUp, false);
        this._canvas.addEventListener('mousemove', this.mouseMove, false);
        this._canvas.addEventListener('mouseout', this.mouseOut, false);

        window.addEventListener('mouseup', this.mouseUp, false);
    }

    private unhookupMouseEvents(): void {
        this._canvas.removeEventListener('mousedown', this.mouseDown);
        this._canvas.removeEventListener('mousemove', this.mouseMove);
        this._canvas.removeEventListener('mouseup', this.mouseUp);
        this._canvas.removeEventListener('mouseout', this.mouseOut);

        window.removeEventListener('mouseup', this.mouseUp, false);
    }

    private hookupTouchEvents() {
        this._canvas.style.msTouchAction = 'none';
        this._canvas.addEventListener('touchstart', this.touchStart, false);
        this._canvas.addEventListener('touchmove', this.touchMove, false);
        this._canvas.addEventListener('touchend', this.touchEnd, false);
    }

    private unhookupTouchEvents(): void {
        this._canvas.removeEventListener('touchstart', this.touchStart);
        this._canvas.removeEventListener('touchmove', this.touchMove);
        this._canvas.removeEventListener('touchend', this.touchEnd);
    }

    private touchStart = (event: TouchEvent): void => {
        if (event.targetTouches.length == 1) {
            let touch = event.changedTouches[0];
            let point2d = new Point2D(touch.clientX, touch.clientY);
            this.strokeBegin(point2d);
        }
    };

    private touchMove = (event: TouchEvent): void => {
        event.preventDefault();
        let touch = event.targetTouches[0];
        let point2d = new Point2D(touch.clientX, touch.clientY);
        this.strokeUpdate(point2d);
        this.checkToEnableButtons();
    };

    private touchEnd = (event: TouchEvent): void => {
        var isInCanvas = event.target === this._canvas;
        if (isInCanvas) {
            event.preventDefault();
            this.strokeEnd();
        }
    };

    private mouseDown = (event: MouseEvent): void => {
        if (event.which === 1) {
            if (this._mouseJustOut) {
                this._mouseJustOut = false;
            } else {
                let point2d: Point2D = new Point2D(event.clientX, event.clientY);
                this._mouseButtonDown = true;
                this.strokeBegin(point2d);
            }
        }
    };

    private mouseMove = (event: MouseEvent): void => {
        if (this._mouseButtonDown) {
            let point2d: Point2D = new Point2D(event.clientX, event.clientY);
            this.strokeUpdate(point2d);
            this.checkToEnableButtons();
        }
    };

    private mouseUp = (event: MouseEvent): void => {
        if (this._mouseButtonDown) {
            this._mouseButtonDown = false;
            this.strokeEnd();
        }
    };

    private mouseOut = (event: MouseEvent): void => {
        if (this._mouseButtonDown) {
            this._mouseJustOut = true;
        }
    };

    private resize = (event: MouseEvent): void => {
        this.setCanvasDimension();
        this.clear();
    };

    private setCanvasDimension(): void {
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetWidth * this._initialSignatureRatio;
    }

    private clearButtonClick = (event: Event): void => {
        this.clear();
        this._applyButton.disabled = true;
    };

    private applyButtonClick = (event: Event): void => {
        this._hasBeenSigned = this.isValid();
    };

    private checkToEnableButtons() {
        this.enableControl();
    }

    private initializeControls(): void {
        this._clearButton.addEventListener('click', this.clearButtonClick, false);
        this._applyButton.addEventListener('click', this.applyButtonClick, false);
    }

    private disableControl(): void {
        this._applyButton.disabled = true;
        this._clearButton.disabled = true;
    }

    private enableControl(): void {
        this._applyButton.disabled = !this.isValid();
        this._clearButton.disabled = this.isEmpty();
    }

    private reset() {
        this._activePoints = [];
        this._lastVelocity = 0;
        this._lastWidth = (this._minWidth + this._maxWidth) / 2;
        this._ctx.fillStyle = this._penColor;

        if (this._totalPoints.length > 0) {
            this._totalPoints[this._totalPoints.length - 1].reset = 1;
        }
    }

    private strokeUpdate(point2d: Point2D) {
        var point3d = this.createPoint(point2d);
        this.addPoint(point3d);
    }

    private calculateCurveControlPoints(p1: PointTime, p2: PointTime, p3: PointTime): TwoPoints {
        let dx1 = p1.x - p2.x;
        let dy1 = p1.y - p2.y;
        let dx2 = p2.x - p3.x;
        let dy2 = p2.y - p3.y;

        let m1 = { x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0 };
        let m2 = { x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0 };

        let l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        let l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        let dxm = m1.x - m2.x;
        let dym = m1.y - m2.y;

        let k = l2 / (l1 + l2);
        let cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
        let tx = p2.x - cm.x;
        let ty = p2.y - cm.y;

        return new TwoPoints(
            new PointTime(m1.x + tx, m1.y + ty, Date.now(), 0),
            new PointTime(m2.x + tx, m2.y + ty, Date.now(), 0)
        );
    }

    private addPoint(point: PointTime): void {
        this._totalPoints.push(point);

        let points = this._activePoints;
        points.push(point);

        if (points.length > 2) {
            if (points.length === 3) {
                points.unshift(points[0]);
            }

            let control1: PointTime;
            let control2: PointTime;
            let curve: BezierCurve;
            let tempPoint: TwoPoints;

            tempPoint = this.calculateCurveControlPoints(points[0], points[1], points[2]);
            control1 = tempPoint.p2;
            tempPoint = this.calculateCurveControlPoints(points[1], points[2], points[3]);
            control2 = tempPoint.p1;
            curve = new BezierCurve(points[1], control1, control2, points[2]);

            this.addCurve(curve);
            points.shift();
        }
    }

    private addCurve(curve: BezierCurve): void {
        let startPoint: PointTime = curve.startPoint;
        let endPoint: PointTime = curve.endPoint;
        let velocity: number;
        let newWidth: number;

        velocity = endPoint.velocityFrom(startPoint);
        velocity = this._velocityFilterWeight * velocity + (1 - this._velocityFilterWeight) * this._lastVelocity;

        newWidth = this.strokeWidth(velocity);

        this.drawCurve(curve, this._lastWidth, newWidth);
        this._lastVelocity = velocity;
        this._lastWidth = newWidth;
    }

    private drawCurve(curve: BezierCurve, startWidth: number, endWidth: number): void {
        let widthDelta = endWidth - startWidth;
        let drawSteps = Math.floor(curve.length());
        let width: number, indx: number, t: number, tt: number, ttt: number;
        let u: number, uu: number, uuu: number, x: number, y: number;

        this._ctx.beginPath();
        for (indx = 0; indx < drawSteps; indx++) {
            t = indx / drawSteps;
            tt = t * t;
            ttt = tt * t;
            u = 1 - t;
            uu = u * u;
            uuu = uu * u;

            x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;

            y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;

            width = startWidth + ttt * widthDelta;
            this.drawPoint(x, y, width);
        }

        this._ctx.closePath();
        this._ctx.fill();
    }

    private strokeWidth(velocity): number {
        return Math.max(this._maxWidth / (velocity + 1), this._minWidth);
    }

    private createPoint(point: Point2D): PointTime {
        let rect = this._canvas.getBoundingClientRect();
        return new PointTime(point.x - rect.left, point.y - rect.top, Date.now(), 0);
    }

    private strokeBegin(point2d: Point2D): void {
        this.reset();
        this.hideWatermark();
        this.strokeUpdate(point2d);
    }

    private strokeEnd(): void {
        let canDrawCurve = this._activePoints.length > 2;
        let point = this._activePoints[0];

        if (!canDrawCurve && point) {
            this.strokeDraw(point);
        }
    }

    private strokeDraw(point: PointTime): void {
        this._ctx.beginPath();
        this.drawPoint(point.x, point.y, this.dotSize());
        this._ctx.closePath();
        this._ctx.fill();
    }

    private drawPoint(x, y, size): void {
        this._ctx.moveTo(x, y);
        this._ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    }

    private showWatermark(): void {
        this._canvas.classList.add(this.getWatermarkClass());
    }

    private hideWatermark(): void {
        this._canvas.classList.remove(this.getWatermarkClass());
    }

    private getWatermarkClass(): string {
        // TODO - return locale-based css class
        return 'lf-signature-watermark';
    }
}
