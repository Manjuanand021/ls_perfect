import { ViewModel } from 'life-core/view-model';
import { ViewFormSectionValidator } from 'lpla-core/view-model';
import {FormSections} from './form-sections';
import {FormSection} from './form-section';

export abstract class SectionalEditorViewModel extends ViewModel {

    protected navigateNextButtonVisible: boolean = true;

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.formSectionsFound())
            this.setFormSectionsValidator();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if (this.formSectionsFound()) {
            this.setupFormSections();
            this.navigateNextButtonVisible = false;
        }
	}

	/**
	* Implement to return FormSections instance defined inside the view
	*/
	protected abstract getFormSections(): FormSections;

    private formSectionsFound(): boolean {
        return this.getFormSections() != null;
    }

	private setupFormSections(): void {
		this.initFormSectionsSubscriptions();
	}

	private setFormSectionsValidator() {
        let sectionValidator = this.injector.get(ViewFormSectionValidator);
		this.getFormSections().setSectionValidator(sectionValidator);
	}

	private initFormSectionsSubscriptions(): void {
		this.getFormSections().eventEmitterActiveSectionChanged.subscribe(formSection => this.onActiveSectionChanged(formSection));
	}

	protected onActiveSectionChanged(activeSection: FormSection) {
		this.setButtonNavigateNext(activeSection);
	}

	private setButtonNavigateNext(activeSection: FormSection): void {
		this.navigateNextButtonVisible = (activeSection == undefined) || this.getFormSections().isLastSection(activeSection);
	}

}
