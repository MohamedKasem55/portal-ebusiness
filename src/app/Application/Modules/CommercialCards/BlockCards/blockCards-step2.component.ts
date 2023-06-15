import { CommercialCardsService } from '../commercial-cards.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import {
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../Model/requestvalidateType'
@Component({
  selector: 'app-block-card-step2',
  templateUrl: './blockCards-step2.component.html',
  styleUrls: ['./blockCards.component.scss'],
})
export class BlockCardsStep2Component implements OnInit {
  account: number
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  @Input() requestValidate: RequestValidate
  @ViewChild('authorization') authorization: any

  public businessCardObject: BusinessDetailAndList
  public businessCardItem: BusinessCardsListItems
  constructor(
    public translate: TranslateService,
    public commercialCardsService: CommercialCardsService,
  ) {}

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
    if (this.requestValidate.otp) {
      this.requestValidate.otp = ''
    }
  }
  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }
}
