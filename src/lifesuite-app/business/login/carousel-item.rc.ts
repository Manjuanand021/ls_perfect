import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

export interface ICarouselItem {
    url: string;
    label: string;
    description: string;
}

@Injectable()
export class CarouselItemResources {
    protected i18n: I18n;
    public id3CarouselItem: ICarouselItem;
    public lpesCarouselItem: ICarouselItem;
    public lsauCarouselItem: ICarouselItem;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.id3CarouselItem = {
            url: require('../../../styles/images/login/carousel_ID3.png'),
            label: this.i18n({ value: 'ID<sup>3</sup>-  Full Spectrum Administration', id: 'product.name.id3' }),
            description: this.i18n({
                value:
                    'Any administrative solution that you choose has to be broad enough to support a growing range of products. The ID<sup>3</sup> System supports life, annuity and health insurance products from application through claims processing.  ID<sup>3</sup> has a long track record as a production-proven solution. It is being used by companies to manage hundreds of plan variations for the life and health insurance market, including variable, equity indexed, disability income and long term care products.',
                id: 'product.desc.id3'
            })
        };
        this.lpesCarouselItem = {
            url: require('../../../styles/images/login/carousel_LPES.png'),
            label: this.i18n({ value: 'Life Portraits&reg ES - Straight-Through-Processing', id: 'product.name.lpes' }),
            description: this.i18n({
                value:
                    "<p>Life Portraits&reg ES helps every point of sale experience lead artfully to the perfect policy decision. Because it's flexible and expandable, Life Portraits&reg ES has the ability to adapt to every channel and seamlessly populate a variety of back-end processing solutions. Life Portraits&reg ES is based on modules that are used to create a customized marketing suite that fits the way your company sells today and easily adapts for tomorrow.  When used together, they provide a complete straight through processing environment for the marketing of life, health, and annuity products.</p> <p>Life Portraits&reg ES at a Glance:</p>- Compliant product illustrations<br>- True straight through processing<br>- Needs analysis suite <br>- Advanced sales<br>- Electronic applications and forms<br>- Electronic signatures and submissions",
                id: 'product.desc.lpes'
            })
        };
        this.lsauCarouselItem = {
            url: require('../../../styles/images/login/carousel_LS.png'),
            label: this.i18n({ value: 'UnderwritingPro&reg - Automated Underwriting', id: 'product.name.lsau' }),
            description: this.i18n({
                value:
                    'UnderwritingPro&reg is an enterprise proven scalable, Web-based new business / automated underwriting system that can help streamline your new business and underwriting processes.  UnderwritingPro&reg allows underwriters and case managers to quickly access information including application and quote information, evidence, ratings and images using a common desktop. UnderwritingPro&reg allows carriers to analyze, monitor and measure performance and time-service throughout the new business life cycle.',
                id: 'product.desc.lsau'
            })
        };
    }
}
