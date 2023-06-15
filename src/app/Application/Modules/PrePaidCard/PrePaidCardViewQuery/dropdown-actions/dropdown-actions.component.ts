import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { PrePaidCardService } from '../../prePaidCard.service'
import { PrePaidCardBlockService } from '../../PrePaidCardBlock/prePaidCardBlock.service'
import { PrePaidCardPaymentService } from '../../PrePaidCardPayment/prePaidCardPayment.service'
import { PrePaidCardResetPINService } from '../../PrePaidCardReset/prePaidCardResetPin.service'
import { Prepaid_Status_card } from '../prePaidCardDetail.service'
@Component({
  selector: 'app-dropdown-actions-prepaid-card-details',
  templateUrl: './dropdown-actions.component.html',
  styleUrls: [
    './dropdown-actions.component.scss',
    '../prePaidCardViewQuery.component.scss',
  ],
})
export class DropdownActionsComponent implements OnInit {
  @Input() selectedPrepaidCard
  @Input() prepaidCardDetailList
  @Input() selectedCardId
  public inactiveStatus = Prepaid_Status_card.inActive

  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    private router: Router,
    private prePaidCardResetPINService: PrePaidCardResetPINService,
    private prePaidCardService: PrePaidCardService,
    private prePaidCardBlockService: PrePaidCardBlockService,
  ) {}

  ngOnInit(): void {}

  goPinManagement() {
    this.prePaidCardResetPINService.setResetOperationType(
      PrePaidCardResetPINService.RESET_OP_TYPE,
    )
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.router.navigate(['/prepaid-card/prepaidcardresetpin'])
  }

  goLoadFundsCard() {
    this.prePaidCardService.setPrepaidCardDetail(
      this.prepaidCardDetailList[this.selectedCardId].prepaidCardDetails,
    )
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.prePaidCardService.setPaymentTypeFunds(
      PrePaidCardPaymentService.LOAD_FUNDS_TYPE,
    )
    this.router.navigate(['/prepaid-card/loadfundpayment'])
  }

  goRefundOfFunds() {
    this.prePaidCardService.setPrepaidCardDetail(
      this.prepaidCardDetailList[this.selectedCardId].prepaidCardDetails,
    )
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.prePaidCardService.setPaymentTypeFunds(
      PrePaidCardPaymentService.REFUND_FUNDS_TYPE,
    )
    this.router.navigate(['/prepaid-card/refundfundpayment'])
  }

  goCardLostStolen() {
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.prePaidCardBlockService.setBlockOperationType(
      PrePaidCardBlockService.STOLEN_OP_TYPE,
    )
    this.router.navigate(['/prepaid-card/prepaidcardLostStolen'])
  }

  goCardClosureRequest() {
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.prePaidCardBlockService.setBlockOperationType(
      PrePaidCardBlockService.CLOSURE_OP_TYPE,
    )
    this.router.navigate(['/prepaid-card/prepaidcardclosure'])
  }

  goCardReplacement() {
    this.prePaidCardService.setPrepaidCardDetail(
      this.prepaidCardDetailList[this.selectedCardId].prepaidCardDetails,
    )
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.prePaidCardBlockService.setBlockOperationType(
      PrePaidCardBlockService.REPLACE_OP_TYPE,
    )
    this.router.navigate(['/prepaid-card/prepaidcardReplacement'])
  }

  goActivationCard() {
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.router.navigate(['/prepaid-card/prepaidcardactivate'])
  }
}
