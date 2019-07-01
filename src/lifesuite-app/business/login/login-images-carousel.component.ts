import { Component } from '@angular/core';
import { ICarouselItem, CarouselItemResources } from './carousel-item.rc';

@Component({
    selector: 'login-images-carousel',
    templateUrl: './login-images-carousel.component.html',
    styleUrls: ['./login-images-carousel.component.css']
})
export class LoginImagesCarouselComponent {
    public productsArray: Array<ICarouselItem>;

    private _carouselItems: CarouselItemResources;

    constructor(carouselItems: CarouselItemResources) {
        this._carouselItems = carouselItems;
        this.productsArray = [
           // this._carouselItems.id3CarouselItem,
           // this._carouselItems.lpesCarouselItem,
           // this._carouselItems.lsauCarouselItem
        ];
    }
}
