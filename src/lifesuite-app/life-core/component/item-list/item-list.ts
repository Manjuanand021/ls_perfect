import {
    Component,
    Input,
    AfterViewInit,
    OnDestroy,
    Optional,
    ViewChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    QueryList,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Compose } from 'life-core/component/compose';
import { AuthorizationData, AuthorizationLevel, AuthorizationProvider } from 'life-core/authorization';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from 'life-core/component/authorization';
import { ButtonActionType } from 'life-core/component/shared';
import { ItemListAnimations } from 'life-core/component/item-list/animations/animations';
import { CSS_TRANSITION_LENGTH, ViewportBlockTypes, AnimationTransitionBehaviour } from 'life-core/util/animation';

import { IItem } from './model/item';
import { ItemListButton, ItemListButtonType } from './model/item-list-button';
import { ItemEventData, CreateItemEventData } from './event/item-event-data';
import { ItemListButtonLabels } from './model/item-list-button-labels';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.html',
    styleUrls: ['./item-list.css'],
    animations: ItemListAnimations,
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => ItemList) }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemList<TItemData> implements AfterViewInit, OnDestroy, ISecureComponent {
    // Observable data stream of Items;
    @Input()
    public oItems: Observable<IItem<TItemData>[]>;

    @Input()
    public editModeOnly: boolean = false;

    @Input()
    public name: string;

    // Compose references for each item
    @ViewChildren(Compose)
    protected refComposeList: QueryList<Compose>;

    // DOM element references for each item
    @ViewChildren('refItemElement')
    protected refItemElementList: QueryList<ElementRef<HTMLDivElement>>;

    protected items: IItem<TItemData>[];

    // Currenlty Selected item
    public selectedItem: IItem<TItemData>;
    public eventEmitterCreateItem: EventEmitter<CreateItemEventData<TItemData>> = new EventEmitter<
        CreateItemEventData<TItemData>
    >();
    public eventEmitterRemoveItem: EventEmitter<ItemEventData<TItemData>> = new EventEmitter<
        ItemEventData<TItemData>
    >();
    public eventEmitterEditItem: EventEmitter<ItemEventData<TItemData>> = new EventEmitter<ItemEventData<TItemData>>();
    public eventEmitterSaveItem: EventEmitter<ItemEventData<TItemData>> = new EventEmitter<ItemEventData<TItemData>>();
    public eventEmitterCanDeactivateItem: EventEmitter<ItemEventData<TItemData>> = new EventEmitter<
        ItemEventData<TItemData>
    >();

    private _authorizationLevel: AuthorizationLevel;
    private _authorizationProvider: AuthorizationProvider;
    private _authorizationData: AuthorizationData;
    private _disabled: boolean;

    private _buttons: ItemListButton[];
    private _itemListButtonLabels: ItemListButtonLabels;

    private _hidden: boolean;

    private _subscriptions: Subscription[] = [];
    private _cd: ChangeDetectorRef;

    constructor(
        cd: ChangeDetectorRef,
        @Optional() authorizationProvider: AuthorizationProvider,
        itemListButtonLabels: ItemListButtonLabels
    ) {
        this._cd = cd;
        this._authorizationProvider = authorizationProvider;
        this._itemListButtonLabels = itemListButtonLabels;
        this.setupAuthorization();
    }

    public ngAfterViewInit(): void {
        this._subscriptions.push(
            this.oItems.subscribe(items => {
                this.items = items;
                items.forEach((item, index) => this.setupItem(item, index));
            })
        );

        this.scrollToActiveItem();
    }

    public ngOnDestroy(): void {
        this.destroyObservers();
        this.destroyEventEmitters();
    }

    @Input()
    public set buttons(buttons: ItemListButton[]) {
        this._buttons = buttons;
        this.setupButtons();
    }

    public get buttons(): ItemListButton[] {
        return this._buttons;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    @Input()
    public set disabled(value: boolean) {
        if (!value) {
            this._disabled = false;
        } else {
            this.updateDisabled(value);
        }
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    public getItemViewModel(item: IItem<TItemData>): any {
        const compose = this.itemCompose(item);
        if (compose) {
            return this.itemCompose(item).component;
        }
    }

    // Action handlers

    public onButtonClick(button: ItemListButton, item: IItem<TItemData>): void {
        switch (button.type) {
            case ItemListButtonType.ADD:
                this.createItem();
                break;
            case ItemListButtonType.EDIT:
                this.editItem(item);
                break;
            case ItemListButtonType.SAVE:
                this.saveItem(item);
                break;
            case ItemListButtonType.DELETE:
                this.deleteItem(item);
                break;
            default:
                button.handler(item);
        }
    }

    // Button 'Add' handler
    public createItem(): void {
        const fnCreateItem: Function = () => {
            this.eventEmitterCreateItem.emit(
                new CreateItemEventData<TItemData>(null, item => {
                    this.selectedItem = item;
                    this.scrollToItem(item);
                })
            );
        };
        if (this.selectedItem) {
            this.saveItemAndDoAction(this.selectedItem, fnCreateItem);
        } else {
            fnCreateItem();
        }
    }

    // Button 'Edit' and item 'click' handler.
    // Method needs to return 'true' to allow event propagation.
    public editItem(item: IItem<TItemData>): boolean {
        if (this.selectedItem && this.selectedItem == item) {
            return true;
        }
        const fnEditItem: Function = () => {
            this.eventEmitterEditItem.emit(
                new ItemEventData<TItemData>(item, () => {
                    item.itemSelectedService.setSelected(true);
                })
            );
            this._cd.markForCheck();
        };
        if (this.selectedItem) {
            this.saveItemAndDoAction(this.selectedItem, fnEditItem);
        } else {
            fnEditItem(item);
        }
        return true;
    }

    // Button 'Save' handler
    public saveItem(item: IItem<TItemData>): void {
        this.saveItemAndDoAction(item, () => {});
    }

    // Button 'Delete' handler
    public deleteItem(item: IItem<TItemData>): void {
        this.eventEmitterRemoveItem.emit(
            new ItemEventData<TItemData>(item, (result: boolean) => {
                if (result) {
                    this.animateRemoveItem(item);
                    if (this.selectedItem == item) {
                        this.selectedItem = null;
                    }
                }
            })
        );
    }

    public isButtonVisible(buttonType: string, itemIndex: number): boolean {
        if (this.items) {
            if (buttonType == ItemListButtonType.ADD) {
                return itemIndex == this.items.length - 1;
            } else if (buttonType == ItemListButtonType.EDIT) {
                return !this.items[itemIndex].selected;
            } else if (buttonType == ItemListButtonType.SAVE) {
                return this.items[itemIndex].selected;
            }
        }
        return true;
    }

    public isButtonDisabledWhenNoItems(buttonType: string): boolean {
        return (
            buttonType === ItemListButtonType.DELETE ||
            buttonType === ItemListButtonType.SAVE ||
            buttonType === ItemListButtonType.EDIT
        );
    }

    // Authorization

    // Component Authorization

    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.setupButtonsAuthorization();
        this.updateHidden(this._hidden);
        this.updateDisabled(this._disabled);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateHidden(value: boolean): void {
        this._hidden = !AuthorizationUtil.isLayoutComponentVisible(this._authorizationLevel) ? true : value;
    }

    private setupButtons(): void {
        for (const button of this._buttons) {
            this.setupButton(button);
        }
    }

    private setupButton(button: ItemListButton): void {
        if (!button.label) {
            button.label = this._itemListButtonLabels.byType[button.type];
        }
    }

    private setupItem(item: IItem<TItemData>, index: number): void {
        item.updateViewModelType();
        this.setupItemSelectionSubscription(item);
        item.index = index;
        item.visible = true;
    }

    private setupItemSelectionSubscription(item: IItem<TItemData>): void {
        this._subscriptions.push(
            item.itemSelectedService.isSelectedSubject.subscribe(value => {
                this.itemSelectionChanged(item, value);
            })
        );
    }

    private itemSelectionChanged(item: IItem<TItemData>, newValue: boolean): void {
        item.selected = newValue;
        if (newValue == true) {
            if (this.selectedItem && this.selectedItem != item) {
                this.selectedItem.itemSelectedService.setSelected(false);
            }
            this.selectedItem = item;
        }
        item.updateViewModelType();
    }

    private saveItemAndDoAction(item: IItem<TItemData>, action: Function): void {
        this.eventEmitterCanDeactivateItem.emit(
            new ItemEventData<TItemData>(item, (canDeactivate: boolean) => {
                item.invalid = !canDeactivate;
                if (canDeactivate) {
                    this.eventEmitterSaveItem.emit(
                        new ItemEventData<TItemData>(item, (result: boolean) => {
                            this.onItemSaved(result, item);
                            if (result) {
                                action();
                            }
                        })
                    );
                } else {
                    this.scrollToItem(item);
                }
            })
        );
    }

    private onItemSaved(result: boolean, item: IItem<TItemData>): void {
        if (result) {
            item.itemSelectedService.setSelected(false);
            if (item == this.selectedItem) {
                this.selectedItem = null;
            }
            this._cd.markForCheck();
        }
    }

    private setupAuthorization(): void {
        this._authorizationData = this._authorizationProvider
            ? this._authorizationProvider.getAuthorizationData()
            : new AuthorizationData(AuthorizationLevel.EDIT);
    }

    private setupButtonsAuthorization(): void {
        this.buttons.forEach(button => {
            if (button.authorizationLevel == undefined) {
                this.setButtonAuthorizationLevel(button);
            }
        });
    }

    private setButtonAuthorizationLevel(button: ItemListButton): void {
        const authorizationLevel = this._authorizationData.getLevel(button.type);
        button.authorizationLevel =
            button.actionType == ButtonActionType.DataChange
                ? authorizationLevel == AuthorizationLevel.EDIT
                    ? authorizationLevel
                    : AuthorizationLevel.NONE
                : authorizationLevel;
    }

    protected updateDisabled(value: boolean): void {
        this._disabled = !AuthorizationUtil.isLayoutComponentEnabled(this._authorizationLevel) ? true : value;
    }

    // Utility methods

    private itemCompose(item: IItem<TItemData>): Compose {
        return this.refComposeList.filter(compose => <IItem<TItemData>>compose.model == item)[0];
    }

    private itemElement(item: IItem<TItemData>): any {
        const nativeItemElements = this.refItemElementList.map(elemRef => elemRef.nativeElement);
        return nativeItemElements.find(elem => {
            return elem.id == item.sequenceId.toString();
        });
    }

    private getActiveItemElement(): any {
        const nativeItemElements = this.refItemElementList.map(elemRef => elemRef.nativeElement);
        return nativeItemElements.find(elem => {
            return elem.children[1].classList.contains('lf-item-selected');
        });
    }

    // Animation
    private animateRemoveItem(item: IItem<TItemData>): void {
        if (this.items.length > 0) {
            this.scrollToItem(this.items[0]);
        }
    }

    private scrollToItem(item: IItem<TItemData>): void {
        setTimeout(() => {
            this.scrollItemIntoView(this.itemElement(item), AnimationTransitionBehaviour.Smooth);
        }, CSS_TRANSITION_LENGTH);
    }

    private scrollToActiveItem(): void {
        setTimeout(() => {
            this.scrollItemIntoView(this.getActiveItemElement(), AnimationTransitionBehaviour.Instant);
        }, CSS_TRANSITION_LENGTH);
    }

    private scrollItemIntoView(itemElement: any, transitionBehaviour: AnimationTransitionBehaviour): void {
        if (itemElement) {
            itemElement.scrollIntoView({
                block: ViewportBlockTypes.Center,
                behavior: transitionBehaviour
            });
        }
    }

    // Clean up methods

    private destroyObservers(): void {
        for (const subscription of this._subscriptions) {
            subscription.unsubscribe();
        }
    }

    private destroyEventEmitters(): void {
        this.eventEmitterCreateItem.unsubscribe();
        this.eventEmitterRemoveItem.unsubscribe();
        this.eventEmitterEditItem.unsubscribe();
        this.eventEmitterSaveItem.unsubscribe();
        this.eventEmitterCanDeactivateItem.unsubscribe();
    }
}
