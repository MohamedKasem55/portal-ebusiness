import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Exception } from 'app/Application/Model/exception'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from 'app/core/storage/storage.service'
import { Subscription } from 'rxjs'
import { BatchDSO } from './new-soft-token.models'
import { NewSoftTokenService } from './new-soft-token.service'


@UntilDestroy()
@Component({
  selector: 'app-new-soft-token',
  templateUrl: './new-soft-token.component.html',
  styleUrls: ['./new-soft-token.component.scss'],
})
export class NewSoftTokenComponent implements OnInit, OnDestroy {
  generateChallengeAndOTP: ResponseGenerateChallenge = new ResponseGenerateChallenge();
  requestValidate: any = {};
  tokenBatchDto: BatchDSO = new BatchDSO();
  routes: any[] = [
    ['companyAdmin.companyAdmin'],
    ['companyAdmin.token.tokenManagment', ['/companyadmin/token/managment']],
    ['companyAdmin.token.requestSoftToken'],
  ]
  @ViewChild('authorization') authorization: any
  /**
   * Current process step
   */
  step: number

  /**
   * Flag: true if company is dual authorization false if not
   */
  isDualAuth: boolean

  /**
   * Form data
   *
   * numToken: number of token requested
   * accountNumber: debit account number selected
   * totalFee: fees for the tokjen request
   */
  data = {
    numToken: [
      '',
      [
        Validators.required,
        Validators.maxLength(5)
      ],
    ],
    accountNumber: ['', Validators.required],
    totalFee: [''],
  }

  /**
   * Accounts converted to be displayed in the combo
   */
  comboAccounts: any

  /**
   * List of debit accounts to the request of soft token
   */
  accounts: any

  /**
   * error message
   */
  mensajeError: any = {}

  /**
   * Subscriptions array
   */
  subscriptions: Subscription[] = []

  /**
   * Form group to the request form
   */
  form: FormGroup

  constructor(
    public fb: FormBuilder,
    public service: NewSoftTokenService,
    private router: Router,
    public injector: Injector

  ) {
    this.step = 1
    this.form = this.fb.group(this.data)
    this.requestValidate = new RequestValidate()
  }

  next() {
    switch (this.step) {
      case 1:
        this.isDualCompany() // test, quit
        // this.generateChallengeAndOTP = null
        // this.generateChallengeAndOTP = { "typeAuthentication": "OTP", "serial": null, "challengeCode": "2", "mobileNumber": null, "isNoQr": false, "owner": false };
        this.subscriptions.push(
          this.service
            .validSoftToken(
              this.form.value,
              this.getAccountSelected(this.form.value, this.comboAccounts)
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.generateChallengeAndOTP = result['generateChallengeAndOTP'];
                // this.generateChallengeAndOTP = { "typeAuthentication": "OTP", "serial": null, "challengeCode": "2", "mobileNumber": null, "isNoQr": false, "owner": false };
                this.tokenBatchDto = result.batch
                this.form.controls.totalFee.setValue(result.batch.totalAmount);
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmSoftToken(this.tokenBatchDto, this.requestValidate,)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.isDualCompany()
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.router.navigate([
          '/companyadmin/token/managment',
        ])
        break
    }
  }

  /**
   * Increase the current step
   */
  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  /**
   * Decrease the current step
   */
  previous() {
    if (this.step === 1) {
      this.router.navigate(['/companyadmin/token/managment'])
    } else {
      this.step = --this.step % 4
      if (this.step === 0) {
        this.step = 1
      }
    }
  }

  ngOnInit() {
    const organizationProfile = this.getCompanyData().profileNumber
    this.subscriptions.push(
      this.service.initSoftToken().subscribe((result) => {
        this.accounts = result.accountListDTO
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
      }),
    )
  }

  /**
   * Convert account list to object with key-value data
   * @param account list of accounts to be processed
   * @returns accountKeyValue key-value data for the input
   */
  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    if (account) {
      for (let i = 0; account.length > i; i++) {
        accountKeyValue.push({ key: i, value: account[i] })
      }
    }
    return accountKeyValue
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  /**
   * Process an error to be displayed
   * @param error error to be processed
   */
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  /**
   * Check if a company is or not dual authorization
   */
  isDualCompany() {
    this.isDualAuth = this.getCompanyData().dualAuthorization
    // this.isDualAuth = true;
  }
  /**
  * Get company data
  */
  getCompanyData(): any {
    const storageService = this.injector.get(StorageService)
    const company = storageService.retrieve('company')
    return company
  }

  isDisabled() {
    if (this.step === 1) {
      return true
    } else if (this.step === 2 && !this.generateChallengeAndOTP) {
      return true
    } else if (this.step === 2 && this.generateChallengeAndOTP && this.requestValidate.valid()) {
      return !this.authorization || this.authorization.valid()
    } else return this.step === 3;
  }
  getAccountSelected(form: FormGroup, comboAccounts: any[]): string {
    let accountSelected: string = '';
    accountSelected = comboAccounts[form['accountNumber']['key']]['value']['fullAccountNumber']
    return accountSelected
  }

}
