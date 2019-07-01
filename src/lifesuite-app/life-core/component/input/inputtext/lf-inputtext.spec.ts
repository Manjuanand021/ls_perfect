import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture, fakeAsync, tick, discardPeriodicTasks, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AuthorizationLevel } from 'life-core/authorization';
import {
    tickAndDetectChanges,
    dispatchKeyboardEvent,
    dispatchFakeEvent,
    EventType,
    emulateKeyPressEvent
} from 'life-core/testing';

import { LfInputText } from './lf-inputtext';

@Component({
    template: `
        <lf-inputtext
            #srTextField
            name="srTextField"
            [maxLength]="maxLength"
            [style]="style"
            [placeholder]="placeholder"
            [spellcheck]="spellcheck"
            [(ngModel)]="value"
        ></lf-inputtext>
    `
})
class EncapsulatedInputTextComponent {
    public value: string;

    public maxLength: number;

    constructor() {}
}

describe('LfInputText : ', () => {
    let hostComponent: EncapsulatedInputTextComponent;
    let fixture: ComponentFixture<EncapsulatedInputTextComponent>;
    let lfInputText: DebugElement;
    let inputElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, FormsModule],
            declarations: [LfInputText, EncapsulatedInputTextComponent]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(EncapsulatedInputTextComponent);
                hostComponent = fixture.debugElement.componentInstance;
                fixture.detectChanges(); // detect changes explicitly

                lfInputText = fixture.debugElement.query(By.css('lf-inputtext'));
                inputElement = lfInputText.query(By.css('input'));
            });
    }));

    it('should display by default', () => {
        expect(lfInputText).toBeTruthy();
        expect(inputElement.attributes).toEqual(
            jasmine.objectContaining({
                pInputText: ''
            })
        );
        expect(inputElement.nativeElement.className).toContain('ui-inputtext');
        expect(inputElement.nativeElement.className).toContain('ui-widget');
    });

    describe('input properties : ', () => {
        describe('max length', () => {
            it('should let user to input less than the given max length', fakeAsync(() => {
                const testMaxLength = 5;
                hostComponent.maxLength = testMaxLength;
                hostComponent.value = '1234';

                tickAndDetectChanges(fixture);

                // emulate keypress event
                emulateKeyPressEvent(fixture, inputElement.nativeElement, '5');

                expect(inputElement.nativeElement.value.length).toBeLessThanOrEqual(testMaxLength);
                expect(inputElement.nativeElement.value).toEqual('12345');

                discardPeriodicTasks();
            }));

            it('should not let user to input more than the given max length', fakeAsync(() => {
                const testMaxLength = 5;
                const testInput = '12345';
                hostComponent.maxLength = testMaxLength;
                hostComponent.value = testInput;

                tickAndDetectChanges(fixture);

                // emulate keypress event
                emulateKeyPressEvent(fixture, inputElement.nativeElement, '6');

                expect(inputElement.nativeElement.value.length).toEqual(testMaxLength);
                expect(inputElement.nativeElement.value).toEqual(testInput);

                discardPeriodicTasks();
            }));
        });
    });

    describe('model change : ', () => {
        it('should update ngModel on value change', fakeAsync(() => {
            expect(inputElement.nativeElement.value).toEqual('');

            const testInput = 'test input';
            inputElement.nativeElement.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.blur);
            tickAndDetectChanges(fixture);

            expect(hostComponent.value).toEqual(testInput);

            discardPeriodicTasks();
        }));

        it('should update internal model on ngModel change', fakeAsync(() => {
            expect(hostComponent.value).toBeUndefined();

            const testInput = 'test input';
            hostComponent.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toEqual(testInput);

            discardPeriodicTasks();
        }));

        it('should clear internal model on resetting ngModel to default value', fakeAsync(() => {
            expect(hostComponent.value).toBeUndefined();

            const testInput = 'test input';
            hostComponent.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toEqual(testInput);

            // reset the model to default value
            hostComponent.value = '';

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.nativeElement.value).toBe('');

            discardPeriodicTasks();
        }));
    });

    describe('output events : ', () => {
        it('should fire input event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'handleInputChange');

            const testInput = 'test input';
            hostComponent.value = testInput;

            dispatchFakeEvent(inputElement.nativeElement, EventType.input);
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.handleInputChange).toHaveBeenCalled();
            expect(inputElement.componentInstance.handleInputChange).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('should fire focus event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'onFocus');

            dispatchFakeEvent(inputElement.nativeElement, EventType.focus);
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.onFocus).toHaveBeenCalled();
            expect(inputElement.componentInstance.onFocus).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('should fire blur event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'onBlur');

            dispatchFakeEvent(inputElement.nativeElement, EventType.blur);
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.onBlur).toHaveBeenCalled();
            expect(inputElement.componentInstance.onBlur).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('should fire keydown event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'onKeyDown');

            dispatchKeyboardEvent(inputElement.nativeElement, EventType.keydown, '1');
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.onKeyDown).toHaveBeenCalled();
            expect(inputElement.componentInstance.onKeyDown).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('should fire keypress event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'onKeyPress');

            dispatchKeyboardEvent(inputElement.nativeElement, EventType.keypress, '1');
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.onKeyPress).toHaveBeenCalled();
            expect(inputElement.componentInstance.onKeyPress).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('should fire paste event', fakeAsync(() => {
            spyOn(inputElement.componentInstance, 'handleInputChange');

            dispatchFakeEvent(inputElement.nativeElement, EventType.paste);
            tickAndDetectChanges(fixture);

            expect(inputElement.componentInstance.handleInputChange).toHaveBeenCalled();
            expect(inputElement.componentInstance.handleInputChange).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));
    });

    describe('authorization', () => {
        it('should be enabled and visible when authorization level is EDIT', () => {
            lfInputText.componentInstance.authorizationLevel = AuthorizationLevel.EDIT;

            fixture.detectChanges();

            expect(inputElement.nativeElement.disabled).toBe(false);
            expect(inputElement.nativeElement.hidden).toBe(false);
        });

        it('should be disabled when authorization level is VIEW', () => {
            lfInputText.componentInstance.authorizationLevel = AuthorizationLevel.VIEW;

            fixture.detectChanges();

            expect(inputElement.nativeElement.disabled).toBe(true);
        });

        it('should be hidden when authorization level is NONE', () => {
            lfInputText.componentInstance.authorizationLevel = AuthorizationLevel.NONE;

            fixture.detectChanges();

            console.log(inputElement.nativeElement);
            expect(inputElement.nativeElement.hidden).toBe(true);
        });
    });
});
