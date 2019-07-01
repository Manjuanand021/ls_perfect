import { Type, Injectable, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';

@Injectable()
export class ComposeService {
    private _componentFactoryResolver: ComponentFactoryResolver;

    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        this._componentFactoryResolver = componentFactoryResolver;
    }

    public create(component: Type<any>, vcRef: ViewContainerRef): ComponentRef<any> {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
        return vcRef.createComponent(componentFactory);
    }
}
