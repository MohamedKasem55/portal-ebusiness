import {AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {forkJoin, Observable, of, Subject} from 'rxjs'
import {PrePaidCardRequestService} from './pre-paid-card-request.service'
import {takeUntil} from 'rxjs/operators'
import {
  DocCode,
  PrepaidCardAttachment,
  PrepaidCardRequestConfirm, PrepaidCardsRequestNewDSO,
  PrepaidCardsRequestValidate,
  RequestPrepaidCardValidateResponse,
  UserJourney,
} from './PrepaidCardRequestModel'
import {ConfigResourceService} from '../../../../core/config/config.resource.local'
import {CommonValidators} from '../../Common/constants/common-validators.service'
import {SessionStorageService} from 'ngx-webstorage'
import {ModalDirective} from 'ngx-bootstrap/modal'
import {RequestValidate} from "../../../Model/requestvalidateType";
import {SecuredAuthentication} from "../../../Components/secured-authentication/secured-authentication.component";
import {GenericResponse} from "../../../Model/app.response";

@Component({
  selector: 'app-pre-paid-card-request',
  templateUrl: './pre-paid-card-request.component.html',
})
export class PrePaidCardRequestComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

  @ViewChild('authorization') authorization: SecuredAuthentication

  wizardStep: number
  sharedData: any = {}
  currentComponent: any
  form: FormGroup
  private mensajeError: any = {}
  private readonly onDestroy$ = new Subject<any>()

  private prepaidCardsRequestValidate: PrepaidCardsRequestValidate
  public prepaidCardRequestConfirm: PrepaidCardRequestConfirm
  public prepaidValidateResponse: RequestPrepaidCardValidateResponse
  public prepaidCardAttachments: PrepaidCardAttachment[] = []
  selectedUserJourney: UserJourney
  canProceedStep1: boolean

  public attachment: string | ArrayBuffer
  public attachmentName: string
  public cardOrderId: string
  ownerData
  selectedFullAccountNumber

  @ViewChild('addressModel', {static: true})
  addressModel: ModalDirective

  constructor(
      private router: Router,
      private fb: FormBuilder,
      private service: PrePaidCardRequestService,
      public config: ConfigResourceService,
      public commonValidators: CommonValidators,
      private sessionStorage: SessionStorageService,
      private cdRef: ChangeDetectorRef
  ) {
    this.form = this.service.switchForm(UserJourney.EMPLOYEE)
  }

    ngOnChanges(): void {
        if (this.selectedUserJourney === UserJourney.OWNER) {
            this.form.controls['account'].setErrors({'incorrect': true});
        }
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

  ngOnInit(): void {
    if (this.sessionStorage.retrieve('welcome')['nationalAdress'] != 'Y') {
      this.showAddressModal()
    } else {
      this.service.checkEligibility().subscribe(res => {
        if (res.errorCode != '0') {
          this.router.navigate(['#'])
        } else {
          this.wizardStep = 1
        }
      })
    }
  }

  getRoutes(): string[][] {
    return [['prePaidCard.name'], ['prePaidCard.requestPrepaidCard']]
  }

  public backPrepaidCardList() {
    this.router.navigate(['/prepaid-card/prepaidcardlist'])
  }

  public goToDashboard() {
    this.router.navigate(['/'])
  }

  public back() {
    if(this.selectedUserJourney == UserJourney.EMPLOYEE){
      this.wizardStep--
      if (this.wizardStep === 1) {
        this.form.enable()
      }
    } else {
      this.wizardStep = 1
      this.form.enable()
    }
  }

  public proceed() {
    const prepaidDSO: PrepaidCardsRequestNewDSO = {
      accountNumber:this.form.get('account').value,
      city: this.form.controls['city'].touched ? (this.form.get('city').value?.key ? this.form.get('city').value?.key : this.form.get('city').value) : null,
      countryCode: this.form.get('account').value,
      firstName: this.form.controls['holderFirstName'].touched ? this.form.get('holderFirstName').value : null,
      gender: this.form.controls['gender'].touched ? (this.form.get('gender').value?.key ? this.form.get('gender').value?.key : this.form.get('gender').value) : null,
      lastName: this.form.controls['holderLastName'].touched ? this.form.get('holderLastName').value : null,
      mobileNumber: this.form.controls['memberPhoneNumber'].touched ? this.form.get('memberPhoneNumber').value : null,
      nationalId: this.form.controls['national_id'].touched ? this.form.get('national_id').value : null,
      nationality: this.form.controls['nationality'].touched ? (this.form.get('nationality').value?.key ? this.form.get('nationality').value?.key : this.form.get('nationality').value) : null,
      birthDate: this.form.controls['dataOfBirth'].touched ? this.form.get('dataOfBirth').value : null,
      companyEmbossingName: this.form.controls['companyEmbossingName'].touched ? this.form.get('companyEmbossingName').value : null,
      ownerEmbossingName: this.form.controls['ownerEmbossingName'].touched ? this.form.get('ownerEmbossingName').value : null,
      requesterType: UserJourney[this.selectedUserJourney],
    }

    this.prepaidCardsRequestValidate = {
      prepaidCardsRequestNewDSO: prepaidDSO
    }

    switch (this.wizardStep) {
      case 1:
        if(this.selectedUserJourney == UserJourney.OWNER){
          this.validateRequest(this.prepaidCardsRequestValidate)
        } else {
          this.wizardStep++
        }
        break
      case 2:
        this.validateRequest(this.prepaidCardsRequestValidate)
        break
      case 3:
        this.confirm(this.prepaidCardRequestConfirm)
        break
    }

    // if (this.wizardStep > 1) {
    //   this.form.disable()
    // }

  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  confirm(request: PrepaidCardRequestConfirm) {
    this.service.confirmPrepaidCardNewRequest(request)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        if(res?.errorCode == '0'){
          this.cardOrderId = res.cardOrderId

          if(res.cardOrderId && this.prepaidCardAttachments){
            const attachments: Observable<any>[] = []
            this.prepaidCardAttachments.forEach(file => {
              file.dossierId = res.cardOrderId
              const observable = of(this.service.submitDocuments(file).subscribe())
              attachments.push(observable)
            })
            //TODO: save result of upload
            forkJoin(attachments)
          }
          this.wizardStep++
        }
      })

  }

  private validateRequest(request: PrepaidCardsRequestValidate) {

    this.service.validatePrepaidCardNewRequest(request)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        if(res.errorCode == '0'){
          this.prepaidValidateResponse = res
          this.prepaidCardRequestConfirm = {
            prepaidCardsRequestNewDSO: res.prepaidCardsRequestNewDSO,
            requestValidate: new RequestValidate()
          }
          this.selectedUserJourney == UserJourney.EMPLOYEE ? this.wizardStep++ : this.wizardStep = 3
        }
      })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
  }

  setIdIqama(file: any) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const redFile = {
        fileContent: reader.result,
        fileName: file.name,
        fileType: file.type,
      }
      const idIqama: PrepaidCardAttachment = {
        fileContent: redFile.fileContent,
        fileName: redFile.fileName,
        fileType: 'ID',
        fileCode: DocCode.ID,
        dossierId: '',
      }
      this.prepaidCardAttachments.push(idIqama)
      this.form.get('id_iqamaAttach').patchValue(idIqama)
    }

  }

  setEmpCertificate(file: any) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const redFile = {
        fileContent: reader.result,
        fileName: file.name,
        fileType: file.type,
      }
      const empCertificate: PrepaidCardAttachment = {
        fileContent: redFile.fileContent,
        fileName: redFile.fileName,
        fileType: 'EMP_CERT',
        fileCode: DocCode.EMP_CERT,
        dossierId: '',
      }
      this.prepaidCardAttachments.push(empCertificate)
      this.form.get('empCertificateAttach').patchValue(empCertificate)
    }
  }

  setCompanyRegistration(file: any) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const redFile = {
        fileContent: reader.result,
        fileName: file.name,
        fileType: file.type,
      }
      const companyCR: PrepaidCardAttachment = {
        fileContent: redFile.fileContent,
        fileName: redFile.fileName,
        fileType: 'COMMREG',
        fileCode: DocCode.COMMREG,
        dossierId: '',
      }
      this.prepaidCardAttachments.push(companyCR)
      this.form.get('companyCR').patchValue(companyCR.fileName)
    }
  }

  canProceed(){
    switch (this.wizardStep) {
      case 1:
        return this.validateStep1()
      case 3:
        if(this.authorization){
          return this.authorization.valid()
        }
        return true
      default:
        return this.validForm
    }
  }

  get validForm() {
    return this.form.valid || this.form.disabled
  }

    validateStep1() {
        if (this.selectedUserJourney == UserJourney.OWNER) {
            return this.form.controls['account'].valid && this.form.valid
        } else {
            return this.canProceedStep1 && this.form.controls['account'].valid
        }
    }

  showAddressModal() {
    this.addressModel.show()
  }

  closeAddressModal() {
    this.addressModel.hide()
    this.router.navigate(['#'])
  }

}
