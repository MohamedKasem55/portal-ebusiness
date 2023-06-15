import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {BusinessCardsListItems} from "../../../CommercialCards/commercial-cards-models";
import {NavigationExtras, Router} from "@angular/router";
import {Exception} from "../../../../Model/exception";
import {PrePaidCardListService} from "../../../PrePaidCard/PrePaidCardList/prePaidCardList.service";
import {PrepaidCardItem, PrepaidCardListResponse} from "../../../PrePaidCard/PrePaidCardList/prePaidCardListModel";
import {PrePaidCardService} from "../../../PrePaidCard/prePaidCard.service";

@Component({
    selector: 'app-carousel-pre-paid-cards',
    templateUrl: './carousel-pre-paid-cards.component.html',
    styleUrls: ['./carousel-pre-paid-cards.component.scss']
})
export class CarouselPrePaidCardsComponent implements OnInit {

    subscriptionGetList: Subscription
    slides: PrepaidCardItem[][] = []
    errorObj: any = {}
    slidesNum = 0
    prePaidCardsList: PrepaidCardItem[]
    prepaidCardListResponse: PrepaidCardListResponse

    constructor(
        public router: Router,
        private prepaidCardListService: PrePaidCardListService,
        public prePaidCardService: PrePaidCardService
    ) {
    }

    ngOnInit() {
        this.subscriptionGetList =
            this.prepaidCardListService
                .getPrepaidCardList("")
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.errorObj = {}
                        this.prepaidCardListResponse = result
                        this.prePaidCardService.setPrepaidCardList(result.prepaidCardsList)
                        this.prepaidCardListResponse.prepaidCardsList =
                            this.prepaidCardListService.cardFilterByBin(
                                this.prepaidCardListResponse.prepaidCardsList,
                            )
                        this.slidesNum = Object.keys(this.slides).length
                        this.prepaidCardListResponse = result;
                        this.prePaidCardsList = result.prepaidCardsList;
                        this.slides = this.prepaidCardListService.groupPrepaidCardListInSlides(this.prePaidCardsList, 3)
                        this.slidesNum = Object.keys(this.slides).length
                    }
                });
    }

    onError(error: any) {
        const res = error
        this.errorObj['code'] = res.errorCode
        this.errorObj['description'] = res.errorDescription
    }


    activateCard(selectedPrepaidCard) {
        this.prePaidCardService.setPrepaidCardSelected(selectedPrepaidCard)
        let selectedIndex = this.prepaidCardListResponse.prepaidCardsList.indexOf(selectedPrepaidCard);
        this.router.navigate(['/prepaid-card/prepaidcardactivate'], {
            state: {
                selectedPrepaidCard: selectedPrepaidCard,
                selectedPrepaidCardIndex: selectedIndex,
                prepaidList: this.prePaidCardsList
            }
        })
    }

    infoDetails(selectedPrepaidCard: PrepaidCardItem): void {
        this.prePaidCardService.setPrepaidCardSelected(selectedPrepaidCard)
        let selectedIndex = this.prepaidCardListResponse.prepaidCardsList.indexOf(selectedPrepaidCard);
        const navigationExtras: NavigationExtras = {
            state: {
                selectedPrepaidCard: selectedPrepaidCard,
                selectedPrepaidCardIndex: selectedIndex,
                prepaidList: this.prePaidCardsList
            }
        }
        this.router.navigate(['./prepaid-card/prepaidcardlist'], navigationExtras)
    }


    showArrowsOption() {
        return this.slidesNum > 1 ? true : false
    }
}
