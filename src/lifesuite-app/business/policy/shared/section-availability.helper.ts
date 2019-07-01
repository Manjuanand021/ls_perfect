export class SectionAvailabilityHelper {
    public static isSectionVisible(
        availableSectionsForAllPlans: any[],
        lineOfBusiness: string,
        section: string
    ): boolean {
        const sectionsToDisplay = this.getSectionsAllowedToDisplay(availableSectionsForAllPlans, lineOfBusiness);
        return sectionsToDisplay.findIndex(sec => sec.toLowerCase() == section) >= 0;
    }

    private static getSectionsAllowedToDisplay(availableSectionsForAllPlans: any[], lineOfBusiness: string): string[] {
        return availableSectionsForAllPlans
            .find(config => config.value.toLowerCase() == lineOfBusiness)
            .label.split(',');
    }
}
