export interface ISignature {
    enable(): void;
    disable(): void;
    setMinimumValidPoints(pointCount: number): void;
    isValid(): boolean;
    hasBeenSigned(): boolean;
    clear(): void;
    getVectorAndTiffImageDatas(): string;
    getBase64TiffImageData(): string;
    getVectorImageData(): string;
    loadFromVectorAndTiffImageData(vectorData: string): void;
}
