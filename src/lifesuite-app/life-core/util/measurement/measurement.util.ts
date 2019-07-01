export class MeasurementUtil {
    public static getHeight(valueFt: number, valueInch: number): number {
        return valueFt * INCHES_IN_FOOT + valueInch;
    }

    public static convertInchToCm(valueInch: number): number {
        return valueInch == null ? null : Math.round(valueInch * INCH_TO_CENTIMETER); // C01
    }

    public static convertCmToInch(valueCm: number): number {
        return valueCm == null ? null : Math.floor(valueCm * CENTIMETER_TO_INCH);
    }

    public static getFtFromHeight(valueInch: number): number {
        return valueInch == null ? null : Math.floor(valueInch / INCHES_IN_FOOT);
    }

    public static getInchFromHeight(valueInch: number): number {
        return valueInch == null ? null : valueInch % INCHES_IN_FOOT;
    }

    public static convertLbToKg(valueLb: number): number {
        return valueLb == null ? null : Math.round(valueLb * LB_TO_KILOGRAM);
    }

    public static convertKgToLb(valueKg: number): number {
        return valueKg == null ? null : Math.round(valueKg * KILOGRAM_TO_LB);
    }
}

export const INCHES_IN_FOOT = 12;
export const INCH_TO_CENTIMETER = 2.54;
export const CENTIMETER_TO_INCH = 0.393700787;
export const LB_TO_KILOGRAM = 0.45359237;
export const KILOGRAM_TO_LB = 2.20462262;
