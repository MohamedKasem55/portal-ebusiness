import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core'
import { CarouselConfig } from 'ngx-bootstrap/carousel'
import { BannerErrorsMessage, BannerModel } from '../../models/banner.model'
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-campaign-banner',
  templateUrl: './campaign-banner.component.html',
  styleUrls: ['./campaign-banner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 1500, noPause: true, showIndicators: true },
    },
    // NgbCarouselConfig
  ],
})
export class CampaignBannerComponent implements OnInit, OnChanges {
  @Input()
  public banner: BannerModel[]

  @Input()
  public error: BannerErrorsMessage

  showNavigationArrows = false
  showNavigationIndicators = false

  constructor(config: NgbCarouselConfig, public translate: TranslateService) {
    // config.showNavigationArrows = true;
    // config.showNavigationIndicators = true;
  }

  ngOnInit() {}

  ngOnChanges(): void {}
}
