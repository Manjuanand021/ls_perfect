import { CombinedFormInputs } from 'life-core/component/form';
import { IViewModel } from '../view-model';

/**
 * The registry class to keep relations between paren-child views on a page.
 */
export class ParentChildRegistry {
    private _root: IViewModel;

    private _children: IViewModel[];

    constructor() {
        this._children = [];
    }

    public register(viewModel: IViewModel): void {
        if (this.root) {
            this.registerAsChild(viewModel);
        } else {
            this.registerAsRoot(viewModel);
        }
    }

    public unregister(viewModel: IViewModel): void {
        if (this.isChild(viewModel)) {
            this.unRegisterAsChild(viewModel);
        }
    }

    private registerAsRoot(viewModel: IViewModel): void {
        this._root = viewModel;
    }

    private registerAsChild(viewModel: IViewModel): void {
        this._children.push(viewModel);
    }

    private unRegisterAsChild(viewModel: IViewModel): void {
        this._children.splice(this._children.indexOf(viewModel), 1);
    }

    public get root(): IViewModel {
        return this._root;
    }

    public get children(): IViewModel[] {
        return this._children;
    }

    public getChildrenOf(viewModel: IViewModel): IViewModel[] {
        let children: IViewModel[] = [];
        if (this.isRoot(viewModel)) {
            children = this._children;
        } else {
            // This assumes all inner components are added
            // to the children[] array after outer component.
            const viewModelIndex = this._children.indexOf(viewModel);
            children = this._children.filter(child => {
                return this._children.indexOf(child) > viewModelIndex;
            });
        }
        return children;
    }

    public getParentsOf(viewModel: IViewModel): IViewModel[] {
        let parents: IViewModel[] = [];
        if (!this.isRoot(viewModel)) {
            // This assumes all inner components are added
            // to the children[] array after outer component.
            const viewModelIndex = this._children.indexOf(viewModel);
            parents = this._children.filter(child => {
                return this._children.indexOf(child) < viewModelIndex;
            });
            parents.unshift(this._root);
        }
        return parents;
    }

    public isRoot(viewModel: IViewModel): boolean {
        return viewModel === this._root;
    }

    public isChild(viewModel: IViewModel): boolean {
        return this._children.indexOf(viewModel) >= 0;
    }

    public get combinedFormInputs(): CombinedFormInputs {
        const formInputs: CombinedFormInputs = [];
        formInputs.push(this._root.getFormInputs());
        this._children.forEach(child => {
            formInputs.push(child.getFormInputs());
        });
        return formInputs;
    }
}
