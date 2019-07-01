import { trigger, style, animate, transition } from '@angular/animations';
import { CSS_TRANSITION_LENGTH } from 'life-core/util/animation';

export const ItemListAnimations = [
    trigger('fadeInOut', [
        transition(':enter', [style({ opacity: '0' }), animate(CSS_TRANSITION_LENGTH, style({ opacity: '1' }))]),
        transition(':leave', [style({ opacity: '1' }), animate(CSS_TRANSITION_LENGTH, style({ opacity: '0' }))])
    ])
];
