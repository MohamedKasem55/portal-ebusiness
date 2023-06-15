import { Component, Input, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { CommercialCardsService } from './../../../CommercialCards/commercial-cards.service'
import {
  BusinessCardsList,
  BusinessCardsListItems,
  BusinessCardsListArray,
} from '../../../CommercialCards/commercial-cards-models'
import { Router } from '@angular/router'

@Component({
  templateUrl: 'carousel-commercialCards.component.html',
  styleUrls: ['carousel-commercialCards.component.scss'],
  selector: 'app-carousel-commercialCards',
})
export class CarouselCommercialCards implements OnInit {
  subscriptionGetList: Subscription
  slides: BusinessCardsListArray[] = []
  mensajeError: any = {}
  slidesNum = 0
  businessCardsList: BusinessCardsListItems[]
  constructor(
    public commercialCardsService: CommercialCardsService,
    public router: Router,
  ) {}
  ngOnInit() {
    this.subscriptionGetList = this.commercialCardsService
      .getList()
      .subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.businessCardsList = result.businessCardsList.items
          this.commercialCardsService.setBusinessCardsList(
            this.businessCardsList,
          )
          this.slides = this.agroupBusinessCardsList(this.businessCardsList, 3)
          this.slidesNum = Object.keys(this.slides).length
          this.mensajeError = {}
        }
        this.subscriptionGetList.unsubscribe()
      })
  }
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  activateCard(businessCardsItem: BusinessCardsListItems) {
    this.commercialCardsService.setBusinessCardsItem(businessCardsItem)
    this.router.navigate(['/businessCards/activatecards'])
  }

  infoDetails(businessCardsListItemsData: BusinessCardsListItems): void {
    this.commercialCardsService.setBusinessCardsList(this.businessCardsList)
    this.commercialCardsService.setBusinessCardsItem(businessCardsListItemsData)
    this.router.navigate(['/businessCards/viewquerycards'])
  }

  public agroupBusinessCardsList(
    cardsList: BusinessCardsListItems[],
    chunk_size: number,
  ): BusinessCardsListArray[] {
    let index: number
    const arrayLength = cardsList.length
    const cardsListArray: BusinessCardsListArray[] = []

    for (index = 0; index < arrayLength; index += chunk_size) {
      const myChunk = new BusinessCardsListArray()
      myChunk.businessCardsList = cardsList.slice(index, index + chunk_size)
      cardsListArray.push(myChunk)
    }
    return cardsList ? cardsListArray : []
  }
  showArrowsOption() {
    return this.slidesNum > 1 ? true : false
  }
}
