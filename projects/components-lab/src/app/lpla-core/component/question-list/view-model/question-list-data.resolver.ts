import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { BusinessServiceAndMethodIds, DataServiceParams, DataService, ViewDataService } from 'lpla-core/service';
import { IQuestionListViewModel, ReflexiveQuestionRequest } from './question-list.vm';
/**
 * Loads question data for question list class.
 * Used as a Resolve class in the Routing table for QuestionListViewModel-derived classes.
 */
@Injectable()
export class QuestionListDataResolver implements Resolve<string> {
    constructor(private _dataService: DataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        let request = new ReflexiveQuestionRequest();
        request.pageGroup = this.getPageGroupId(route, state);
        request.pageNumber = this.getPageNumber(route, state);
        var serviceParams = this.packageServiceParams(
            request,
            BusinessServiceAndMethodIds.ReflexiveQuestionRetrievalService,
            BusinessServiceAndMethodIds.ReflexiveQuestionRetrievalMethod
        );
        return this._dataService.getData(serviceParams).then(dataResponse => {
            return dataResponse.data.questionData;
        });
    }

    private getPageGroupId(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number {
        let component: any = route.component;
        let pageGroupId: number = (<IQuestionListViewModel>component).pageGroupId;
        if (pageGroupId === null) {
            throw new Error('Undefined PageGroupId.');
        }
        return pageGroupId;
    }

    private getPageNumber(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number {
        let component: any = route.component;
        let pageNumber: number = (<IQuestionListViewModel>component).pageNumber;
        if (!pageNumber === null) {
            throw new Error('Undefined PageNumber.');
        }
        return pageNumber;
    }

    private packageServiceParams(data: any, serviceId: string, methodId: string): DataServiceParams {
        var params = new DataServiceParams({ serviceId: serviceId, methodId: methodId, data: data });
        return params;
    }
}
