import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { StaticService } from '../../Common/Services/static.service'
import {
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { CommercialCardsService } from '../commercial-cards.service'

@Component({
  selector: 'app-block-card-step1',
  templateUrl: './blockCards-step1.component.html',
  styleUrls: ['./blockCards.component.scss'],
})
export class BlockCardsStep1Component implements OnInit {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  reasonsCombo: string[] = []
  public businessCardObject: BusinessDetailAndList
  public businessCardItem: BusinessCardsListItems
  constructor(
    private fb: FormBuilder,
    public staticService: StaticService,
    public commercialCardsService: CommercialCardsService,
  ) {}

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
    this.onInit.emit(this as Component)
    this.staticService
      .getAllCombos(['businessCardsBlockReason'])
      .subscribe((res) => {
        this.reasonsCombo = res[0].values
      })
  }

  onChangeReason(reason: string): void {
    console.log('event', reason)
  }
}
