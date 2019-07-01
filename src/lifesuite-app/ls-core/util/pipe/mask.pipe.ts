import { Pipe, PipeTransform } from '@angular/core';

/*
 * Mask sensitive information such as TaxID, Employee ID etc., using parameters in the pipe in HTML.
 * Usage:
 *   If you intend to mask first 4 digits from the left, then use
 *   taxID | mask:"MASK":4:true:"*"
 *     or
 *   If you intend to mask first 4 digits from the right, then use
 *   taxID | mask:"MASK":4:false:"*"
 *     or
 *   For ease of use, in case you intend to unmask last 4 characters from the left, use
 *   taxID | mask:"UNMASK":4:true:"*"
 *     or
 *   For ease of use, in case you intend to unmask last 4 characters from the right, use
 *   taxID | mask:"UNMASK":4:false:"*"
 *
 *   The "*" at the end is optional, in case you would like to provide any other character to mask in the UI.
*/
@Pipe({
    name: 'mask'
})
export class MaskPipe implements PipeTransform {
    transform(value: string, maskType: string, maskCount: number, leftToRight: boolean, maskValue: any): string {
        if (value && value.length > maskCount) {
            if (value && maskType === 'MASK' && leftToRight === true) {
                return (
                    value.substring(0, maskCount).replace(/\d/g, maskValue) +
                    value.substring(maskCount, value.length - 1)
                );
            } else if (value && maskType === 'MASK' && leftToRight === false) {
                return (
                    value.substring(0, value.length - maskCount) +
                    value.substring(value.length - maskCount).replace(/\d/g, maskValue)
                );
            } else if (value && maskType === 'UNMASK' && leftToRight === true) {
                return (
                    value.substring(0, maskCount) +
                    value.substring(maskCount, value.length - 1).replace(/\d/g, maskValue)
                );
            } else if (value && maskType === 'UNMASK' && leftToRight === false) {
                return (
                    value.substring(0, value.length - maskCount).replace(/\d/g, maskValue) +
                    value.substring(value.length - maskCount)
                );
            }
        }
    }
}
