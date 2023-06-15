import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {AbstractWizardComponent} from "../../../Common/Components/Abstract/abstract-wizard.component";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {QoyodRegisterService} from "./qoyod-register.service";
import {Account} from "../../../../Model/account";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-qoyod-register',
  templateUrl: './qoyod-register.component.html',
  styleUrls: ['./qoyod-register.component.scss']
})
export class QoyodRegisterComponent extends AbstractWizardComponent implements OnInit, AfterViewInit {

  ownerDetails$ =  this.service.getOwnerDetails()
  currentSubDetails$ = this.service.getCurrentSubscriptionDetails()

  isRenewSubscription: boolean = false
  subscriptionStatus: any
  canStartRegistration: boolean = true
  startRegistration: boolean = false
  otpStep: boolean = false
  canProceedStep: boolean = true
  formModel: FormGroup
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate = new RequestValidate()
  @ViewChild('authorization') authorization: any

  currentLang: string

  fees: any = {}
  redirectUri: string
  loginUrl: string
  accounts: any[] = []
  displayAccount: Account[] = []

  constructor(
      public injector: Injector,
      public router: Router,
      public fb: FormBuilder,
      public translateService: TranslateService,
      private config: ConfigResourceService,
      private service: QoyodRegisterService
  ) {
    super(fb, translateService, router);

    if(!this.router.getCurrentNavigation()?.extras?.state?.data?.guardData?.subscriptionStatus){
      this.service.hasAccess().subscribe(result => {
        this.subscriptionStatus = result.subscriptionStatus
        this.isRenewSubscription = result.renewSubscription
      })
    } else {
      this.subscriptionStatus = this.router.getCurrentNavigation()?.extras?.state?.data?.guardData.subscriptionStatus
      this.isRenewSubscription = this.router.getCurrentNavigation()?.extras?.state?.data?.guardData.subscriptionExpiryNotice
    }
  }

  ngOnInit(): void {
    this.service.getConfig().subscribe((result) => {
      if(result.errorCode == '0'){
        this.redirectUri = this.config.getApplicationUrl() + "/" + result.configuration.systemLoginRedirectUrl
        this.loginUrl = environment.qoyodLoginUrl + result.configuration.systemLoginUrl
        this.fees.subscriptionTotalFees = result.configuration.subscriptionTotalFees
        this.fees.renewalTotalFees = result.configuration.renewalTotalFees
        this.fees.oldFees = result.configuration.oldFees
        this.fees.discountPercentage = result.configuration.discountPercentage
      }
    })

    this.initiateOwnerDetails()

    this.updateLang()
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLang()
    })
  }

  startRegistrationProcess(){
    this.startRegistration = true;
  }

  initiateOwnerDetails(){
    this.ownerDetails$.subscribe(result => {
      if(result.errorCode == '0'){
        this.formModel = this.service.buildForm(result)

        this.initiateAccounts()
        if(this.isRenewSubscription){
          this.initiateCurrentSubDetails()
        }

      } else {
        this.canStartRegistration = false
      }
    })
  }

  initiateCurrentSubDetails(){
    this.currentSubDetails$.subscribe(result => {
        if(result.errorCode == '0'){
          if(result.user?.email){
            this.formModel.controls['email'].patchValue(result.user.email)
          } else {
            this.formModel.controls['email'].setErrors({required: true})
          }
        }
    })
  }

  back() {
    switch (this.wizardStep) {
      case 1:
        this.startRegistration = false
        this.router.navigateByUrl('/business-hub/qoyod/dashboard')
        break
      case 2:
        if(!this.otpStep){
          this.markPreviousWizardStep()
          break
        }
        break
      case 3:
        this.otpStep = false
        this.markPreviousWizardStep()
    }
  }

  getWizardStepsCount() {
  }

  isDisabled() {
  }

  next() {
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  canProceed(){
    switch (this.wizardStep) {
      case 1:
        return (this.formModel.valid && this.formModel.controls['termsAccept'].value === true)
      case 2:
        return !(this.otpStep && !this.requestValidate.valid());
      case 3:
        return false
    }

  }

  canGoBack(){
    return this.wizardStep >= 1 && (!this.otpStep && this.wizardStep != 3)
  }

  cancel(){
    this.router.navigateByUrl('/')
  }

  proceed(){

    switch (this.wizardStep){
      case 1:
        this.markNextWizardStep()
        return
      case 2:
        this.formModel.disable()

        if(!this.otpStep){
          this.otpStep = true
          this.service.initRegister(this.isRenewSubscription).subscribe(result => {
            if(result.errorCode === '0'){
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
            }
          })
          return
        }

        if(this.authorization?.valid()){
          this.confirmRegister()
        }
    }
  }

  public updateLang() {
    this.currentLang = this.injector.get(TranslateService).currentLang
  }

  getCurrentLang() {
    return this.currentLang
  }

  showTC(){
    let url_to_open =
        `${this.config.getDocumentUrl()}/terms_and_conditions_business_hub_${this.currentLang}.pdf`
    window.open(url_to_open, '_blank')
  }

  goBackToDashboard(){
    //TODO: reset all wizard and form settings
    this.startRegistration = false
    this.router.navigate(['/business-hub/qoyod/dashboard/']).then(result => {
      this.subscriptionStatus = this.router.getCurrentNavigation()?.extras?.state.data?.guardData.subscriptionStatus
    })
  }

  initiateAccounts() {
    this.service.getSARAccounts().subscribe(result => {
      if(result.errorCode == '0'){
        this.accounts = result.listAlertsPermissionAccount
        this.formModel.controls['fromAcct'].patchValue(this.accounts[0]?.fullAccountNumber)

        if(this.isRenewSubscription){
          this.startRegistrationProcess()
        }
      }
    })
  }

  confirmRegister(){
    const fullName = this.formModel.controls['fullName'].value.split(' ')

    const data = {
      organizationName: this.formModel.controls['organizationName'].value,
      fromAcct: this.formModel.controls['fromAcct'].value,
      user: {
        firstName: fullName[0],
        lastName: fullName[fullName.length - 1],
        email: this.formModel.controls['email'].value.toLowerCase(),
        mobileContact: this.formModel.controls['mobileContact'].value
      },
      requestValidate: this.requestValidate
    }

    if(this.isRenewSubscription){
      this.service.renewSubscription(data).subscribe(result => {
        if(result.errorCode === '0'){
          this.markNextWizardStep()
        }
      })
    } else {
      this.service.registerNew(data).subscribe(result => {
        if(result.errorCode === '0'){
          this.markNextWizardStep()
        }
      })
    }

  }

  selectAccount(event){
    if(event?.fullAccountNumber){
      this.replaceDisplayAccount(event)
      this.formModel.controls['fromAcct'].patchValue(event.fullAccountNumber)
    } else {
      this.formModel.controls['fromAcct'].setErrors({required: true})
    }
  }

  replaceDisplayAccount(account: Account){
    if(this.displayAccount.length >= 1){
      this.displayAccount.splice(0,1)
    }
    this.displayAccount.push(account)
  }
}
