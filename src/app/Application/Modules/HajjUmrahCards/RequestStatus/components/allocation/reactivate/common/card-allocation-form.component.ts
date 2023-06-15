import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  LOCALE_ID,
  Input,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../../core/security/authentication.service'
import { ModelPipe } from '../../../../../../../Components/common/Pipes/model-pipe'
import { CardAllocationReactivateEntityService } from '../card-allocation-reactivate-entity.service'
import { CardOperationsRequestService } from '../../../operations/card-operations-request.service'

@Component({
  selector: 'app-card-allocation-reactivate-form',
  templateUrl: './card-allocation-form.component.html',
})
export class CardAllocationReactivateFormComponent
  implements OnInit, OnDestroy
{
  transformData = []
  form: FormGroup

  subscriptions: Subscription[] = []

  selectedCardOperation: any
  @Input() readonly: boolean

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: CardAllocationReactivateEntityService,
    private cardOperationsRequestService: CardOperationsRequestService,
  ) {}

  initCardOperationForm(cardOperation: any) {
    const cardForm = this.fb.group({
      accountNumber: [
        cardOperation != null ? cardOperation.cardNumber : cardOperation,
        null,
      ],
      cardHolderName: [
        cardOperation != null ? cardOperation.cardHolderName : cardOperation,
        null,
      ],
      visaNumber: [
        cardOperation != null ? cardOperation.visaNumber : cardOperation,
        null,
      ],
      visaExpiryDate: [
        cardOperation != null ? cardOperation.visaExpiryDate : cardOperation,
        null,
      ],
      cardAllocationDate: [
        cardOperation != null
          ? cardOperation.cardAllocationDate
          : cardOperation,
        null,
      ],
      rejectedReason: [
        cardOperation != null ? cardOperation.rejectedReason : cardOperation,
        null,
      ],
      cardExpiryDate: [
        cardOperation != null ? cardOperation.cardExpiryDate : cardOperation,
        null,
      ],
      totalAmountLoaded: [
        cardOperation != null ? cardOperation.totalAmountLoaded : cardOperation,
        null,
      ],
      currentBalance: [
        cardOperation != null ? cardOperation.currentBalance : cardOperation,
        null,
      ],
      expectedFees: [
        cardOperation != null ? cardOperation.expectedFees : cardOperation,
        null,
      ],
      cardStatus: [
        cardOperation != null
          ? this.transformData['hajjCardsStatus'][cardOperation.cardStatus]
          : cardOperation,
        null,
      ],
      country: [
        cardOperation != null ? cardOperation.country : cardOperation,
        null,
      ],
    })
    cardForm.addControl(
      'address',
      this.fb.control(
        cardOperation != null ? cardOperation.address : cardOperation,
        [Validators.required],
      ),
    )
    cardForm.addControl(
      'city',
      this.fb.control(
        cardOperation != null ? cardOperation.city : cardOperation,
        [Validators.required],
      ),
    )
    cardForm.addControl(
      'email',
      this.fb.control(
        cardOperation != null ? cardOperation.email : cardOperation,
        [Validators.required, this.mailFormat, Validators.maxLength(40)],
      ),
    )
    cardForm.addControl(
      'mobileKSA',
      this.fb.control(
        cardOperation != null ? cardOperation.mobileKSA : cardOperation,
        [Validators.required],
      ),
    )
    cardForm.addControl(
      'mobileNumber',
      this.fb.control(
        cardOperation != null ? cardOperation.mobileNumber : cardOperation,
        [Validators.required, Validators.maxLength(15)],
      ),
    )
    cardForm.addControl(
      'postalCode',
      this.fb.control(
        cardOperation != null ? cardOperation.postalCode : cardOperation,
        [Validators.required],
      ),
    )
    cardForm.addControl(
      'stateRegion',
      this.fb.control(
        cardOperation != null ? cardOperation.stateRegion : cardOperation,
        [Validators.required],
      ),
    )
    cardForm.addControl(
      'passportNumber',
      this.fb.control(
        cardOperation != null ? cardOperation.passportNumber : cardOperation,
        [Validators.required],
      ),
    )

    return cardForm
  }

  mailFormat(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }

  ngOnInit() {
    if (
      typeof this.serviceData.getSelectedData() == 'undefined' ||
      this.serviceData.getSelectedData() == null
    ) {
      return this.router.navigate(['/hajjandumrahcards/reqStatus'])
    }
    this.transformData = this.cardOperationsRequestService.transformData

    this.selectedCardOperation =
      this.serviceData.getSelectedData().selectedOperation
    this.form = this.initCardOperationForm(this.selectedCardOperation)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
