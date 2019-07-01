import { Component, Input, forwardRef, ViewChild, OnDestroy } from '@angular/core';

import { IDataGridOptions } from 'life-core/component/grid';
import { Master } from './master/master';
import { Detail } from './detail/detail';
import { MasterButton } from './model/master-button';
import { AuthorizationLevel } from 'life-core/authorization';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from 'life-core/component/authorization';

@Component({
    selector: 'master-detail',
    templateUrl: './master-detail.html',
    styleUrls: ['./master-detail.css'],
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => MasterDetail) }]
})
export class MasterDetail<T> implements ISecureComponent {
    @ViewChild(Master)
    protected refMaster: Master<T>;

    @ViewChild(Detail)
    protected refDetail: Detail;

    @Input()
    public gridOptions: IDataGridOptions;

    @Input()
    public buttons: MasterButton<T>[];

    @Input()
    public name: string = '';

    @Input()
    public title: string;

    @Input()
    public showDetailAsPopup: boolean;

    private _authorizationLevel: AuthorizationLevel;

    private _disabled: boolean;

    private _hidden: boolean;

    public get master(): Master<T> {
        return this.refMaster;
    }

    public get detail(): Detail {
        return this.refDetail;
    }

    public getItemViewModel(): any {
        return this.refDetail.getItemViewModel();
    }

    @Input()
    public set disabled(value: boolean) {
        this.updateDisabled(value);
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public setActiveItem(item: T): void {
        this.master.setActiveItem(item);
    }

    // Component Authorization
    @Input() // TODO: Remove after html pages are adjusted to use securComponent directive
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateDisabled(this._disabled);
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateDisabled(value: boolean): void {
        this._disabled = !AuthorizationUtil.isLayoutComponentEnabled(this._authorizationLevel) ? true : value;
    }

    protected updateHidden(value: boolean): void {
        this._hidden = !AuthorizationUtil.isLayoutComponentVisible(this._authorizationLevel) ? true : value;
    }
}
