import {
    Component,
    ComponentRef,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Type,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { ComposeService } from './compose.service';
import { IndexSignatureUtil } from 'life-core/util/lang';

@Component({
    selector: 'compose',
    template: `
        <div #placeholder></div>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Wrapper component to load any component dynamically.
 */
export class Compose implements OnInit, OnChanges, OnDestroy {
    /**
     * Class Type of dynamic component.
     */
    @Input()
    public componentType: Type<any>;

    /**
     * Data model to be used with dynamic component.
     */
    @Input()
    public model: any;

    @ViewChild('placeholder', { read: ViewContainerRef })
    private _viewContainerRef: ViewContainerRef;

    private _componentRef: ComponentRef<any>;

    private _composeService: ComposeService;

    constructor(composeService: ComposeService) {
        this._composeService = composeService;
    }

    public ngOnInit(): void {
        // Because ngOnChanges() is executed before ngOnInit(), we need to comment
        // out the line below
        // see https://github.com/angular/angular/issues/7782
        // this.onComponentTypeChange();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.isComponentTypeChange(changes) || this.isComponentTypeAndModelChange(changes)) {
            this.onComponentTypeChange();
        } else if (this.isModelChange(changes)) {
            this.onModelChange();
        }
    }

    private isComponentTypeAndModelChange(changes: SimpleChanges): boolean {
        return this.isComponentTypeChange(changes) && this.isModelChange(changes);
    }

    private isComponentTypeChange(changes: SimpleChanges): boolean {
        return IndexSignatureUtil.isIndexInIndexSignature(changes, 'componentType');
    }

    private isModelChange(changes: SimpleChanges): boolean {
        return IndexSignatureUtil.isIndexInIndexSignature(changes, 'model');
    }

    private onComponentTypeChange(): void {
        if (this._componentRef != null) {
            this._componentRef.destroy();
        }
        if (this.componentType != null) {
            this._componentRef = this._composeService.create(this.componentType, this._viewContainerRef);
        }
        this.setModel();
    }

    private setModel(): void {
        if (this.componentType != null && this.model) {
            if (this.isICompose(this._componentRef.instance)) {
                this._componentRef.instance.setModel(this.model);
            } else {
                throw new Error(
                    `Component ${this._componentRef.instance.constructor.name} needs to implement ICompose interface.`
                );
            }
        }
    }

    private isICompose(component: any): component is ICompose {
        return component['setModel'] != undefined;
    }

    public onModelChange(): void {
        this.setModel();
    }

    /**
     * Returns currently loaded dynamic component
     */
    public get component(): any {
        return this._componentRef.instance;
    }

    public ngOnDestroy(): void {
        if (this._componentRef) {
            this._componentRef.destroy();
        }
        if (this._viewContainerRef) {
            this._viewContainerRef.clear();
            this._viewContainerRef = undefined;
        }
    }
}

export interface ICompose {
    setModel(model: any): void;
}
