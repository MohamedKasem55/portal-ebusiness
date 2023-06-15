import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { CommercialCardsService } from './commercial-cards.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'
import { RequestValidate } from 'app/Application/Modules/CommercialCards/commercial-cards-models'

@Component({
  selector: 'app-commercial-cards',
  templateUrl: './commercial-cards.component.html',
  styleUrls: ['./commercial-cards.component.scss'],
})
export class CommercialCardsComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  rejectReason: any
  currentComponent: any

  authorizeSubscription: Subscription

  constructor(
    public service: CommercialCardsService,
    public router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {}

  ngOnInit() {}

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/commercialcards/step1'])
      }
    }
  }

  aproveFirstStep() {
    this.sharedData.responseValidate = {}
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeValidate(this.sharedData.tableSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.sharedData.aproveFlow = true
            //console.log(this.sharedData);
            this.router.navigate(['/myprofile/pending/commercialcards/step2'])
          } else {
            //TODO: Change when WS available
            this.sharedData.aproveFlow = true
            this.sharedData.responseValidate = result
            //Mock
            this.sharedData.responseValidate = {
              ...this.sharedData.responseValidate,
              batchListsContainerDTO: {
                toAuthorize: [],
                notAllowed: [],
                toProcess: this.sharedData.tableSelected,
              },
              generateChallengeAndOTP: {
                challengeCode: null,
                isNoQr: true,
                serial: 'string',
                typeAuthentication: 'OTP',
              },
            }
            this.router.navigate(['/myprofile/pending/commercialcards/step2'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.rejectReason = ''
    this.router.navigate(['/myprofile/pending/commercialcards/step2'])
  }
  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/commercialcards/step' + this.wizardStep,
    ])
  }
  confirmAprove() {
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .authorizeConfirm(
          this.sharedData.responseValidate.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.validation = result

            this.sharedData['confirm'] = result
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/commercialcards/step3'])
          } else {
            //TODO: Change when WS available
            // Se comentan las dos siguientes a las espera del WS
            this.sharedData.validateResponse.generateChallengeAndOTP =
              result.generateChallengeAndOTP
            this.sharedData.requestValidate = new RequestValidate()
            // this.pendingActionNotification.getRefreshObserver().next(true);
            // this.router.navigate(['/myprofile/pending/commercialcards/step3']);
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.tableSelected.length > 0) {
      this.authorizeSubscription = this.service
        .refuseConfirm(
          this.sharedData.tableSelected,
          this.sharedData.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/commercialcards/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  isValid() {
    return !this.currentComponent.valid() //(this.sharedData.responseValidate.errors && this.sharedData.responseValidate.errors.length > 0);
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.COMMERCIAL_CARDS),
      PENDING_ACTION.COMMERCIAL_CARDS,
    )
  }
}
