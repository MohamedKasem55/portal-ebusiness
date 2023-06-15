import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { BannerModel } from 'app/core/security/login-rev/models/banner.model'
import { CarouselConfig } from 'ngx-bootstrap/carousel'

@Component({
  selector: 'app-banner',
  templateUrl: './internal-campaign-banner.component.html',
  styleUrls: ['./internal-campaign-banner.component.scss'],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 5000, noPause: true, showIndicators: true },
    },
  ],
})
export class InternalCampaignBannerComponent implements OnInit, OnChanges {
  @Input()
  public banner: BannerModel[]
  public bannerMenuTrue: BannerModel[]
  constructor() {}

  ngOnInit() {
    if (this.banner) {
      this.bannerMenuTrue = this.filterDataMenuBannerTrue(this.banner)
    }
  }

  ngOnChanges() {}
  filterDataMenuBannerTrue(banner: BannerModel[]): BannerModel[] {
    let bannerMenuTrue: BannerModel[]
    bannerMenuTrue = banner.filter((item) => item.menuBanner === true)
    return bannerMenuTrue
  }
}
