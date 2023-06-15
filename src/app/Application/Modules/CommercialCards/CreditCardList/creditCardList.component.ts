import {
  BusinessCardsList,
  BusinessCardsListItems,
  BusinessCardsListArray,
} from './../commercial-cards-models'
import { CommercialCardsService } from './../commercial-cards.service'
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../core/storage/storage.service'
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap'
import { Exception } from 'app/Application/Model/exception'
/* tslint:disable:max-classes-per-file */
@Component({
  selector: 'creditCardList',
  templateUrl: './creditCardList.component.html',
})
export class CreditCardListComponent implements OnInit, OnDestroy {
  @ViewChild('creditCardListTable') table: any
  @ViewChild('myCarousel') myCarousel: NgbCarousel
  @Output() onInit = new EventEmitter<Component>()

  public total: number
  public account: string
  public mensajeError: any = {}
  public tableDisplaySize = 20
  public subscriptions: Subscription[] = []
  public obtainCardId: Subscription
  public slides: BusinessCardsListArray[] = []
  public slidesNum: number
  public option: string
  public slidesActive: number
  public creditCardListaTable: any

  // public businessCardsList: BusinessCardsList;
  public businessCardsList: BusinessCardsListItems[]
  constructor(
    public router: Router,
    private storageService: StorageService,
    public commercialCardsService: CommercialCardsService,
  ) {}

  ngOnInit() {
    this.businessCardsList = this.commercialCardsService.getBusinessCardsList()
    if (this.businessCardsList) {
      this.slides = this.agroupBusinessCardsList(this.businessCardsList, 6)
      this.slidesNum = Object.keys(this.slides).length
    } else {
      this.subscriptions.push(
        this.commercialCardsService.getList().subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.businessCardsList = result.businessCardsList
            this.businessCardsList = this.cardFilterByBin(
              this.businessCardsList,
            )
            this.commercialCardsService.setBusinessCardsList(
              this.businessCardsList,
            )
            this.slides = this.agroupBusinessCardsList(
              this.businessCardsList,
              3,
            )
            this.slidesNum = Object.keys(this.slides).length
            this.mensajeError = {}
          }
        }),
      )
    }
  }
  getRoutes(): any {
    const routes = [
      ['commercialCards.name', ['/businessCards/menu']],
      ['commercialCards.creditCardListName'],
    ]
    return routes
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }
  activateCard(businessCardsListItems: BusinessCardsListItems) {
    this.commercialCardsService.setBusinessCardsItem(businessCardsListItems)
    this.router.navigate(['/businessCards/activatecards'])
  }
  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  infoDetails(businessCardsListItemsData: BusinessCardsListItems): void {
    this.commercialCardsService.setBusinessCardsList(this.businessCardsList)
    this.commercialCardsService.setBusinessCardsItem(businessCardsListItemsData)
    this.router.navigate(['/businessCards/viewquerycards'])
  }
  back() {
    const currentSlide = this.myCarousel.activeId.split('_')
    this.slidesActive = +currentSlide[1] - 1
    if (this.slidesNum && this.slidesActive >= 0) {
      this.myCarousel.select('slideId_' + this.slidesActive)
    } else {
      this.router.navigate([''])
    }
  }

  onSlide(event) {
    if (event.source === 'arrowLeft') {
      const currentSlide = this.myCarousel.activeId.split('_')
      this.slidesActive = +currentSlide[1] - 1
    } else if (event.source === 'arrowRight') {
      const currentSlide = this.myCarousel.activeId.split('_')
      this.slidesActive = +currentSlide[1] + 1
    } else {
      const currentSlide = event.current.split('_')
      this.slidesActive = +currentSlide[1]
    }
  }

  next() {
    const currentSlide = this.myCarousel.activeId.split('_')
    this.slidesActive = +currentSlide[1] + 1
    if (this.slidesNum && this.slidesActive < this.slidesNum) {
      this.myCarousel.select('slideId_' + this.slidesActive)
    }
  }
  nextDisabled(): boolean {
    let nextDisabled = false
    if (
      !this.slidesNum ||
      this.slidesActive === this.slidesNum - 1 ||
      this.slidesNum === 1
    ) {
      nextDisabled = true
    }
    return nextDisabled
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

  cardFilterByBin(
    businessCardList: BusinessCardsListItems[],
  ): BusinessCardsListItems[] {
    return businessCardList
      ? businessCardList.filter((card) =>
          card.cardNumber.startsWith(CommercialCardsService.BIN),
        )
      : []
  }
}
