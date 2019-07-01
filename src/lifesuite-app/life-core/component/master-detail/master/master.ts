import { Component, Input, OnInit, AfterViewInit, OnDestroy, Optional, ViewChild, EventEmitter } from '@angular/core';

import { CellFocusedEvent, RowNode } from 'ag-grid-community';

import {
    DataGrid,
    IDataGridOptions,
    DataGridRowNumber,
    HEADER_ROW_HEIGHT,
    GridRowDetailHelper
} from 'life-core/component/grid';
import { KeyBoardUtil } from 'life-core/util';
import { ButtonActionType } from 'life-core/component/shared';
import { MasterButton, MasterButtonType } from '../model/master-button';
import { IBaseDataManager, BaseDataManager } from '../manager/base-data-manager';
import { IRowManagementDelegate, RowManagementDelegate } from '../manager/row-management.delegate';
import { ItemEventData, CreateItemEventData } from '../event/item-event-data';
import { AuthorizationData, AuthorizationLevel, AuthorizationProvider } from 'life-core/authorization';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';

@Component({
    selector: 'master',
    templateUrl: './master.html',
    styleUrls: ['./master.css']
})
export class Master<T> implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public gridOptions: IDataGridOptions;

    @Input()
    public title: string;

    @Input()
    public disabled: boolean;

    @Input()
    public showDetailAsPopup: boolean;

    // Currenlty Selected item
    protected selectedItem: T;

    public items: T[];

    public rowCount: number;

    @ViewChild(DataGrid)
    private refDataGrid: DataGrid;

    private _dataManager: IBaseDataManager<any>;

    private _rowManagementDelegate: IRowManagementDelegate<any>;

    private _buttons: MasterButton<T>[];
    private _gridRowDetailHelper: GridRowDetailHelper;

    private _authorizationLevel: AuthorizationLevel;
    private _authorizationProvider: AuthorizationProvider;
    private _authorizationData: AuthorizationData;

    private _subscriptionTracker: SubscriptionTracker;

    public eventEmitterCreateItem: EventEmitter<CreateItemEventData> = new EventEmitter<CreateItemEventData>();
    public eventEmitterRemoveItem: EventEmitter<ItemEventData> = new EventEmitter<ItemEventData>();
    public eventEmitterCancelItem: EventEmitter<ItemEventData> = new EventEmitter<ItemEventData>();
    public eventEmitterSaveItem: EventEmitter<ItemEventData> = new EventEmitter<ItemEventData>();
    public eventEmitterEditItem: EventEmitter<ItemEventData> = new EventEmitter<ItemEventData>();
    public eventEmitterCanDeactivateItem: EventEmitter<ItemEventData> = new EventEmitter<ItemEventData>();

    constructor(
        dataManager: BaseDataManager<any>,
        rowManagementDelegate: RowManagementDelegate<any>,
        gridRowDetailHelper: GridRowDetailHelper,
        @Optional() authorizationProvider: AuthorizationProvider
    ) {
        this._dataManager = dataManager;
        this._rowManagementDelegate = rowManagementDelegate;
        this._authorizationProvider = authorizationProvider;
        this._gridRowDetailHelper = gridRowDetailHelper;
        this.setupAuthorization();
    }

    public ngOnInit(): void {
        this._subscriptionTracker = new SubscriptionTracker();
        this._subscriptionTracker.track(
            this._dataManager.getSelectedItem().subscribe(selectedItem => {
                this.selectedItem = selectedItem;
                this.setButtonsDisabled(selectedItem);
            })
        );
        this._subscriptionTracker.track(
            this._dataManager.getItems().subscribe(items => {
                this.setGridHeight(items);
                this.rowCount = items.length;
                this.items = items;
                if (this.gridOptions && this.gridOptions.api) {
                    this.refreshMasterData();
                }
            })
        );
    }

    protected refreshMasterData(): void {
        this.gridOptions.api.setRowData(this.items);
        this.gridOptions.api.refreshCells({ force: true });
        this.gridOptions.api.sizeColumnsToFit();
    }

    public ngAfterViewInit(): void {
        this.refreshMasterData();
    }

    @Input()
    public set buttons(buttons: MasterButton<T>[]) {
        this._buttons = buttons;
        this.setButtonsDisabled();
        this.setupButtonsAuthorization();
    }

    public get buttons(): MasterButton<T>[] {
        return this._buttons;
    }

    // Component Authorization

    private setupAuthorization(): void {
        this._authorizationData = this._authorizationProvider
            ? this._authorizationProvider.getAuthorizationData()
            : new AuthorizationData(AuthorizationLevel.EDIT);
    }

    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.setupButtonsAuthorization();
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    public onRowClicked($event: any): void {
        this.handleRowGetFocus($event.node);
        if (KeyBoardUtil.isCtrlClick($event.event)) {
            this.onCtrlClick($event.node);
        }
    }

    protected onCtrlClick(node: RowNode): void {
        if (this.gridOptions.enableRowDetail) {
            this._gridRowDetailHelper.openRowDetailDialog(this.gridOptions, node);
        }
    }

    public onRowDoubleClicked($event: any): void {
        if (!this.showDetailAsPopup) return;

        if (this.canEditItem()) {
            this.handleRowGetFocus($event.node);
            this.editItem(this.selectedItem);
        }
    }

    public onCellFocused(event: CellFocusedEvent): void {
        this.gridOptions.api.forEachNode(node => {
            if (node.rowIndex == event.rowIndex) {
                this.handleRowGetFocus(node);
                return;
            }
        });
    }

    private handleRowGetFocus(node: RowNode): void {
        const selectedItemId = this.selectedItem ? this.getItemId(this.selectedItem) : null;
        if (node.id == selectedItemId) return;
        const newItem = node.data;
        const fnSelectItem: Function = (canContinue: boolean) => {
            if (canContinue) {
                this._dataManager.setSelectedItem(newItem);
            } else {
                this.showAndSelectItem(this.selectedItem);
            }
        };
        if (!this.showDetailAsPopup && this.selectedItem) {
            this.saveItemImpl(this.selectedItem, fnSelectItem);
        } else {
            fnSelectItem(true);
        }
    }

    public clearSelection(): void {
        this.refDataGrid.api.deselectAll();
        this._dataManager.setSelectedItem(null);
    }

    public setActiveItem(item: T): void {
        this.showAndSelectItem(item);
        this._dataManager.setSelectedItem(item);
    }

    // Action handlers
    public onButtonClick(button: MasterButton<T>): void {
        if (button.handler) {
            button.handler(this.selectedItem);
        } else {
            switch (button.type) {
                case MasterButtonType.ADD:
                    this.createItem();
                    break;
                case MasterButtonType.CANCEL:
                    this.cancelItem(this.selectedItem);
                    break;
                case MasterButtonType.SAVE:
                    this.saveItem(this.selectedItem);
                    break;
                case MasterButtonType.EDIT:
                    this.editItem(this.selectedItem);
                    break;
                case MasterButtonType.DELETE:
                    this.removeItem(this.selectedItem);
                    break;
            }
        }
    }

    // Button 'Add' handler
    public createItem(): void {
        const fnCreateItem: Function = (canContinue: boolean) => {
            if (canContinue) {
                this.eventEmitterCreateItem.emit(
                    new CreateItemEventData(null, item => {
                        this.showAndSelectItem(item);
                    })
                );
            } else {
                this.showAndSelectItem(this.selectedItem);
            }
        };
        if (this.selectedItem) {
            this.saveItemImpl(this.selectedItem, fnCreateItem);
        } else {
            fnCreateItem(true);
        }
    }

    private showAndSelectItem(item: T): void {
        if (item == null) {
            this.clearSelection();
            return;
        }
        const newItemId: any = this.getItemId(item);
        this.gridOptions.api.forEachNode(node => {
            if (node.id == newItemId.toString()) {
                this.gridOptions.api.ensureNodeVisible(node);
                node.setSelected(true);
            }
        });
    }

    // Button 'Cancel' and item 'click' handler.
    // Method needs to return 'true' to allow event propagation.
    public cancelItem(item: T): boolean {
        if (item) {
            this.eventEmitterCancelItem.emit(new ItemEventData(this.selectedItem, null));
        }
        return true;
    }

    // Button 'Save' handler
    public saveItem(item: T): void {
        if (item) {
            this.saveItemImpl(item);
        }
    }

    private saveItemImpl(item: T, callback: Function = result => {}): void {
        this.eventEmitterCanDeactivateItem.emit(
            new ItemEventData(item, (canDeactivate: boolean) => {
                if (canDeactivate) {
                    this.eventEmitterSaveItem.emit(
                        new ItemEventData(item, (result: boolean) => {
                            callback(result);
                        })
                    );
                } else {
                    callback(false);
                }
            })
        );
    }

    // Button 'Edit' handler
    public editItem(item: T): void {
        if (item) {
            this.eventEmitterEditItem.emit(new ItemEventData(item, null));
        }
    }

    // Button 'Remove' handler
    public removeItem(item: T): void {
        if (item) {
            this.eventEmitterRemoveItem.emit(new ItemEventData(item, (result: boolean) => {}));
        }
    }

    protected getItemId(item: T): any {
        return item[this._rowManagementDelegate.itemDataIDPropertyName];
    }

    private getButton(buttonType: string): MasterButton<T> {
        return this.buttons.find(button => button.type == buttonType);
    }

    private canEditItem(): boolean {
        const editButton = this.getButton(MasterButtonType.EDIT);
        return (
            !this.disabled &&
            (editButton && !editButton.disabled && editButton.authorizationLevel > AuthorizationLevel.VIEW)
        );
    }

    // Authorization
    private setupButtonsAuthorization(): void {
        this.buttons.forEach(button => {
            if (button.authorizationLevel == undefined) {
                this.setButtonAuthorizationLevel(button);
            }
        });
    }

    private setButtonAuthorizationLevel(button: MasterButton<T>): void {
        const authorizationLevel = this._authorizationData.getLevel(button.type);
        const isDataChangeButton = button.actionType == ButtonActionType.DataChange || button.actionType == undefined;
        button.authorizationLevel = isDataChangeButton
            ? authorizationLevel == AuthorizationLevel.EDIT
                ? authorizationLevel
                : AuthorizationLevel.NONE
            : authorizationLevel;
    }

    private setButtonsDisabled(item?: T): void {
        this.buttons.forEach(button => {
            if (button.disableHandler) {
                button.disabled = button.disableHandler(item);
            } else if (button.type != MasterButtonType.ADD) {
                button.disabled = !item;
            }
        });
    }

    // Clean up methods

    public ngOnDestroy(): void {
        this.refDataGrid = null;
        this.destroyEventEmitters();
        this._subscriptionTracker.destroy();
    }

    private destroyEventEmitters(): void {
        this.eventEmitterCreateItem.unsubscribe();
        this.eventEmitterRemoveItem.unsubscribe();
        this.eventEmitterCancelItem.unsubscribe();
        this.eventEmitterSaveItem.unsubscribe();
        this.eventEmitterCanDeactivateItem.unsubscribe();
    }

    // Layout
    private setGridHeight(items: T[]): void {
        this.gridOptions.height = `${this.calculateGridHeight(items.length)}px`;
    }

    private calculateGridHeight(numberOfItems: number): number {
        const maxVisibleRows = this.gridOptions.rows || DataGridRowNumber.Medium;
        // Set number of visible rows between [maxVisibleRows/2 : maxVisibleRows],
        // depending on actual number of rows.
        const MinVisibleRowsAdjustFactor = 2;
        const minRowsToShow = Math.ceil(maxVisibleRows / MinVisibleRowsAdjustFactor);
        const maxRowsToShow = Math.min(numberOfItems, maxVisibleRows);
        const rowsToShow = Math.max(minRowsToShow, maxRowsToShow);
        const rowsHeight = rowsToShow * this.gridOptions.rowHeight;
        const headerHeight = this.gridOptions.headerHeight ? this.gridOptions.headerHeight : HEADER_ROW_HEIGHT;
        return rowsHeight + headerHeight;
    }
}
