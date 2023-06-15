import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { NewPaymentService } from './new-payment.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss'],
})
export class NewPaymentComponent implements OnInit, OnDestroy {
  sharedData: any = {}
  wizardStep: number
  currentComponent: any

  subscriptions: Subscription[] = []
  form: FormGroup

  defaultAccount: any
  previousUrl: any

  constructor(
    private service: NewPaymentService,
    public translate: TranslateService,
    public router: Router,
    public fb: FormBuilder,
  ) {
    this.wizardStep = 2
  }

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    component.form = this.form
    this.wizardStep = component.step
  }

  isDisabled() {
    return this.currentComponent.valid()
  }

  nextStep() {
    switch (this.wizardStep) {
      case 2:
        this.subscriptions.push(
          this.service
            .validate(
              this.form.controls.beneficiaries['controls'],
              this.sharedData.accounts,
            )
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                return
              } else {
                this.sharedData.validData = result.aramcoBatchList
                this.sharedData.batch = this.extractBatch(
                  result.aramcoBatchList,
                )
                this.sharedData.mapSecurity = this.generateLevelsMap(
                  this.sharedData.batch,
                )
                this.sharedData.generateChallengeAndOTP =
                  result.generateChallengeAndOTP
                this.sharedData.requestValidate = new RequestValidate()
                this.next()
              }
            }),
        )
        break
      case 3:
        this.subscriptions.push(
          this.service
            .confirm(this.sharedData.validData, this.sharedData.requestValidate)
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                return
              } else {
                this.sharedData.validation = result
                this.next()
              }
            }),
        )
        break
      case 4:
        this.finish()
        break
    }
  }
  generateLevelsMap(batch) {
    const map = new Map<string, any>()
    for (let i = batch.length - 1; i >= 0; i--) {
      map.set(batch[i].passNumber, batch[i].futureSecurityLevelsDTOList)
    }
    return map
  }

  getFromLevelsMap(number: any) {
    return this.sharedData.mapSecurity.get(number)
  }

  extractBatch(batchList) {
    const list: any = []
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
  }

  next() {
    this.wizardStep++
    this.router.navigate([
      '/aramcoPayments/beneficiaries/new-payment/step' + this.wizardStep,
    ])
  }

  backButton() {
    this.wizardStep--
    if (this.wizardStep == 1) {
      if (this.sharedData.paymentBack === 'payment') {
        this.router.navigate(['/aramcoPayments/beneficiaries/payment'])
      } else if (this.sharedData.paymentBack === 'list') {
        this.router.navigate(['/aramcoPayments/beneficiaries/list'])
      }
    } else {
      this.router.navigate([
        '/aramcoPayments/beneficiaries/new-payment/step' + this.wizardStep,
      ])
    }
  }

  finish() {
    this.wizardStep = 1
    this.sharedData.tableSelectedRows = []
    this.sharedData.deleted = []
    this.sharedData.details = {}
    this.sharedData.payments = []
    this.router.navigate(['/aramcoPayments/beneficiaries/payment'])
  }

  ngOnInit() {}

  createForm(data) {
    this.form = this.fb.group({})
    this.form.addControl('beneficiaries', this.fb.array([]))
    this.subscriptions.push(
      this.service.initPayment().subscribe(
        function (_data, result) {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            return
          } else {
            this.sharedData.accounts = this.extractAccountKeyValue(
              result.listInitiateAccount,
            )
            this.defaultAccount = ''
            if (this.sharedData.accounts.length == 1) {
              this.defaultAccount = this.sharedData.accounts[0].key
            }
            for (let i = 0; _data.length > i; i++) {
              this.createBeneficiaryForm(_data[i])
            }
          }
        }.bind(this, data),
      ),
    )
  }

  createBeneficiaryForm(beneficiary) {
    const formArray = <FormArray>this.form.controls['beneficiaries']
    formArray.push(
      this.fb.group({
        account: [this.defaultAccount, Validators.required],
        amount: [null, Validators.required],
        customerName: [{ value: beneficiary.customerName, disabled: true }],
        customerId: [{ value: beneficiary.customerId, disabled: true }],
      }),
    )
    const indice = formArray.length - 1
    const beneficiarios = (<FormGroup>formArray.controls[indice]).controls
    this.subscriptions.push(
      beneficiarios['account'].valueChanges.subscribe(
        function (_indice, _beneficiarios, _values) {
          _beneficiarios['amount'].setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.sharedData.accounts[_indice].availableBalance),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ])
          _beneficiarios['amount'].updateValueAndValidity()
        }.bind(this, indice, beneficiarios),
      ),
    )
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  getKeyAccount(account: any) {
    if (account) {
      for (let i = this.sharedData.accounts.length - 1; i >= 0; i--) {
        if (
          this.sharedData.accounts[i].value.fullAccountNumber ==
          account.fullAccountNumber
        ) {
          return this.sharedData.accounts[i].key
        }
      }
    }
    return
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
