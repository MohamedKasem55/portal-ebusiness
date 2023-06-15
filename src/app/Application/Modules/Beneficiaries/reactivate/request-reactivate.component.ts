import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../core/storage/storage.service'
import { Exception } from 'app/Application/Model/exception'
import { RequestBeneficiariesService } from '../Services/beneficiaries-request.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStep1Component)
  step1RequestReactivate: RequestReactivateStep1Component
  @ViewChild(RequestReactivateStep2Component)
  step2RequestReactivate: RequestReactivateStep2Component

  urlFinish = ['/beneficiaries/requestStatus']
  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  requestReactivate = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  comboAccounts: any
  accounts: any

  type: any

  rajhiType = 'rajhi'
  localType = 'local'
  internationalType = 'international'
  formData: any

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestBeneficiariesService,
    public storage: StorageService,
    private el: ElementRef,
  ) {
    this.step = 1
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getElement()
    this.type = this.requestStatusService.getType()
    if (this.type == this.rajhiType) {
      this.addRajhiProperties(this.requestReactivate['initialBatch'])
    } else if (this.type == this.localType) {
      this.addLocalProperties(this.requestReactivate['initialBatch'])
    } else if (this.type == this.internationalType) {
      this.addInternationalProperties(this.requestReactivate['initialBatch'])
    }
  }

  onInitStep1(events) {
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    this.step2RequestReactivate = events
    this.step2RequestReactivate.formData = this.step1RequestReactivate.formData
    this.step2RequestReactivate.initData()
  }

  next() {
    switch (this.step) {
      case 1:
        break
      case 2:
        if (this.option == this.InitiateOption) {
          if (this.type == this.rajhiType) {
            this.subscriptions.push(
              this.service
                .saveRajhi(
                  this.step2RequestReactivate.batch,
                  this.step2RequestReactivate.requestValidate,
                )
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else if (this.type == this.localType) {
            this.subscriptions.push(
              this.service
                .saveLocal(
                  this.step2RequestReactivate.batch,
                  this.step2RequestReactivate.requestValidate,
                )
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else if (this.type == this.internationalType) {
            this.subscriptions.push(
              this.service
                .saveInternational(
                  this.step2RequestReactivate.batch,
                  this.step2RequestReactivate.requestValidate,
                )
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          }
        } else if (this.option == this.DeleteOption) {
          if (this.type == this.rajhiType) {
            this.subscriptions.push(
              this.service
                .deleteRajhi(this.step2RequestReactivate.batch)
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else if (this.type == this.localType) {
            this.subscriptions.push(
              this.service
                .deleteLocal(this.step2RequestReactivate.batch)
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else if (this.type == this.internationalType) {
            this.subscriptions.push(
              this.service
                .deleteInternational(this.step2RequestReactivate.batch)
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)
                    this.option = null
                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          }
        }
        break
      case 3:
        this.nextStep()

        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  isValid() {
    this.step1RequestReactivate.form.form.markAllAsTouched()

    for (const key of Object.keys(this.step1RequestReactivate.form.controls)) {
      if (this.step1RequestReactivate.form.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[ng-reflect-name="' + key + '"]',
        )
        invalidControl.focus()
        break
      }
    }
    return this.step1RequestReactivate.isValid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    if (this.type == this.rajhiType) {
      if (this.isValid()) {
        this.subscriptions.push(
          this.service
            .reIinitiateRajhi(this.step1RequestReactivate.batch)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                this.option = null
                return
              } else {
                this.requestReactivate['initiate'] = result
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initiateBatch =
                  this.requestReactivate['initiate'].batchBeneficiary
                //this.addRajhiProperties(this.initiateBatch);
                this.nextStep()
              }
            }),
        )
      }
    } else if (this.type == this.localType) {
      if (this.isValid()) {
        this.subscriptions.push(
          this.service
            .reIinitiateLocal(this.step1RequestReactivate.batch)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                this.option = null
                return
              } else {
                this.requestReactivate['initiate'] = result
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initiateBatch =
                  this.requestReactivate['initiate'].batchBeneficiary
                //this.addLocalProperties(this.initiateBatch);
                this.nextStep()
              }
            }),
        )
      }
    } else if (this.type == this.internationalType) {
      if (this.isValid()) {
        this.subscriptions.push(
          this.service
            .reIinitiateInternational(this.step1RequestReactivate.batch)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                this.option = null
                return
              } else {
                this.requestReactivate['initiate'] = result
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initiateBatch =
                  this.requestReactivate['initiate'].batchBeneficiary
                //this.addInternationalProperties(this.initiateBatch);
                this.nextStep()
              }
            }),
        )
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  finish() {
    this.step = 1
    this.router.navigate(this.urlFinish)
  }

  goCancel() {
    this.router.navigate(this.urlFinish)
  }

  addRajhiProperties(batch) {
    batch['beneficiaryType'] = this.rajhiType
    batch['newEmail'] = batch.email
  }

  addLocalProperties(batch) {
    batch['beneficiaryType'] = this.localType
    batch['newBanckCode'] = batch.bankCode
    batch['newBeneficiaryAccount'] = batch.beneficiaryAccount
    batch['newBeneficiaryFirstName'] = batch.beneficiaryName
    batch['newEmail'] = batch.email
    batch['newPhoneNumber  '] = batch.phoneNumber
  }

  addInternationalProperties(batch) {
    batch['beneficiaryType'] = this.internationalType
    batch['newAddressLine1'] = batch.beneficiaryAddress1
    batch['newAddressLine2'] = batch.beneficiaryAddress2
    batch['newAddressPostalCode'] = batch.addressPostalCode
    batch['newAddressRegion'] = batch.addressRegion
    batch['addressCountry'] = batch.addressCountry
    batch['newBankAddress'] = batch.bankAddress
    batch['newBankName'] = batch.bankName
    batch['newBeneficiaryAccount'] = batch.beneficiaryAccount
    batch['newBeneficiaryCategory'] = batch.beneficiaryCategory
    batch['newBranchAddress'] = batch.branchAddress
    batch['newBranchSwiftCode'] = batch.branchSwiftCode
    batch['newBranchName'] = batch.branchName
    batch['newCityState'] = batch.addressState
    batch['newCountryCode'] = batch.countryCode
    batch['newCountryIssue'] = batch.documentCountryIssue
    batch['newCountryNameEnglish'] = batch.countryNameEnglish
    batch['newCurrency'] = batch.currencyCode
    batch['newDateBirth'] = batch.personalDateBirth
    batch['newDocumentSortCode'] = batch.documentSortCode
    batch['newEmail'] = batch.email
    batch['newFirstName'] = batch.beneficiaryName1
    batch['newIdNumber'] = batch.documentIdNumber
    batch['newIdType'] = batch.documentIdType
    batch['newIssueAt'] = batch.documentIssueAt
    batch['newIssueDate'] = batch.documentIssueDate
    batch['newLastName'] = batch.beneficiaryName2
    batch['newMiddleName'] = batch.beneficiaryName3
    batch['newMobileNo'] = batch.mobileNo
    batch['newNationality'] = batch.nationality
    batch['newPlaceBirth'] = batch.personalPlaceBirth
    batch['newPobox'] = batch.addressPoBox
    batch['newSecondName'] = batch.beneficiaryName4
    batch['newShortCode'] = batch.beneficiarySortCode
    batch['newStreetNo'] = batch.addressStreetNo
    batch['newSwiftCode'] = batch.bankSwiftCode
    batch['newTelephoneNo'] = batch.telephoneNo
    batch['newTelephoneNoArea'] = batch.telephoneNoArea
    batch['newTelephoneNoExtension'] = batch.telephoneNoExtension
    batch['newTelephoneNoPrefix'] = batch.telephoneNoPrefix
  }
}
