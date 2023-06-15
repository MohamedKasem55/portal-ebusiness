import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import {
  BusinessCardsListItems,
  BusinessCardsDetailsResponse,
  BusinessDetailAndList,
  BusinessCardsDetails,
} from '../commercial-cards-models'
import { CommercialCardsService } from '../commercial-cards.service'

@Component({
  selector: 'app-ActivateCards-step1',
  templateUrl: './activateCards-step1.component.html',
  styleUrls: ['./activateCards.component.scss'],
})
export class ActivateCardsStep1Component implements OnInit {
  @Output() onInit = new EventEmitter<Component>()
  public businessCardItem: BusinessCardsListItems
  public businessCardsDetails: BusinessCardsDetailsResponse
  public businessCardObject: BusinessDetailAndList
  public selectedBusinessCard: BusinessCardsDetails

  constructor(
    public commercialCardsService: CommercialCardsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject?.list
    this.businessCardsDetails = this.businessCardObject?.details
    this.selectedBusinessCard = this.businessCardsDetails?.businessCardsDetails
    this.onInit.emit(this as Component)
  }
}
