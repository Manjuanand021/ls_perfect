import { Injectable, Injector, Input, OnInit, AfterViewInit, Type, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DataService, DataResponse, DataServiceParams, BusinessServiceAndMethodIds } from 'lpla-core/service';
import { ViewModel } from 'life-core/view-model';
import { IComponentResolver } from 'life-core/util';
import { QuestionData, QuestionPageData, Question, QuestionList } from 'lpla-core/component';
import { IQuestionListValidator, QuestionListValidator } from './question-list.validator';
import { QuestionListDataManager } from './question-list-data.manager';

export interface IQuestionListViewModel {
    pageGroupId: number;
    pageNumber: number;
}

@Injectable()
export abstract class QuestionListViewModel extends ViewModel implements IQuestionListViewModel, AfterViewInit {
    public pageGroupId: number; // valued to be assigned in child class

    public pageNumber: number; // valued to be assigned in child class

    protected questionPageData: QuestionPageData;

    protected dataManager: QuestionListDataManager;

    protected _dataService: DataService;

    protected _reflexiveQuestionData: any;

    protected componentResolver: IComponentResolver<string>;

    constructor(container: Injector) {
        super(container);
        this._dataService = this.injector.get(DataService);
        this.dataManager = new QuestionListDataManager(this.getViewModelTypeStrategy);
        this.messages = new Array<string>();
        this.componentResolver = this.getComponentResolver();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initializeSubscription();
    }

    private initializeSubscription(): void {
        this.questionPageData.sectionList.forEach(section => {
            section.sectionQuestions.forEach(question => {
                let questionViewModel = this.getQuestionViewModel(question);
                questionViewModel.eventEmitterActiveDetailClosed.subscribe(params => this.closeDetail(params));
                questionViewModel.eventEmitterQuestionAnswerChanged.subscribe(params =>
                    this.onQuestionAnswerChanged(params.questionData)
                );
            });
        });
    }

    private closeDetail(params: any): void {
        if (this.activeQuestion != null) {
            let activeQuestion = this.activeQuestion;
            this.getQuestionEditorViewModel(activeQuestion)
                .saveData()
                .then(response => {
                    this.getQuestionViewModel(activeQuestion).onDetailActiveChanged(false, params.callback);
                });
        } else {
            params.callback();
        }
    }

    private getQuestionViewModel(questionData: QuestionData): any {
        return this.getQuestionList().getQuestionViewModel(questionData);
    }

    protected abstract getQuestionList(): QuestionList;

    private getQuestionEditorViewModel(questionData: QuestionData): any {
        let question: Question = this.getQuestionViewModel(questionData);
        return question.getQuestionEditorViewModel();
    }

    protected getViewModelTypeStrategy = (detailPageName: string): Type<any> => {
        return this.componentResolver.resolve(detailPageName);
    };

    protected abstract getComponentResolver(): IComponentResolver<string>;

    protected get activeQuestion(): QuestionData {
        var activeQuestion: QuestionData;
        this.questionPageData.sectionList.some(section => {
            return section.sectionQuestions.some(question => {
                if (question.isDetailActive == true) {
                    activeQuestion = question;
                }
                return question.isDetailActive;
            });
        });
        return activeQuestion;
    }

    protected onQuestionAnswerChanged(questionData: QuestionData): void {
        this.resetValidationMessages();
    }

    public loadData(): Promise<void> {
        return this.loadQuestionList();
    }

    protected loadQuestionList(): Promise<void> {
        return new Promise<void>((accept, reject) => {
            this._reflexiveQuestionData = this.getQuestionListDataFromRoute();
            this.setupQuestionListData();
            accept();
        });
    }

    private getQuestionListDataFromRoute(): any {
        return this.routerAccessor.getDataFromRoute('questionListData');
    }

    protected setupQuestionListData(): void {
        this.questionPageData = this.dataManager.setupQuestionListData(this._reflexiveQuestionData);
    }

    protected isValidatable(): boolean {
        return true;
    }

    protected doValidation(): Promise<boolean> {
        var validator: IQuestionListValidator = this.getQuestionListValidator();
        return validator.validate(this.questionPageData.sectionList).then(response => {
            this.messages = response.errorMessages;
            if (this.messages) {
                //this.moveValidationMessagesIntoView();
            }
            return !response.hasError;
        });
    }

    protected getQuestionListValidator(): IQuestionListValidator {
        return new QuestionListValidator();
    }

    public saveData(): Promise<any> {
        if (this.activeQuestion != null) {
            let questionEditorViewModel: any = this.getQuestionEditorViewModel(this.activeQuestion);
            questionEditorViewModel.saveData();
        }
        this.prepareDataForSave();
        var request = new ReflexiveQuestionRequest();
        request.pageGroup = this.pageGroupId;
        request.pageNumber = this.pageNumber;
        request.questionData = this._reflexiveQuestionData;
        var serviceParams = this.packageServiceParams(
            request,
            BusinessServiceAndMethodIds.ReflexiveQuestionPersistenceService,
            BusinessServiceAndMethodIds.ReflexiveQuestionPersistenceMethod
        );
        return this._dataService.getData(serviceParams).then(dataResponse => {
            return dataResponse.data;
        });
    }

    private packageServiceParams(data: any, serviceId: string, methodId: string): DataServiceParams {
        var params = new DataServiceParams({ serviceId: serviceId, methodId: methodId, data: data });
        return params;
    }

    private prepareDataForSave(): void {
        this.dataManager.prepareDataForSave(this._reflexiveQuestionData, this.questionPageData);
    }
}

export class ReflexiveQuestionRequest {
    static Type: string = 'life.businessService.businessDataModel.request.ReflexiveQuestionRequest, BusinessDataModel';

    $type: string = ReflexiveQuestionRequest.Type;
    questionData: any;
    insuredPersonId: any;
    pageGroup: number;
    pageNumber: number;
    loadLastPage: boolean;
}
