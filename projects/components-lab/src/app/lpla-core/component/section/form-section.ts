import { Component, Injectable, OnDestroy, EventEmitter, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';

import { scrollTo } from 'lpla-core/util';
import { FormSectionActiveService } from './form-section-active.service';

@Component({
    selector: 'form-section',
    templateUrl: './form-section.html',
    styleUrls: ["./form-section.css"],
    providers: [FormSectionActiveService]
})

@Injectable()
export class FormSection implements OnDestroy {

    protected element: any;
	public messages: string[];
	public buttonNextVisible: boolean = false;

	public isActive: boolean = false;
    public isLast: boolean = false;
    public formSectionActiveService: FormSectionActiveService;
    private _subscription: Subscription;

	/**
	* Emits event when section's Next button clicked
	*/
	public eventEmitterNextClick: EventEmitter<FormSection> = new EventEmitter<FormSection>();

    constructor(element: ElementRef, formSectionActiveService: FormSectionActiveService) {
        this.element = element.nativeElement;
        this.formSectionActiveService = formSectionActiveService;
        this._subscription = this.formSectionActiveService.isActiveSubject.subscribe((value) => {
            this.onSetActive(value);
        });
    }

    private onSetActive(isActive: boolean): void {
        this.isActive = isActive;
        this.buttonNextVisible = (isActive == true) && !this.isLast;
    }

	/**
	* Returns custome element's Id
	*/
	public get id(): string {
		return this.element.id;
	}

	/**
	* Sets custome element's Id
	*
	*  @param id new value 
	*/
	public set id(value: string) {
		this.element.id = `formSection${value}`;
	}

	/**
	* Makes section visible
	*/
	public show(): void {
		(<HTMLElement>this.element).hidden = false;
		this.scrollIntoView();
	}

	/**
	* Hides section
	*/
	public hide(): void {
		(<HTMLElement>this.element).hidden = true;
	}

	/**
	* Moves section into view
	*/
	public scrollIntoView(): void {
		setTimeout(() => {
			scrollTo((<HTMLElement>this.element).offsetTop);
		}, 0);
	}

	/**
	* Sets section messages; this will display messages at the top of the section
	*/
	public setMessages(messages: string[]): void {
		this.messages = messages;
	}

	/**
	* Resets section messages
	*/
	public resetMessages(): void {
		this.messages = [];
	}

	//public isCompleted(): boolean {
	//	// Validation with JQuery
	//	let incompleteInputs = $("input", this.element).filter((index, input) => {
	//		return (<HTMLInputElement>input).required && !(<HTMLInputElement>input).value;
	//	});
	//	return incompleteInputs.length == 0;
	//}

    public setActive(isActive: boolean): void {
        this.formSectionActiveService.setActive(isActive);
    }

	private onButtonNextClick(): void {
		this.eventEmitterNextClick.emit(this);
	}

	/**
	* Component Lifecycle method
	*/
	public ngOnDestroy(): void {
        this.destroyEventEmitters();
        this._subscription.unsubscribe();
	}

	private destroyEventEmitters(): void {
		this.eventEmitterNextClick.unsubscribe();
	}
}
