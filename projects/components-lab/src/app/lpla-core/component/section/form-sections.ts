import { Component, OnInit, AfterContentInit, AfterViewInit, OnDestroy, EventEmitter, QueryList, ContentChildren} from '@angular/core';

import { ViewValidationResponse } from 'life-core/view-model';
import { IViewFormSectionValidator } from 'lpla-core/view-model';
import {FormSection} from './form-section';

@Component({
    selector: 'form-sections',
    templateUrl: './form-sections.html'
})

export class FormSections implements OnInit, AfterContentInit, AfterViewInit {

    @ContentChildren(FormSection) private _formSectionList: QueryList<FormSection>;

    private _formSections: FormSection[];

	/**
	* Emits event when active section changes
	*/
	public eventEmitterActiveSectionChanged: EventEmitter<FormSection> = new EventEmitter<FormSection>();

	protected sectionValidator: IViewFormSectionValidator;

	/**
	* Component Lifecycle method
	*/

    ngOnInit() {
    }

    public ngAfterContentInit(): void {
        this._formSections = this._formSectionList.toArray();
	}

    public ngAfterViewInit(): void {
        this.initialSetup();
        this.setupIncompleteSections();
    }
	/**
	* Assignes validator to use for section validation
	*  @param sectionValidator section validator
	*/
	public setSectionValidator(sectionValidator: IViewFormSectionValidator) {
		this.sectionValidator = sectionValidator;
	}

	/**
	* Returns true for last section, false otherwise
	*/
	public isLastSection(section: FormSection): boolean {
		return this.sectionIndex(section) == this._formSections.length - 1;
	}

    private initialSetup(): void {
		this.assignSectionIDs();
		this.setLastSectionFlag();
		this.initSubscriptions();
	}

	private setupIncompleteSections(): void {
		let firstIncompleteSection = this.getFirstIncompleteSection();
		if (firstIncompleteSection) {
            firstIncompleteSection.setActive(true);
			this.hideSectionsAfter(firstIncompleteSection);
		}
		this.notifyActiveSectionChanged(firstIncompleteSection);
	}

	private assignSectionIDs(): void {
		this._formSections.forEach(formSection => {
			if (formSection.id == '') {
				formSection.id = (this.sectionIndex(formSection) + 1).toString();
			}
		});
	}

	private setLastSectionFlag(): void {
		this._formSections[this._formSections.length - 1].isLast = true;
	}

	private initSubscriptions(): void {
		this._formSections.forEach((formSection) => {
			formSection.eventEmitterNextClick.subscribe(formSection => this.onNextSectionClick(formSection));
		});
	}

	private hideSectionsAfter(section: FormSection): void {
		let nextSection = this.getNextSection(section);
		if (nextSection) {
			this.hideSectionsInRange(nextSection);
		}
	}

	private notifyActiveSectionChanged(activeSection: FormSection): void {
		this.eventEmitterActiveSectionChanged.emit(activeSection);
	}

	private onNextSectionClick(activeSection: FormSection) {
		let validationResponse = this.validateSection(activeSection, false);
		if (validationResponse.hasError) {
			activeSection.setMessages(validationResponse.errorMessages);
		} else {
			activeSection.resetMessages();
		}
		this.updateSectionsOnNextClick(activeSection, validationResponse);
	}

	private validateSection(section: FormSection, hideMessages: boolean): ViewValidationResponse {
		return this.sectionValidator.validate(section.id, hideMessages);
	}

	private updateSectionsOnNextClick(activeSection: FormSection, validationResponse: ViewValidationResponse): void {
		let activeSectionValid = !validationResponse.hasError;
		if (activeSectionValid) {
            activeSection.setActive(false);
			let nextIncompleteSection = this.getNextIncompleteSection(activeSection);
			if (nextIncompleteSection) {
                nextIncompleteSection.setActive(true);
			}
			this.showSectionsInRange(this.getNextSection(activeSection), nextIncompleteSection);
			this.eventEmitterActiveSectionChanged.emit(nextIncompleteSection);
		}
	}

	private getNextSection(section: FormSection): FormSection {
		let sectionIndex = this.sectionIndex(section);
		return (sectionIndex < this._formSections.length) ? this._formSections[sectionIndex+1] : null;
	}

	private getFirstIncompleteSection(sections?: FormSection[]): FormSection {
		sections = sections || this._formSections;
		return sections.find(formSection => this.validateSection(formSection, true).hasError == true);
	}

	private getNextIncompleteSection(currentSection: FormSection): FormSection {
		let currentSectionIndex = this.sectionIndex(currentSection);
		let nextSections = [];
		this._formSections.forEach((section, index) => {
			if (index > currentSectionIndex) nextSections.push(section);
		});
		return this.getFirstIncompleteSection(nextSections);
	}

	private showSectionsInRange(fromSection?: FormSection, toSection?: FormSection): void {
		let funcShowSection = function(sections: FormSection[], index: number): void {
			sections[index].show();
		}
		this.changeVisibilityOfSectionsInRange(funcShowSection, fromSection, toSection);
	}

	private hideSectionsInRange(fromSection?: FormSection, toSection?: FormSection): void {
		let funcHideSection = function(sections: FormSection[], index: number): void {
			sections[index].hide();
		}
		this.changeVisibilityOfSectionsInRange(funcHideSection, fromSection, toSection);
	}

	/**
	* Changes visibility of all sections between fromSection and toSection
	*
	*  @param func the function to call for visibility change
	*  @param fromSection the starting section in the range; if not passed, the first section will be used.
	*  @param toSection the ending section in the range; if not passed, the last section will be used.
	*/
	private changeVisibilityOfSectionsInRange(func: (sections: FormSection[], index: number) => void, fromSection?: FormSection, toSection?: FormSection): void {
		let fromIndex = fromSection ? this.sectionIndex(fromSection) : 0;
		let toIndex = toSection ? this.sectionIndex(toSection) : this._formSections.length - 1;
		for (let index = fromIndex; index <= toIndex; index++) {
			func(this._formSections, index);
		}
	}

	private sectionIndex(section: FormSection): number {
		return this._formSections.indexOf(section);
	}

    public ngOnDestroy(): void {
		this.destroyEventEmitters();
	}
	private destroyEventEmitters(): void {
		this.eventEmitterActiveSectionChanged.unsubscribe();
	}
}
