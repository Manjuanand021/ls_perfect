import {
    Positioning as ngbPositioning,
    Placement,
    PlacementArray
} from '@ng-bootstrap/ng-bootstrap/esm5/util/positioning';

import { DOMUtil } from 'life-core/util';

export class Positioning extends ngbPositioning {
    // Override method to correctly calculate top offset for fixed element
    // Method copied from '@ng-bootstrap/ng-bootstrap/util/positioning,
    offset(element: HTMLElement, round = true): ClientRect {
        const elBcr = element.getBoundingClientRect();
        const viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };

        let elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            // Custom change starts
            // calculate top offset for fixed element
            top: elBcr.top + (DOMUtil.isElementPositionFixed(element) ? 0 : viewportOffset.top),
            // top: elBcr.top + viewportOffset.top,
            // Custom change ends
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };

        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }

        return elOffset;
    }
}

// All code below to the end of file is copied from '@ng-bootstrap/ng-bootstrap/util/positioning
// without any changes

const positionService: ngbPositioning = new Positioning();

/*
   * Accept the placement array and applies the appropriate placement dependent on the viewport.
   * Returns the applied placement.
   * In case of auto placement, placements are selected in order
   *   'top', 'bottom', 'left', 'right',
   *   'top-left', 'top-right',
   *   'bottom-left', 'bottom-right',
   *   'left-top', 'left-bottom',
   *   'right-top', 'right-bottom'.
   * */
export function positionElements(
    hostElement: HTMLElement,
    targetElement: HTMLElement,
    placement: string | Placement | PlacementArray,
    appendToBody?: boolean
): Placement {
    let placementVals: Array<Placement> = Array.isArray(placement) ? placement : [placement as Placement];

    // replace auto placement with other placements
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        [
            'top',
            'bottom',
            'left',
            'right',
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'left-top',
            'left-bottom',
            'right-top',
            'right-bottom'
        ].forEach(function(obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, obj as Placement);
            }
        });
    }

    // coordinates where to position
    let topVal = 0,
        leftVal = 0;
    let appliedPlacement: Placement;
    // get available placements
    let availablePlacements = positionService.getAvailablePlacements(hostElement, targetElement);
    // iterate over all the passed placements
    for (let { item, index } of toItemIndexes(placementVals)) {
        // check if passed placement is present in the available placement or otherwise apply the last placement in the
        // passed placement list
        if (availablePlacements.find(val => val === item) != null || placementVals.length === index + 1) {
            appliedPlacement = <Placement>item;
            const pos = positionService.positionElements(hostElement, targetElement, item, appendToBody);
            topVal = pos.top;
            leftVal = pos.left;
            break;
        }
    }
    targetElement.style.top = `${topVal}px`;
    targetElement.style.left = `${leftVal}px`;
    return appliedPlacement;
}

// function to get index and item of an array
function toItemIndexes<T>(a: T[]) {
    return a.map((item, index) => ({ item, index }));
}
