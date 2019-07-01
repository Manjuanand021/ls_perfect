import { Directive, ElementRef } from '@angular/core';

import { AuthorizationData, AuthorizationLevel, AuthorizationProvider } from 'life-core/authorization';
import { SecureComponent } from './secure-component';

@Directive({
    selector: '[secureComponent]'
})
export class SecureComponentDirective {
    protected authorizationProvider: AuthorizationProvider;
    protected secureComponent: SecureComponent;
    protected elementRef: ElementRef<HTMLElement>;

    constructor(
        secureComponent: SecureComponent,
        authorizationProvider: AuthorizationProvider,
        elementRef: ElementRef<HTMLElement>
    ) {
        this.secureComponent = secureComponent;
        this.authorizationProvider = authorizationProvider;
        this.elementRef = elementRef;
    }

    public ngOnInit(): void {
        this.setupSecureComponent();
    }

    protected setupSecureComponent(): void {
        const componentName = this.getComponentName();
        const authorizationData = this.authorizationProvider.getAuthorizationData();
        this.secureComponent.authorizationLevel = this.getAuthorizationLevel(componentName, authorizationData);
    }

    private getComponentName(): string {
        return this.secureComponent.name || this.elementRef.nativeElement.getAttribute('name');
    }

    private getAuthorizationLevel(componentName: string, authorizationData: AuthorizationData): AuthorizationLevel {
        return authorizationData.getLevel(componentName);
    }
}
