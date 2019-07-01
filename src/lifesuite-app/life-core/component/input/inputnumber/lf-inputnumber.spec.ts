import { Component, DebugElement, asNativeElements, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture, fakeAsync, tick, discardPeriodicTasks, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgForm } from '@angular/forms';

import { Locale, IntlModule, IntlService } from 'life-core/i18n';

import { AuthorizationLevel } from 'life-core/authorization';

import { loadCldrData } from 'shared/i18n/cldr-data-loader';

import {
    tickAndDetectChanges,
    dispatchKeyboardEvent,
    dispatchFakeEvent,
    EventType,
    emulateKeyPressEvent
} from 'life-core/testing';

import { InputNumberConfig } from './inputnumber.config';
import { LfInputNumber } from './lf-inputnumber';

@Component({
    template: `
        <form #form="ngForm">
            <lf-inputnumber
                #newNumericField
                name="newNumericField"
                [min]="min"
                [max]="max"
                [localeId]="localeId"
                [format]="format"
                [decimals]="decimals"
                [allowNegative]="allowNegative"
                [(ngModel)]="value"
            ></lf-inputnumber>
        </form>
    `
})
export class EncapsulatedInputNumberComponent {
    @ViewChild('form')
    public form: NgForm;

    public value: number;

    public maxLength: number;

    public min: number;

    public max: number;

    public style: any;

    public placeholder: string = 'enter input';

    public spellcheck: boolean = false;

    public localeId: string;

    public format: string = 'n2';

    public decimals: number = 2;

    public round: number = 2;

    public allowNegative: boolean = true;

    constructor() {}
}

describe('LfInputNumber : ', () => {
    let hostComponent: EncapsulatedInputNumberComponent;
    let fixture: ComponentFixture<EncapsulatedInputNumberComponent>;
    let lfInputNumber: DebugElement;
    let inputElement: DebugElement;
    let inputNumberConfigStub: Partial<InputNumberConfig>;
    let intlService: IntlService;
    const testInput = 12345;
    const numberFormat = 'n2';

    beforeEach(async(() => {
        inputNumberConfigStub = {
            numberLocale: Locale.en_US
        };
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, FormsModule, IntlModule],
            declarations: [LfInputNumber, EncapsulatedInputNumberComponent],
            providers: [{ provide: InputNumberConfig, useValue: inputNumberConfigStub }]
        })
            .compileComponents()
            .then(() => {
                intlService = TestBed.get(IntlService); // get the service instance from test's root injector
                fixture = TestBed.createComponent(EncapsulatedInputNumberComponent);
                hostComponent = fixture.debugElement.componentInstance;
                fixture.detectChanges(); // detect changes explicitly

                lfInputNumber = fixture.debugElement.query(By.css('lf-inputnumber'));
                inputElement = lfInputNumber.query(By.css('input'));
            });
    }));

    it('should display by default', () => {
        expect(lfInputNumber).toBeTruthy();
        expect(inputElement.nativeElement.className).toContain('ui-inputtext ui-widget ui-state-default ui-corner-all');
    });

    describe('input properties : ', () => {
        describe('locale', () => {
            beforeAll(() => {
                loadCldrData();
            });

            it('should format number with default locale', fakeAsync(() => {
                hostComponent.value = testInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toEqual(intlService.formatNumber(testInput, numberFormat));

                discardPeriodicTasks();
            }));

            it('should format number with given locale', fakeAsync(() => {
                hostComponent.localeId = Locale.fr_CA;
                hostComponent.value = testInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toEqual(
                    intlService.formatNumber(testInput, numberFormat, Locale.fr_CA)
                );

                discardPeriodicTasks();
            }));
        });

        describe('format', () => {
            it('should format number input with default format', fakeAsync(() => {
                const decimalInput = 123.4567;

                hostComponent.value = decimalInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toBe(
                    intlService.formatNumber(decimalInput, inputElement.componentInstance.format)
                );
            }));

            it('should format number input with given format', fakeAsync(() => {
                const formatZeroDecimalDigits = 'n0';
                const decimalInput = 123.45;

                inputElement.componentInstance.format = formatZeroDecimalDigits;

                fixture.detectChanges();

                hostComponent.value = decimalInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toBe(
                    intlService.formatNumber(decimalInput, formatZeroDecimalDigits)
                );
            }));
        });

        it('should round the value if user inputs number with a with a greater precision than is currently configured', fakeAsync(() => {
            const fourDecimalInput = 4.567;
            hostComponent.decimals = 3;
            hostComponent.value = fourDecimalInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toEqual('4.57');

            discardPeriodicTasks();
        }));

        describe('min and max validation', () => {
            const minValue = 1000;
            const maxValue = 5000;

            it('should let user to input number within min-max range', fakeAsync(() => {
                hostComponent.min = minValue;
                hostComponent.max = maxValue;

                hostComponent.value = 3000;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(hostComponent.form.valid).toBe(true);

                discardPeriodicTasks();
            }));

            it('should not let user to input number out of min-max range', fakeAsync(() => {
                hostComponent.min = minValue;
                hostComponent.max = maxValue;

                hostComponent.value = 6000;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(hostComponent.form.valid).toBe(false);

                discardPeriodicTasks();
            }));
        });

        // Component's onKeyPress event handler reads event.target.selectionStart and event.target.selectionEnd.
        // Cannot use emulateKeyPressEvent helper function to emulate keypress event since event returned does not have target property(read only).
        // describe('max length', () => {
        //     it('should let user to input less than the given max length', fakeAsync(() => {
        //         const testMaxLength = 6;
        //         hostComponent.maxLength = testMaxLength;
        //         tickAndDetectChanges(fixture);
        //         // emulate keypress event
        //         // emulateKeyPressEvent(fixture, inputElement.nativeElement, '5');

        //         inputElement.nativeElement.value = testInput;
        //         const testNextChar = '6';
        //         inputElement.componentInstance.onKeyPress({
        //             which: testNextChar.charCodeAt(0),
        //             keyCode: testNextChar.charCodeAt(0),
        //             target: {
        //                 selectionStart: 5,
        //                 selectionEnd: 5
        //             },
        //             preventDefault: () => {},
        //             stopPropagation: () => {}
        //         });
        //         tickAndDetectChanges(fixture);
        //         expect(inputElement.nativeElement.value.length).toBeLessThanOrEqual(testMaxLength);
        //         expect(inputElement.nativeElement.value).toEqual('12345');
        //         discardPeriodicTasks();
        //     }));
        // });
    });

    describe('model change : ', () => {
        it('should update ngModel on value change', fakeAsync(() => {
            expect(inputElement.nativeElement.value).toEqual('');

            inputElement.nativeElement.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.blur);
            tickAndDetectChanges(fixture);

            expect(hostComponent.value).toEqual(testInput);

            discardPeriodicTasks();
        }));

        it('should update internal model on ngModel change', fakeAsync(() => {
            expect(hostComponent.value).toBeUndefined();

            hostComponent.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toEqual(intlService.formatNumber(testInput, numberFormat));

            discardPeriodicTasks();
        }));

        it('should clear internal model on resetting ngModel to default value', fakeAsync(() => {
            expect(hostComponent.value).toBeUndefined();

            hostComponent.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toEqual(intlService.formatNumber(testInput, numberFormat));

            // reset the model to default value
            hostComponent.value = 0;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toBe(intlService.formatNumber(0, numberFormat));

            discardPeriodicTasks();
        }));
    });

    describe('output events : ', () => {
        it('should fire keypress event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'onKeyPress');

            dispatchKeyboardEvent(inputElement.nativeElement, EventType.keypress, '1');
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.onKeyPress).toHaveBeenCalled();
            expect(inputElement.componentInstance.onKeyPress).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        describe('focus', () => {
            it('should fire focus event', fakeAsync(() => {
                spyOn(inputElement.componentInstance, 'onFocus');

                dispatchFakeEvent(inputElement.nativeElement, EventType.focus);
                tickAndDetectChanges(fixture);

                expect(inputElement.componentInstance.onFocus).toHaveBeenCalled();
                expect(inputElement.componentInstance.onFocus).toHaveBeenCalledTimes(1);
                discardPeriodicTasks();
            }));

            it('should remove number formatting on focus', fakeAsync(() => {
                hostComponent.value = testInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.input);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toEqual(intlService.formatNumber(testInput, numberFormat));

                dispatchFakeEvent(inputElement.nativeElement, EventType.focus);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toEqual(testInput.toString());
            }));
        });

        describe('blur', () => {
            it('should fire blur event', fakeAsync(() => {
                spyOn(inputElement.componentInstance, 'onBlur');

                dispatchFakeEvent(inputElement.nativeElement, EventType.blur);
                tickAndDetectChanges(fixture);

                expect(inputElement.componentInstance.onBlur).toHaveBeenCalled();
                expect(inputElement.componentInstance.onBlur).toHaveBeenCalledTimes(1);
                discardPeriodicTasks();
            }));

            it('should format number input on blur', fakeAsync(() => {
                inputElement.nativeElement.value = testInput;

                dispatchFakeEvent(inputElement.nativeElement, EventType.blur);
                tickAndDetectChanges(fixture);

                expect(inputElement.nativeElement.value).toEqual(intlService.formatNumber(testInput, numberFormat));
            }));
        });
    });

    describe('authorization', () => {
        it('should be enabled and visible when authorization level is EDIT', () => {
            lfInputNumber.componentInstance.authorizationLevel = AuthorizationLevel.EDIT;

            fixture.detectChanges();

            expect(inputElement.nativeElement.disabled).toBe(false);
            expect(inputElement.nativeElement.hidden).toBe(false);
        });

        it('should be disabled when authorization level is VIEW', () => {
            lfInputNumber.componentInstance.authorizationLevel = AuthorizationLevel.VIEW;

            fixture.detectChanges();

            expect(inputElement.nativeElement.disabled).toBe(true);
        });

        it('should be hidden when authorization level is NONE', () => {
            lfInputNumber.componentInstance.authorizationLevel = AuthorizationLevel.NONE;

            fixture.detectChanges();

            console.log(inputElement.nativeElement);
            expect(inputElement.nativeElement.hidden).toBe(true);
        });
    });
});
