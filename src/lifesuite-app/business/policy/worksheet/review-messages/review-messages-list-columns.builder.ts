import { Injectable } from '@angular/core';
import { RowNode } from 'ag-grid-community';

import { BaseGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';
import { compare } from 'life-core/util';

import { LsCellFormatters, LsCellComparators } from 'ls-core/component/grid';

import { ReviewMessageIconHelper } from './review-message-icon.helper';
import { ReviewMessageDataContext } from './review-message-data-context';

@Injectable()
export class ReviewMessagesListColumnsBuilder extends BaseGridColumnsBuilder {
    private _reviewMessageDataContext: ReviewMessageDataContext;

    private _lsCellFormatters: LsCellFormatters;
    private _lsCellComparators: LsCellComparators;

    constructor(lsCellFormatters: LsCellFormatters, lsCellComparators: LsCellComparators, i18n: I18n) {
        super();
        this._lsCellFormatters = lsCellFormatters;
        this._lsCellComparators = lsCellComparators;
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.getReviewMessagesGridColumns();
        return this.columns;
    }

    public setContext(context: ReviewMessageDataContext): void {
        this._reviewMessageDataContext = context;
    }

    private getReviewMessagesGridColumns(): void {
        this.addColumn({
            headerName: this.i18n({ value: 'Type', id: 'policy.worksheet.reviewmsg.gridheader.type' }),
            field: ReviewMessageGridFields.MessageType,
            cellRenderer: this.getIcon,
            cellRendererParams: { reviewMessagesDataContext: this._reviewMessageDataContext },
            minWidth: 70,
            maxWidth: 70,
            comparator: (messageType1: any, messageType2: any, node1: RowNode, node2: RowNode): number => {
                return this.compareMessageType(messageType1, messageType2, node1, node2);
            }
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Message', id: 'policy.worksheet.reviewmsg.gridheader.message' }),
            field: ReviewMessageGridFields.Message,
            valueFormatter: this.addCommentToReviewMessages,
            suppressSorting: true,
            tooltipField: ReviewMessageGridFields.Message
        });
        this.addColumn({
            headerName: this.i18n({ value: 'Created On', id: 'policy.worksheet.reviewmsg.gridheader.dateadded' }),
            field: ReviewMessageGridFields.AddedDate,
            valueFormatter: this._lsCellFormatters.dateCellFormatter,
            minWidth: 110,
            maxWidth: 110,
            comparator: this._lsCellComparators.datetimeComparator
        });
    }

    private getIcon(params: any): string {
        return ReviewMessageIconHelper.getIcon(params.data, params.reviewMessagesDataContext);
    }

    private addCommentToReviewMessages(params: any): string {
        return params.node.data.ReviewMessageComment && params.node.data.ReviewMessageComment != ''
            ? `${params.value} <br /> Comment: ${params.node.data.ReviewMessageComment}`
            : params.value;
    }

    private compareMessageType(messageType1: any, messageType2: any, node1: RowNode, node2: RowNode): number {
        let reviewMessageType1: number;
        let reviewMessageType2: number;
        const messageTypeCase = this.setMessageTypeCase(messageType1, messageType2);
        switch (messageTypeCase) {
            case MessageTypeNumber.ONE: {
                reviewMessageType1 = this.setReviewMessageType(node1.data, this._reviewMessageDataContext);
                reviewMessageType2 = this.setReviewMessageType(node2.data, this._reviewMessageDataContext);
                break;
            }
            case MessageTypeNumber.TWO: {
                reviewMessageType1 = node1.data.NoteId !== null ? MessageTypeNumber.ONE : MessageTypeNumber.ZERO;
                reviewMessageType2 = node2.data.NoteId !== null ? MessageTypeNumber.ONE : MessageTypeNumber.ZERO;
                break;
            }
            case MessageTypeNumber.THREE: {
                reviewMessageType1 = compare(messageType1, messageType2);
                reviewMessageType2 = compare(messageType2, messageType1);
                break;
            }
        }

        return compare(reviewMessageType1, reviewMessageType2);
    }

    private setMessageTypeCase(messageType1: string, messageType2: string): number {
        return messageType1 === '1' && messageType2 === '1'
            ? MessageTypeNumber.ONE
            : (messageType1 === '2' && messageType2 === '2') ||
              (messageType1 === '3' && messageType2 === '3') ||
              (messageType1 === '2' && messageType2 === '3') ||
              (messageType1 === '3' && messageType2 === '2')
            ? MessageTypeNumber.TWO
            : MessageTypeNumber.THREE;
    }

    private setReviewMessageType(nodeData: any, reviewMessageDataContext: ReviewMessageDataContext): number {
        return ReviewMessageIconHelper.isRequirementReportReceived(nodeData, reviewMessageDataContext)
            ? MessageTypeNumber.ONE
            : MessageTypeNumber.ZERO;
    }
}

const ReviewMessageGridFields = {
    Message: 'Message',
    AddedDate: 'AddedDate',
    MessageType: 'MessageType'
};

const MessageTypeNumber = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3
};
