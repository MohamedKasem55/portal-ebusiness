import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AbstractWizardComponent} from "../../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {Router} from "@angular/router";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {Account} from "../../../../Model/account";
import {ZidRegisterService} from "./zid-register.service";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-zid-register',
  templateUrl: './zid-register.component.html',
  styleUrls: ['./zid-register.component.scss']
})
export class ZidRegisterComponent extends AbstractWizardComponent implements OnInit, AfterViewInit {

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
      private service: ZidRegisterService
  ) {
    super(fb, translateService, router);

    this.service.hasAccess().subscribe(result => {
      this.subscriptionStatus = result.subscriptionStatus
    })
  }

  ngOnInit(): void {
    this.service.getConfig().subscribe((result) => {
      this.redirectUri = this.config.getDomain() + result.configuration.systemLoginRedirectUrl
      this.loginUrl = environment.zidLoginUrl + result.configuration.systemLoginUrl
      this.fees.subscriptionTotalFees = result.configuration.subscriptionTotalFees
      this.fees.renewalTotalFees = result.configuration.renewalTotalFees
      this.fees.oldFees = result.configuration.oldFees
      this.fees.discountPercentage = result.configuration.discountPercentage
    })

    this.service.getOwnerDetails().subscribe(result => {
      if(result.errorCode === '0'){
        this.formModel = this.service.buildForm(result)
        this.initiateAccounts()
      } else {
        this.canStartRegistration = false
      }
    })

    this.updateLang()
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLang()
    })
  }

  startRegistrationProcess(){
    this.startRegistration = true;
  }

  back() {
    switch (this.wizardStep) {
      case 1:
        this.startRegistration = false
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
          this.service.initRegister().subscribe(result => {
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
    this.startRegistration = false
    this.router.navigate(['/business-hub/zid/dashboard/']).then(res => {
      this.service.hasAccess().subscribe(result => {
        this.subscriptionStatus = result.subscriptionStatus
      })
    })
  }

  initiateAccounts() {
    this.service.getSARAccounts().subscribe(result => {
      if(result.errorCode == '0'){
        this.accounts = result.listAlertsPermissionAccount
        this.formModel.controls['fromAcct'].patchValue(this.accounts[0].fullAccountNumber)
      }
    })
  }

  confirmRegister(){

    const data = {
      storeUsername: this.formModel.controls['organizationName'].value,
      fromAcct: this.formModel.controls['fromAcct'].value,
      name: this.formModel.controls['fullName'].value,
      email: this.formModel.controls['email'].value.toLowerCase(),
      mobile: this.formModel.controls['mobileContact'].value,
      requestValidate: this.requestValidate
    }

    this.service.registerNew(data).subscribe(result => {
      if(result.errorCode === '0'){
        this.markNextWizardStep()
      }
    })
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
