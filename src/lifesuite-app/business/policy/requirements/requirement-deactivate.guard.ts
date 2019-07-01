import { RequirementsTabChannels } from './detail/requirements-tab.channels';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IViewModel } from 'life-core/view-model';
import { IMessagingService, MessagingService } from 'life-core/messaging';

import { RequirementDTO, MedicalProviderProxyDTO } from 'ls-core/model';
import { APSRequirementCodes } from './detail/tab/tab-view-requirement-detail.component';

/**
 * This deactivation guard validates provider information data.
 * Use this guard with requirement route
 * This guard stops user from navigating away when there is no provider information available for selected requirement
 */
@Injectable()
export class RequirementDeactivateGuard implements CanDeactivate<IViewModel> {
    private _messagingService: IMessagingService;

    constructor(messagingService: MessagingService) {
        this._messagingService = messagingService;
    }

    public canDeactivate(
        target: IViewModel,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> | boolean {
        if (target.componentTreeDeactivating) {
            return Promise.resolve(true);
        }
        const requirement = target['selectedItem'] as RequirementDTO;
        return this.isProviderInfoValid(requirement, true);
    }

    public isProviderInfoValid(requirement: RequirementDTO, showError: boolean): boolean {
        if (
            requirement &&
            this.needToValidateProviderInfo(requirement) &&
            !this.isProviderInformationValid(requirement.medicalProviderProxyDTO)
        ) {
            this.navigateToProviderInfoTab(showError);
            return false;
        }
        return true;
    }

    private isProviderInformationValid(medicalProviderInfo: MedicalProviderProxyDTO): boolean {
        if (
            medicalProviderInfo &&
            (medicalProviderInfo.Company || (medicalProviderInfo.FirstName && medicalProviderInfo.LastName)) &&
            medicalProviderInfo.AddressCity &&
            medicalProviderInfo.AddressState
        ) {
            return true;
        }

        return false;
    }

    // Checks whether requirement is of type APS
    private needToValidateProviderInfo(requirement: RequirementDTO): boolean {
        return APSRequirementCodes.indexOf(requirement.RequirementCode) != -1;
    }

    private navigateToProviderInfoTab(showError: boolean): void {
        this._messagingService.publish(RequirementsTabChannels.NavigateToProviderInfoTab, showError);
    }
}
