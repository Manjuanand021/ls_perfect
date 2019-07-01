import {
    Component,
    Injectable,
    Input,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    QueryList,
    EventEmitter
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Compose } from 'life-core/component/compose';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { QuestionData, questionAnswerValues } from './question.model';
import { QuestionTopics } from './question-topics';
import { CSS_TRANSITION_LENGTH, SCROLL_SPEED } from 'life-core/util';
import { scrollTo } from 'lpla-core/util';

@Component({
    selector: 'question',
    templateUrl: './question.html',
    styleUrls: ['./question.css']
})
@Injectable()
export class Question implements OnInit, OnDestroy {
    @Input() data: QuestionData;

    @ViewChild(Compose) refComposeDetail: Compose;

    public displayDetailLink: boolean;

    @ViewChild('refDOMDetail') refDOMDetail: ElementRef;

    public eventEmitterQuestionAnswerChanged: EventEmitter<QuestionData> = new EventEmitter<QuestionData>();

    public eventEmitterActiveDetailClosed: EventEmitter<any> = new EventEmitter<any>();

    private _subscriptions: Subscription[] = [];

    protected _confirmDialog: ConfirmDialog;

    public isDetailVisible: boolean;

    constructor(confirmDialog: ConfirmDialog) {
        this._confirmDialog = confirmDialog;
    }

    public ngOnInit() {
        this.data.isDetailActive = false;
        this.setDetailLinkVisibility();
    }

    public onAnswerChanged(value: string) {
        var newValue = parseInt(value);
        this.data.answer = newValue.toString();
        var displayDetail: boolean = this.needToDisplayDetail(newValue);
        if (displayDetail) {
            this.showDetail();
        } else {
            this.hideDetail();
        }
        this.setDetailLinkVisibility();
        if (newValue != questionAnswerValues.NONE && newValue != null) {
            this.data.invalidAnswer = false;
            this.eventEmitterQuestionAnswerChanged.emit(this.data);
        }
    }

    private onDetailActiveChanged(newValue: boolean, callback: Function) {
        this.data.isDetailActive = newValue;
        if (newValue == true) {
            this.isDetailVisible = newValue;
            this.setDetailLinkVisibility();
            if (callback) callback();
        } else {
            let context: Question = this;
            var onDetailHidden = function() {
                context.isDetailVisible = false;
                context.setDetailLinkVisibility();
                if (callback) callback();
            };
            this.animateHideDetail(onDetailHidden);
        }
    }

    private needToDisplayDetail(newValue: number): boolean {
        return (
            newValue == this.data.triggerValue &&
            this.data.detailQuestionPageName != null &&
            this.data.detailQuestionPageName != ''
        );
    }

    private setDetailLinkVisibility(): void {
        var answer = parseInt(this.data.answer);
        this.displayDetailLink = !this.data.isDetailActive && this.needToDisplayDetail(answer);
    }

    public showDetail(): void {
        var context: Question = this;
        var onActiveDetailClosed = function() {
            context.onDetailActiveChanged(true, null);
            context.animateShowDetail(context);
        };
        this.eventEmitterActiveDetailClosed.emit({ callback: onActiveDetailClosed });
    }

    public hideDetail(): void {
        this.onDetailActiveChanged(false, null);
    }

    private animateShowDetail(context: Question): void {
        setTimeout(() => {
            let detailElement: HTMLElement = context.refDOMDetail.nativeElement;
            detailElement.style.display = 'block';
            scrollTo(detailElement.offsetTop);
        }, CSS_TRANSITION_LENGTH);
    }

    private animateHideDetail(callback: Function): void {
        // if (this.refDOMDetail) {
        //     $(this.refDOMDetail.nativeElement).slideUp(SCROLL_SPEED, () => {
        //         callback();
        //     });
        // } else {
        //     callback();
        // }
    }

    public ngOnDestroy() {
        this.destroyObservers();
    }

    private destroyObservers(): void {
        for (var observer of this._subscriptions) {
            observer.unsubscribe();
        }
    }

    public getQuestionEditorViewModel(): any {
        return this.refComposeDetail.component;
    }

    public saveDetail(): void {
        this.getQuestionEditorViewModel()
            .saveData()
            .then(() => {
                //this.showDataSavedMessage();
                this.hideDetail();
            });
    }

    protected showDataSavedMessage() {
        this._confirmDialog.open({
            message: 'Data saved.',
            title: 'Question Detail',
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }
}
