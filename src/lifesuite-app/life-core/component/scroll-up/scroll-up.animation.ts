import { trigger, state, style, animate, transition } from '@angular/animations';

import { CSS_TRANSITION_LENGTH } from 'life-core/util/animation';

export const ScrollUpVisibilityState = {
    Visible: 'true',
    Hidden: 'false'
};

export const ScrollUpAnimations = [
    trigger('fadeInOut', [
        state(ScrollUpVisibilityState.Visible, style({ opacity: 1, display: 'block' })),
        state(ScrollUpVisibilityState.Hidden, style({ opacity: 0, display: 'none' })),
        transition(
            `${ScrollUpVisibilityState.Visible} => ${ScrollUpVisibilityState.Hidden}`,
            animate(CSS_TRANSITION_LENGTH)
        ),
        transition(
            `${ScrollUpVisibilityState.Hidden} => ${ScrollUpVisibilityState.Visible}`,
            animate(CSS_TRANSITION_LENGTH)
        )
    ])
];
